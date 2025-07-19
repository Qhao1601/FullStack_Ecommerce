<?php

namespace App\Services\Impl\Upload;

use App\Enums\Config\Common;
use App\pipelines\image\ImagePileManager;
use Intervention\Image\ImageManager;

class ImageService
{

    protected $auth;
    protected $config;
    protected $uploadedFiles = [];
    protected $errors = [];

    protected $imagePileManager;

    public function __construct(ImagePileManager $imagePileManager)
    {
        $this->auth = auth(Common::API);
        $this->config = config('upload.image');
        $this->imagePileManager = $imagePileManager;
    }
    public function upload($files, $folder = null, $pipelineKey = 'default', array $overrideOptions = [])
    {
        try {
            if ($files) {
                $this->uploadedFiles = [];
                $this->errors = [];
                if (is_array($files) && count($files)) {
                    return $this->multipleUpload($files, $folder, $pipelineKey, $overrideOptions);
                }
                return $this->singleUpload($files, $folder, $pipelineKey, $overrideOptions);
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }

    private function multipleUpload($files, $folder, $pipelineKey, $overrideOptions)
    {
        $this->uploadedFiles = [];
        $this->errors = [];
        foreach ($files as $key => $file) {
            try {
                $result = $this->handleUpload($file, $folder, $pipelineKey, $overrideOptions);
                $this->uploadedFiles[] = $result;
            } catch (\Exception $e) {
                $this->errors[] = [
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ];
                return $this->generateReponse();
            }
        }
        return $this->generateReponse();
    }

    private function singleUpload($file, $folder = null, $pipelineKey = 'default', array $overrideOptions = [])
    {
        try {
            $result = $this->handleUpload($file, $folder, $pipelineKey, $overrideOptions);

            $this->uploadedFiles = $result;

            return $this->generateReponse();
        } catch (\Exception $e) {
            $this->errors[] = [
                // getClientOriginalName: lấy tên file gốc người dùng gửi lên
                'file' => $file->getClientOriginalName(),
                // lấy thông báo lổi từ exception
                'error' => $e->getMessage()
            ];
        }
        return $this->generateReponse();
    }


    private function handleUpload($file, $folder, $pipelineKey, $overrideOptions)
    {
        $overrideOptions['storage'] = array_merge(
            $overrideOptions['storage'] ?? [],
            ['path' => $this->buildPath($folder)]
        );
        $image = ImageManager::gd()->read($file);
        $image->originalFile = $file;

        $processImage = $this->imagePileManager->process($image, $pipelineKey, $overrideOptions);
        return [
            'path' => $processImage->path
        ];
    }





    private function generateReponse()
    {
        $response =  [
            // nếu === 0 thì true , khác 0 tức là có lổi bằng false
            'success' => count($this->errors) === 0,
            // những file upload thành công vào 1 mảng
            'files' => $this->uploadedFiles ?? [],
            // tổng file dc up lên
            'total_uploaded' => count($this->uploadedFiles ?? [])
        ];
        // nếu có lổi thì gán biến error vào response in ra lổi đó
        if (!empty($this->errors)) {
            $response['error'] = $this->errors;
        }

        return $response;
    }
    private function buildPath($folder = null)
    {
        return trim($this->config['base_path'] . '/' . $folder . '/');
    }
}
