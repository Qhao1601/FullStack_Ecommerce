<?php

namespace App\Services\Public;

use Illuminate\Http\Request;
use App\Services\Impl\BaseService;
use App\Repositories\Product\ProductReponsitory;
use App\Http\Resources\Product\ProductResource;
use App\Services\Interfaces\Product\ProductCatalogueServiceInterface as ProductCatalogueService;


use function Termwind\parse;

class ProductService extends BaseService
{
    protected $productCatalogueService;
    protected $reponsitory;
    protected $with =
    [
        'product_catalogues',
        'users',
        'product_variants.variant_attributes',
        'product_variants.promotion_product_quantity',
        'product_variants.promotion_product_combo',
        'promotion_product_quantity',
        'promotion_product_combo'
    ];
    protected $filterCatalogue = 'product_catalogue_id';


    public function __construct(ProductReponsitory $reponsitory, ProductCatalogueService $productCatalogueService)
    {
        $this->reponsitory = $reponsitory;
        $this->productCatalogueService = $productCatalogueService;
        parent::__construct($reponsitory);
    }

    // thêm mới dữ liệu .
    protected function prepareModelData(Request $request, ?int $id = null): self
    {
        return $this;
    }

    public function getResource($resource, $type = 'model')
    {
        return $type === 'collection' ? ProductResource::collection($resource) : new ProductResource($resource);
    }


    public function specifications($request): array
    {
        $specs = parent::specifications($request);
        // has bắt xem có trường product_catalogue_id gửi lên k 
        if ($request->has($this->filterCatalogue)) {
            // nếu có lấy ra id của trường đó (tức là value của product_catalogue_id)
            $productCatalogueId = $request->get($this->filterCatalogue);
            // gọi nhóm sản phẩm đọc ra bản ghi đó 
            $productCatalogue = $this->productCatalogueService->read($productCatalogueId);
            //
            $customRequest = new Request();
            $customRequest->merge([
                'lft' => [
                    'gte' => $productCatalogue->lft
                ],
                'rgt' => [
                    'lte' => $productCatalogue->rgt
                ],
                'type' => 'all'
            ]);

            $children = $this->productCatalogueService->paginate($customRequest)->pluck('id')->toArray();
            $specs['filters']['category']['relation'] = 'product_catalogues';
            $specs['filters']['category']['children'] = $children;
            $specs['filters']['category']['field'] = $this->filterCatalogue;
        }
        return $specs;
    }
}
