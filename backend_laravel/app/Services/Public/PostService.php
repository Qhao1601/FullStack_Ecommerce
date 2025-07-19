<?php

namespace App\Services\Public;

use Illuminate\Http\Request;
use App\Services\Impl\BaseService;
use App\Http\Resources\Post\PostResource;
use App\Services\Interfaces\Post\PostCatalogueServiceInterface as PostCatalogueService;
use App\Repositories\Post\PostReponsitory;


class PostService extends BaseService
{
    protected $postCatalogueService;
    protected $reponsitory;
    protected $with =
    [
        'post_catalogues',
        'users',
    ];
    protected $filterCatalogue = 'post_catalogue_id';


    public function __construct(PostReponsitory $reponsitory, PostCatalogueService $postCatalogueService)
    {
        $this->reponsitory = $reponsitory;
        $this->postCatalogueService = $postCatalogueService;
        parent::__construct($reponsitory);
    }

    // thêm mới dữ liệu .
    protected function prepareModelData(Request $request, ?int $id = null): self
    {
        return $this;
    }

    public function getResource($resource, $type = 'model')
    {
        return $type === 'collection' ? PostResource::collection($resource) : new PostResource($resource);
    }


    public function specifications($request): array
    {
        $specs = parent::specifications($request);
        // has bắt xem có trường product_catalogue_id gửi lên k 
        if ($request->has($this->filterCatalogue)) {
            // nếu có lấy ra id của trường đó (tức là value của product_catalogue_id)
            $productCatalogueId = $request->get($this->filterCatalogue);
            // gọi nhóm sản phẩm đọc ra bản ghi đó 
            $productCatalogue = $this->postCatalogueService->read($productCatalogueId);
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

            $children = $this->postCatalogueService->paginate($customRequest)->pluck('id')->toArray();
            $specs['filters']['category']['relation'] = 'post_catalogues';
            $specs['filters']['category']['children'] = $children;
            $specs['filters']['category']['field'] = $this->filterCatalogue;
        }
        return $specs;
    }
}
