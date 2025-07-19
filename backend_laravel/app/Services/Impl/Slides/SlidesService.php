<?php

namespace App\Services\Impl\Slides;

use App\Services\Interfaces\Slides\SlidesServiceInterface;
use App\Services\Impl\BaseService;
use App\Repositories\Slides\SlidesReponsitory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Resources\Slides\SlidesResource;
use App\Services\Impl\Upload\ImageService;
use Illuminate\Support\Facades\Log;

class SlidesService extends BaseService implements SlidesServiceInterface
{
  protected $imageService;
  protected $existingImage = [];
  private const CACHE_KEY = 'slides';

  public function __construct(SlidesReponsitory $reponsitory, ImageService $imageService)
  {
    parent::__construct($reponsitory);
    $this->cacheKeyPrefix = self::CACHE_KEY;
    $this->imageService = $imageService;
  }

  protected function prepareModelData(Request $request, ?int $id = null): self
  {
    $fillable = $this->reponsitory->getFillable();
    Log::info('Fillable fields:', $fillable);
    return $this->initilizeBasicData($request, $fillable)
      ->uploadSlideImages($request)
      ->handleSlideItems($request)
      ->removeAlbumImageItem($request, $id)
      ->uploadAlbum($request);
  }


  protected function initilizeBasicData(Request $request, array $fillable = []): self
  {

    $this->modelData = $request->only($fillable);
    $this->modelData['canonical'] = Str::slug($request->canonical);
    Log::info('Model data sau init:', $this->modelData); // Thêm dòng này
    return $this;
  }


  /**
   * Upload slide images nếu có file gửi lên
   * và cập nhật lại đường dẫn vào slide['image']
   */
  protected function uploadSlideImages(Request $request): self
  {
    if ($request->hasFile('slide.image')) {
      $files = $request->file('slide.image');
      $uploadedPaths = [];

      foreach ($files as $index => $file) {
        $config = [
          'files' => $file,
          'folder' => 'uploads/slides/' . now()->format('Ymd'),
          'pipelineKey' => 'default',
          'overrideOptions' => ['optimize' => ['quality' => 100]],
        ];
        $upload = $this->imageService->upload(...$config);
        $uploadedPaths[$index] = $upload['files']['path'];
      }

      // Replace input slide['image'] with uploaded paths
      $slideInput = $request->input('slide', []);
      $slideInput['image'] = $uploadedPaths;
      $request->merge(['slide' => $slideInput]);
    }

    return $this;
  }

  /**
   * Gộp các item slide thành mảng JSON: image + description
   */
  protected function handleSlideItems(Request $request): self
  {
    $slide = $request->input('slide', []);
    $items = [];

    if (is_array($slide) && isset($slide['image'])) {
      foreach ($slide['image'] as $index => $imagePath) {
        $items[] = [
          'image' => $imagePath,
          'description' => $slide['description'][$index] ?? '',
        ];
      }
    }

    $this->modelData['item'] = $items;
    return $this;
  }

  protected function uploadAlbum(Request $request): self
  {
    if ($request->hasFile('album')) {
      $config = [
        'files' => $request->file('album'),
        'folder' => Str::before($this->auth->user()->email, '@') . '/slides/album/' . now()->format('Ymd'),
        'pipelineKey' => 'default',
        'overrideOptions' => ['optimize' => ['quality' => 100]],
      ];

      $upload = $this->imageService->upload(...$config);
      $this->modelData['album'] = [...$this->existingImage, ...$upload['files']];
    } else {
      $this->modelData['album'] = $this->existingImage;
    }

    return $this;
  }

  protected function removeAlbumImageItem(Request $request, ?int $id = null): self
  {
    if ($id) {
      $record = $this->read($id);
      $this->existingImage = $record->album ?? [];

      $removeAlbums = $request->input('remove_images', []);
      if (!empty($removeAlbums) && !empty($this->existingImage)) {
        $albums = array_filter($this->existingImage, function ($item) use ($removeAlbums) {
          return !in_array($item['path'], $removeAlbums);
        });
        $this->existingImage = array_values($albums);
      }

      Log::info('Remaining album images:', $this->existingImage);
    }

    return $this;
  }

  public function getResource($resource, $type = 'model')
  {
    return $type === 'collection' ? SlidesResource::collection($resource) : new SlidesResource($resource);
  }
}
