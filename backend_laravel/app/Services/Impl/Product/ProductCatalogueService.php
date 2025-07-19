<?php

namespace App\Services\Impl\Product;

use App\Services\Interfaces\Product\ProductCatalogueServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Product\ProductCatalogueReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Product\ProductCatalogue\DetachPermissionRequest;
use App\http\Resources\Product\ProductCatalogueResource;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use App\Services\Impl\Upload\ImageService;
use App\Classes\Nested;
use function PHPUnit\Framework\isNull;
use App\Enums\Config\Common;
use App\Http\Resources\Product\productCatalogueWithProductResource;
use App\Traits\HasUpload;
use App\Models\Product;



class ProductCatalogueService extends BaseService implements ProductCatalogueServiceInterface
{

  use HasCache;
  use HasUpload;
  protected $reponsitory;
  protected $modelData;
  protected $sort = ['lft', 'asc'];
  protected $imageService;
  protected $nested;
  protected $existingImage = [];
  protected $basePath;
  protected $with = ['users'];

  private const CACHE_KEY = 'product_catalogues';
  private $context = null;

  public function __construct(ProductCatalogueReponsitory $reponsitory, ImageService $imageService)
  {
    parent::__construct($reponsitory);
    $this->auth = auth(Common::API);
    $this->cacheKeyPrefix = self::CACHE_KEY;
    // Kiểm tra xem user có đăng nhập không, nếu không có lấy customer email
    if ($this->auth->user()) {
      $email = $this->auth->user()->email;
    } else {
      // Fallback: get email from request or set as empty string
      $email = request()->input('email', '');
    }
    $this->basePath = Str::before($email, '@') . '/product_catalogues/' . now()->format('Ymd');
    //  $this->basePath = Str::before($this->auth->user()->email, '@') . '/products/' . now()->format('Ymd');
    $this->imageService = $imageService;
  }

  private function setContext($context): self
  {
    $this->context = $context;
    return $this;
  }


  // thêm mới dữ liệu .
  protected function prepareModelData(Request $request, ?int $id = null): self
  {
    $fillable = $this->reponsitory->getFillable();
    return $this->initilizeBasicData($request, $fillable)
      ->uploadImage($request, 'image', 'default');
    // ->uploadImage($request)
    // ->removeAlbumImageItem($request, $id)
    // ->uploadAlbum($request);
  }



  protected function initilizeBasicData(request $request, array $fillable = []): self
  {
    $this->modelData = $request->only($fillable);
    $this->modelData['canonical'] = Str::slug($request->canonical);
    return $this;
  }

  protected function simpleFilter(): array
  {
    return ['publish', 'parent_id', 'level'];
  }

  public function complexFilter(): array
  {
    return ['id', 'lft', 'rgt'];
  }

  // lấy sản phẩm theo danh mục
  public function getCategoryHome()
  {

    $customerRequest = new Request();
    $customerRequest->merge([
      'publish' => 2,
      'level' => 1,
      'tpye' => 'all',
      'sort_by' => 'order,asc',
      // lấy ra 2 danh mục
      // 'perpage' => 2,
    ]);
    // dd($customerRequest);
    $context = [
      'customRequest' => $customerRequest
    ];

    return $this->setContext($context)
      ->getCategoryByCondition()
      ->getChildrenCategories()
      ->getProductFromCategories()
      ->groupProductByCategory()
      ->buildResult();
  }

  // lấy dữ liệu từ request gửi lên và đính url thông qua phương thức simpleFilter() nằm trong paginate.
  // lọc được dữ liệu của request thì ta ...(xử lý tiếp dưới)
  private function getCategoryByCondition(): self
  {
    $categories = $this->paginate($this->context['customRequest']);

    $this->context['categories'] = $categories;
    return $this;
  }

  // lọc được dữ liệu request thì ra lọc ra children . từ danh mục cha lấy ra được danh mục con thông qua lft rgt
  private function getChildrenCategories(): self
  {
    // Lấy các categories trong context
    $categories = $this->context['categories'];

    // Nếu danh sách categories rỗng, trả về children rỗng
    if ($categories->isEmpty()) {
      $this->context['children'] = [];
      return $this;
    }
    // Xử lý để tạo điều kiện truy vấn lft và rgt từ các category hiện tại
    $parentConditions = $categories->map(function ($category) {
      return [
        'lft' => $category->lft,
        'rgt' => $category->rgt
      ];
    })->toArray();
    // Truy vấn từ mô hình (model) để lấy các category con
    $childrens = $this->reponsitory->getModel()
      ->where('publish', 2)
      ->where(function ($query) use ($parentConditions) {
        // Duyệt qua các điều kiện parent và thêm vào truy vấn
        foreach ($parentConditions as $condition) {
          $query->orWhere(function ($subQuery) use ($condition) {
            // Điều kiện tìm kiếm con với lft >= lft và rgt <= rgt
            $subQuery->where('lft', '>=', $condition['lft'])
              ->where('rgt', '<=', $condition['rgt']);
          });
        }
      })->get();
    $this->context['childrenIds'] = $childrens->pluck('id')->toArray();
    $this->context['childrens'] = $childrens;

    return $this;
  }

  // lấy ra tất cả sản phẩm 
  private function getProductFromCategories(): self
  {
    $childrensId = $this->context['childrenIds'];
    if (empty($childrensId)) {
      $this->context['products'] = collect([]);
      return $this;
    }

    $products = Product::with(
      [
        'product_catalogues',
        'users',
        'product_variants.variant_attributes',
        'product_variants.promotion_product_quantity',
        'product_variants.promotion_product_combo',
        'promotion_product_quantity',
        'promotion_product_combo'
      ]
    )->whereHas('product_catalogues', function ($query) use ($childrensId) {
      $query->whereIn('product_catalogue_id', $childrensId);
    })->where('publish', 2)->get();
    $this->context['products'] = $products;
    return $this;
  }


  // group các sản phẩm theo nhóm sản phẩm .
  private function groupProductByCategory(): self
  {
    $products = $this->context['products'];
    $childrensId = $this->context['childrenIds'];

    $productsByCategory = [];
    foreach ($products as $product) {
      foreach ($product->product_catalogues as $catalogue) {
        if (in_array($catalogue->id, $childrensId)) {
          $productsByCategory[$catalogue->id][] = $product;
        }
      }
    }
    $this->context['productsByCategory'] = $productsByCategory;
    return $this;
  }

  private function buildResult()
  {
    $categories = $this->context['categories'];
    $productsByCategory  = $this->context['productsByCategory'];

    if ($categories->isEmpty()) return [];

    $allChildren = $this->reponsitory->getModel()->whereIn('id', $this->context['childrenIds'])->get()->keyBy('id');

    $result = [];
    foreach ($categories as $category) {
      $categoryChildren = $allChildren->filter(function ($child) use ($category) {
        return $child->lft >= $category->lft &&
          $child->rgt <= $category->rgt &&
          $child->id !== $category->id;
      });

      $allCategoryIds = array_merge([$category->id], $categoryChildren->pluck('id')->toArray());

      $categoryProducts = [];
      foreach ($allCategoryIds as $catId) {
        if (isset($productsByCategory[$catId])) {
          $categoryProducts = array_merge($categoryProducts, $productsByCategory[$catId]);
        }
      }

      // foreach ($categoryChildren as $child) {
      //   dd($child->id);
      //   $childProduct = collect($productsByCategory[$child->id]) ?? [];
      //   $child->setRelation('products', $childProduct);
      // }
      foreach ($categoryChildren as $child) {
        // Kiểm tra nếu không có sản phẩm cho category này, thì gán mảng rỗng
        $childProduct = collect($productsByCategory[$child->id] ?? []);

        // Nếu $childProduct là collection rỗng, gán nó là mảng rỗng
        if ($childProduct->isEmpty()) {
          $childProduct = collect([]);
        }

        $child->setRelation('products', $childProduct);
      }

      $category->setRelation('children', $categoryChildren->values());
      $category->setRelation('products', collect($categoryProducts)->unique('id')->values());
    }

    return productCatalogueWithProductResource::collection($categories);
  }


  // xử lý phân cấp danh mục
  protected function nestedSet()
  {
    $this->nested = new Nested([
      'table' => 'product_catalogues'
    ]);
    $this->callNested($this->nested);
  }

  /*
  + orveride lại phương thức afterSave vì sản phẩm phải được lưu thành công thì mới move hình ảnh vào folder đích
  + đang để ở phần prepareModelData dẫn đến việc khi chuẩn bị dữ liệu thì đã move ảnh vào -> nên nếu sản phẩm khởi tạo không
  thành công thì hình ảnh sẽ bị mất trong folder đích
  */
  protected function afterSave(Request $request): self
  {
    $this->nestedSet();
    $this->moveImages($request);
    return  $this->clearSingleRecordCache()->cacheSingleRecord()->clearCollectionRecordCache();
  }

  protected function afterDelete(): self
  {
    $this->nestedSet();
    return $this->clearSingleRecordCache()->clearCollectionRecordCache();
  }

  protected function beforeDelete($id): self
  {
    if (empty($id)) {
      throw new \Exception("Không có id");
    }
    $this->modelData['id'] = $id;

    if (is_null($this->model)) {
      $this->model = $this->reponsitory->findById($this->modelData['id']);
    }
    $hasProduct = $this->model->products()->count();
    if ($hasProduct) {
      throw new \Exception("Bạn không thể xóa nhóm sản phẩm vì đã có sản phẩm");
    }
    return $this;
  }

  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? ProductCatalogueResource::collection($resource) : new ProductCatalogueResource($resource);
  }
}
