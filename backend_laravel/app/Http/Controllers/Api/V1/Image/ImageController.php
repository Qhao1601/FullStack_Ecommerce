<?php

namespace App\Http\Controllers\Api\V1\Image;

use App\Enums\Config\Common;
use App\Services\Impl\Upload\ImageService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    private $imageService;
    private $auth;

    public function __construct(ImageService $imageService)
    {
        $this->auth = auth(Common::API);
        $this->imageService = $imageService;
    }


    public function uploadTemp(Request $request)
    {
        $uploadConfig = [
            'files' => $request->file('file'),
            'folder' => Str::before($this->auth->user()->email, '@') . '/temp/' . 'session-' . $request->input('session_id'),
            'pipelineKey' => 'default',
        ];
        $result = $this->imageService->upload(...$uploadConfig);
        // dd($result);
        // ✅ Kiểm tra có key path hay không
        if (!isset($result['files']['path'])) {
            return response()->json(['error' => 'Upload failed: missing file path'], 500);
        }
        $response = [
            'id' => uniqid('temp_', true),
            'url' => url('storage/' . $result['files']['path'])
        ];
        return response()->json($response);
    }
}
