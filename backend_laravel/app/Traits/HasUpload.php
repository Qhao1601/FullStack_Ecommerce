<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

trait HasUpload
{
    protected function uploadImage(Request $request, string $name = '', $pipeline = 'default'): self
    {
        try {
            if ($request->hasFile($name)) {
                $config = [
                    'files' => $request->file($name),
                    'folder' => $this->basePath,
                    'pipelineKey' => $pipeline,
                    'overrideOptions' => [
                        'optimize' => [
                            'quality' => 100
                        ]
                    ]
                ];

                $uploadImage = $this->imageService->upload(...$config);
                $this->modelData[$name] = $uploadImage['files']['path'];
            }
        } catch (\Exception $e) {
            throw $e;
        }
        return $this;
    }


    // xử lý move album
    protected function moveImages(Request $request, $name = 'album'): self
    {
        if (!$request->has($name) || !is_array($request->{$name})) {
            return $this;
        }
        $albumData = $request->input($name);
        $moveAlbum = [];

        foreach ($albumData as $key => $val) {
            if (isset($val['path']) && strpos($val['path'], 'temp/') !== false) {
                $oldPath = str_replace('storage/', '', $val['path']);
                $filename = basename($oldPath);
                $newPath = config('upload.image.base_path') . '/' . $this->basePath . '/' . $filename;

                Log::info('oldPath:', [$oldPath]);
                Log::info('newPath:', [$newPath]);

                if (Storage::disk('public')->exists($oldPath) && Storage::disk('public')->move($oldPath, $newPath)) {
                    $moveAlbum[] = ['path' => $newPath];
                } else {
                    if (Storage::disk('public')->exists($oldPath) && Storage::disk('public')->copy($oldPath, $newPath)) {
                        $moveAlbum[] = ['path' => $newPath];
                    }
                }
            } else {
                $clearPath = str_replace('storage/', '', $val['path']);
                if (!str_starts_with($clearPath, '')) {
                    $clearPath = '/' . $clearPath;
                }
                $moveAlbum[] = ['path' => $clearPath];
            }
        }

        Log::info('moveAlbum', $moveAlbum);

        //move album xong thì update lại model luôn chứ không cần gán vào modelData để thêm mới nửa -->
        // đấy đây Model đã được kích hoạt rồi 
        $this->model->update([$name => $moveAlbum]);

        $this->modelData[$name] = $moveAlbum;
        Log::info('album', $this->modelData['album']);
        return $this;
    }
}
