<?php

namespace App\pipelines\image;

use App\pipelines\image\pipes\GenerateFileName;
use App\pipelines\image\pipes\SaveImagePipeLine;
use App\pipelines\image\pipes\OptimizeQualityPipeLine;
use Illuminate\Pipeline\Pipeline;

class ImagePileManager
{

    protected $defaultPipeline = [
        'generate_filename' => GenerateFileName::class,
        'optimize' => OptimizeQualityPipeLine::class,
        'storage' => SaveImagePipeLine::class
    ];

    public function process($image, string $configKey = '', array $overrideOptions = [])
    {
        // lấy ra các dữ liệu nằm trong default . do pileline truyền vào default và configKey lấy dữ liệu default.
        $pipelineConfig = config("upload.image.pipelines.{$configKey}");

        // chuyển về 1 collectionn và filter trong collect đó lọc ra enable = true
        $pipes = collect($pipelineConfig)->filter(fn($config) => $config['enable'] ?? true)
            // duyệt qua tất cả mảng trong default ($pipeName là tên mảng , config là data bên trong mảng đó )
            ->map(function ($config, $pipeName) use ($overrideOptions) {
                // kiểm tra xem pipeName có trong class GenerateFileName::class không 
                $class = $this->defaultPipeline[$pipeName] ?? null;
                // nếu không tìm thấy bỏ qua
                if (!$class) return null;

                // tạo class mới truyền vào coffig 
                return new $class(array_merge(
                    $config,
                    $overrideOptions[$pipeName] ?? []
                ));
            })->filter() // xóa các phần từ null
            ->values() // reset lại chỉ số của mảng
            ->toArray(); // từ collection chuyển về mảng

        return app(Pipeline::class)->send($image)->through($pipes)->thenReturn();
    }
}
