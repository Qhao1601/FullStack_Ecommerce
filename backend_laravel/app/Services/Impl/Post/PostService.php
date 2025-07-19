<?php

namespace App\Services\Impl\Post;

use App\Services\Interfaces\Post\PostServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Post\PostReponsitory;
use Nette\Utils\Arrays;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use App\Http\Requests\Post\Post\DetachPermissionRequest;
use App\Http\Resources\Post\PostResource;
use Illuminate\Support\Facades\Log;
use function PHPUnit\Framework\isNull;
use Illuminate\Support\Str;
use App\Classes\Nested;
use App\Enums\Config\Common;
use App\Traits\HasUpload;
use App\Services\Impl\Upload\ImageService;

class PostService extends BaseService implements PostServiceInterface
{

  use HasCache;
  use HasUpload;
  protected $reponsitory;
  protected $modelData;
  protected $nested;
  protected $imageService;
  protected $existingImage = [];
  protected $basePath;

  private const CACHE_KEY = 'posts';

  protected $with = ['post_catalogues', 'users'];

  public function __construct(PostReponsitory $reponsitory, ImageService $imageService)
  {
    parent::__construct($reponsitory);
    $this->auth = auth(Common::API);
    if ($this->auth->user()) {
      $email = $this->auth->user()->email;
    } else {
      // Fallback: get email from request or set as empty string
      $email = request()->input('email', '');
    }
    $this->basePath = Str::before($email, '@') . '/posts/' . now()->format('Ymd');
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

  // protected function uploadImage(Request $request): self
  // {
  //   try {
  //     if ($request->hasFile('image')) {
  //       $config = [
  //         'files' => $request->file('image'),
  //         'folder' => Str::before($this->auth->user()->email, '@') . '/posts/' . now()->format('Ymd'),
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
  //         'folder' => Str::before($this->auth->user()->email, '@') . '/posts/album/' . now()->format('Ymd'),
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
  //   } catch (\Exception $e) {
  //     throw $e;
  //   }
  //   return $this;
  // }

  // protected function removeAlbumImageItem(Request $request, ?int $id = null): self
  // {
  //   if ($id) {
  //     $record = $this->read($request->route('post'));
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

  /*
  + orveride lại phương thức afterSave vì sản phẩm phải được lưu thành công thì mới move hình ảnh vào folder đích
  + đang để ở phần prepareModelData dẫn đến việc khi chuẩn bị dữ liệu thì đã move ảnh vào -> nên nếu sản phẩm khởi tạo không
  thành công thì hình ảnh sẽ bị mất trong folder đích
  */
  protected function afterSave(Request $request): self
  {
    $this->moveImages($request);
    return  $this->clearSingleRecordCache()->cacheSingleRecord()->clearCollectionRecordCache();
  }


  protected function nestedSet()
  {
    $this->nested = new Nested([
      'table' => 'post_catalogues'
    ]);
    $this->callNested($this->nested);
  }

  protected function afterDelete(): self
  {
    $this->nestedSet();
    return $this->clearSingleRecordCache()->clearCollectionRecordCache();
  }


  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? PostResource::collection($resource) : new PostResource($resource);
  }


  protected function simpleFilter(): array
  {
    return ['publish', 'post_catalogue_id'];
  }
}
