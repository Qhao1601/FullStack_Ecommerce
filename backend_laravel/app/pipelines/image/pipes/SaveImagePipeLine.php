<?php

namespace App\pipelines\image\pipes;

use  App\pipelines\image\pipes\AbtractPipeLine;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class SaveImagePipeLine extends AbtractPipeLine
{

    public function handle($image, \Closure $next)
    {

        $disk = $this->options['disk'] ?? config('upload.image.disk');
        $path = trim($this->options['path'] . $image->fileName, '/');
        Storage::disk($disk)->put($path, (string)$image->encode($image->encoder));
        $image->path = $path;
        return $next($image);
    }
}
