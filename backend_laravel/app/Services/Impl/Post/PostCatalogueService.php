<?php

namespace App\Services\Impl\Post;

use App\Services\Interfaces\Post\PostCatalogueServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Post\PostCatalogueReponsitory;
use Illuminate\Support\Str;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Post\PostCatalogue\DetachPermissionRequest;
use App\Services\Impl\Upload\ImageService;
use App\Enums\Config\Common;
use App\Http\Resources\Post\PostCatalogueResource;
use App\Classes\Nested;
use App\Traits\HasHook;
use App\Traits\HasUpload;
use Illuminate\Support\Facades\Log;
use function PHPUnit\Framework\isNull;

class PostCatalogueService extends BaseService implements PostCatalogueServiceInterface
{

  use HasCache;
  use HasHook;
  use HasUpload;
  protected $reponsitory;
  protected $modelData;
  protected $imageService;
  protected $sort = ['lft', 'asc'];
  protected $nested;
  protected $existingImage = [];

  private const CACHE_KEY = 'post_catalogues';

  protected $with = ['users', 'posts.post_catalogues'];
  protected $basePath;

  public function __construct(PostCatalogueReponsitory $reponsitory, ImageService $imageService)
  {
    parent::__construct($reponsitory);
    $this->auth = auth(Common::API);
    // Kiểm tra xem user có đăng nhập không, nếu không có lấy customer email
    if ($this->auth->user()) {
      $email = $this->auth->user()->email;
    } else {
      // Fallback: get email from request or set as empty string
      $email = request()->input('email', '');
    }
    $this->basePath = Str::before($email, '@') . '/post_catalogues/' . now()->format('Ymd');
    $this->imageService = $imageService;
    $this->cacheKeyPrefix = self::CACHE_KEY;
  }

  // thêm mới dữ liệu .
  protected function prepareModelData(Request $request, ?int $id = null): self
  {
    $fillable = $this->reponsitory->getFillable();
    return $this->initilizeBasicData($request, $fillable)
      ->uploadImage($request, 'image', 'default');
  }


  protected function initilizeBasicData(request $request, array $fillable = []): self
  {
    $this->modelData = $request->only($fillable);
    $this->modelData['canonical'] = Str::slug($request->canonical);
    return $this;
  }

  public function complexFilter(): array
  {
    return [''];
  }

  protected function simpleFilter(): array
  {
    return ['publish', 'id', 'level'];
  }


  // xử lý người dùng lấy nhóm bài viết và bài viết
  public function getPostHome()
  {
    $customRequest = new Request();
    $customRequest->merge(
      [
        'type' => 'all',
        'publish' => 2,
        'order_by' => 'id,asc',
        // 'level' => 2
        'id' => 40
      ]
    );
    $response = $this->paginate($customRequest);
    return $response;
  }

  // protected function uploadImage(Request $request): self
  // {
  //   try {
  //     if ($request->hasFile('image')) {
  //       $config = [
  //         'files' => $request->file('image'),
  //         'folder' => Str::before($this->auth->user()->email, '@') . '/post_catalogues/' . now()->format('Ymd'),
  //         'pipelineKey' => 'default',
  //         'overrideOptions' => [
  //           'optimize' => [
  //             'quality' => 100
  //           ]
  //         ]
  //       ];

  //       $uploadImage = $this->imageService->upload(...$config);
  //       $this->modelData['image'] = $uploadImage['files']['path'];
  //     }
  //   } catch (\Exception $e) {
  //     throw $e;
  //   }
  //   return $this;
  // }

  // protected function uploadIcon(Request $request): self
  // {
  //   try {
  //     if ($request->hasFile('icon')) {
  //       $config = [
  //         'files' => $request->file('icon'),
  //         'folder' => Str::before($this->auth->user()->email, '@') . '/post_catalogues/' . now()->format('Ymd'),
  //         'pipelineKey' => 'default',
  //         'overrideOptions' => [
  //           'optimize' => [
  //             'quality' => 100
  //           ]
  //         ]
  //       ];

  //       $uploadImage = $this->imageService->upload(...$config);
  //       $this->modelData['icon'] = $uploadImage['files']['path'];
  //     }
  //   } catch (\Exception $e) {
  //     throw $e;
  //   }
  //   return $this;
  // }

  // protected function uploadAlbum(Request $request): self
  // {
  //   try {
  //     if ($request->hasFile('album')) {
  //       $config = [
  //         'files' => $request->file('album'),
  //         'folder' => Str::before($this->auth->user()->email, '@') . '/post_catalogues/album/' . now()->format('Ymd'),
  //         'pipelineKey' => 'default',
  //         'overrideOptions' => [
  //           'optimize' => [
  //             'quality' => 100
  //           ]
  //         ]
  //       ];
  //       $uploadImage = $this->imageService->upload(...$config);
  //       $this->modelData['album'] = [...$this->existingImage, ...$uploadImage['files']];
  //     } else {
  //       $this->modelData['album'] = $this->existingImage;
  //     }
  //     return $this;
  //   } catch (\Exception $e) {
  //     throw $e;
  //   }
  // }

  // protected function removeAlbumImageItem(Request $request, ?int $id = null): self
  // {
  //   if ($id) {
  //     $record = $this->read($request->route('post_catalogue'));
  //     $this->existingImage = $record->album;
  //     if ($request->hasFile('remove_images')) {
  //       $removeAlbums = $request->input('remove_images', []);
  //       if (count($removeAlbums)) {
  //         if (!isNull($record) && isset($record->album) && count($record->album)) {
  //           $albums = array_filter($record->album,  function ($item) use ($removeAlbums) {
  //             return !in_array($item['path'], $removeAlbums);
  //           });
  //           $this->existingImage = array_values($albums);
  //         }
  //       }
  //     }
  //     Log::info('existing Images', $this->existingImage);
  //   }
  //   return $this;
  // }

  // public function simpleFilter(): array
  // {
  //   return ['post_id'];
  // }


  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? PostCatalogueResource::collection($resource) : new PostCatalogueResource($resource);
  }

  // xử lý phân cấp danh mục
  protected function nestedSet()
  {
    $this->nested = new Nested([
      'table' => 'post_catalogues'
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
    // Kiểm tra xem đã nhận được id chưa
    if (empty($id)) {
      throw new \Exception('Không có ID để xử lý');
    }

    // Lưu giá trị id vào modelData
    $this->modelData['id'] = $id;

    // Nếu model chưa được khởi tạo, tìm model bằng repository
    if (is_null($this->model)) {
      $this->model = $this->reponsitory->findById($this->modelData['id']);
    }

    // Kiểm tra nếu model vẫn chưa được khởi tạo
    if (is_null($this->model)) {
      throw new \Exception('Không có dữ liệu model để xử lý');
    }

    // Kiểm tra số lượng bài viết liên quan
    $productCount = $this->model->posts()->count();  // Kiểm tra bài viết liên quan

    if ($productCount > 0) {
      throw new \Exception('Không thể xóa nhóm bài viết này vì đã có bài viết liên quan.');
    }

    return $this;
  }
}
