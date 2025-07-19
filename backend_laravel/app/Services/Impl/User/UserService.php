<?php

namespace App\Services\Impl\User;

use App\Enums\Config\Common;
use App\Http\Resources\User\UserResource;
use App\Services\Interfaces\User\UserServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\User\UserReponsitory;
use App\Traits\HasCache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\RecordNotFoundException;
use Illuminate\Support\Facades\Lang;
use App\Services\Impl\Upload\ImageService;
use Illuminate\Support\Str;


class UserService extends BaseService implements UserServiceInterface
{

  use HasCache;
  protected $reponsitory;
  protected $modelData;
  protected $imageService;
  protected $with = ['user_catalogues'];


  public function __construct(UserReponsitory $reponsitory, ImageService $imageService)
  {
    $this->auth = auth(Common::API);
    $this->cacheKeyPrefix = 'users';
    $this->imageService = $imageService;
    parent::__construct($reponsitory);
  }

  // thêm mới dữ liệu .
  protected function prepareModelData(Request $request, ?int $id = null): self
  {
    $fillable = $this->reponsitory->getFillable();

    return $this->initilizeBasicData($request, $fillable)->uploadUserImage($request);
  }

  protected function initilizeBasicData(Request $request, array $fillable = []): self
  {
    $this->modelData = $request->only($fillable);
    $this->modelData['canonical'] = Str::slug($request->canonical);
    return $this;
  }

  // xử lý upImage 
  protected function uploadUserImage(Request $request): self
  {
    try {
      if ($request->hasFile('image')) {
        $config = [
          'files' => $request->file('image'),
          'folder' => Str::before($this->auth->user()->email, '@') . '/avatar/' . now()->format('Ymd'),
          'pipelineKey' => 'default',
          'overrideOptions' => [
            'optimize' => [
              'quality' => 100
            ]
          ]
        ];
        $uploadImage = $this->imageService->upload(...$config);
        $this->modelData['image'] = $uploadImage['files']['path'];
      }
      return $this;
    } catch (\Exception $e) {
      throw $e;
    }
  }

  // xóa 1 bản ghi của user_catalogue_user
  public function detactUserCatalogueFromUser(int $userId = 0, int $userCatalogueId = 0): void
  {
    DB::beginTransaction();
    try {
      // tìm user mình muốn xóa
      $user = $this->reponsitory->findById($userId);
      // và kiểm tra user có mối quan hệ trong bảng user_catalogue không . dựa vào model
      $hasRelation = $user->user_catalogues()->where('user_catalogue_id', $userCatalogueId)->exists();
      // nếu không xuất ra thông báo
      if (!$hasRelation) {
        throw new RecordNotFoundException(Lang::get('messages.record_relation_miss_match'));
      }
      // nếu có tức là đã có dữ liệu trong bảng trung gian (user_catalogue_user)
      // thì sẽ detach xóa trong bảng trung gian
      $user->user_catalogues()->detach($userCatalogueId);
      DB::commit();
    } catch (\Exception $e) {
      DB::rollBack();
      throw $e;
    }
  }


  public function getResource($resource, $type = 'model')
  {

    return $type === 'collection' ? UserResource::collection($resource) : new UserResource($resource);
  }
}
