<?php

namespace App\pipelines\image\pipes;
use  App\pipelines\image\pipes\AbtractPipeLine;
use Illuminate\Support\Str;
use Intervention\Image\Encoders\GifEncoder;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\Encoders\WebpEncoder;

class OptimizeQualityPipeLine extends AbtractPipeLine {

    public function handle($image, \Closure $next){
        $quality = $this->options['quality'];
   
        $mime = $image->origin()->mediaType();
        
        $encoder = match ($mime) {
            'image/jpeg' => new JpegEncoder($quality),
            'image/png' => new PngEncoder($quality),
            'image/gif' => new GifEncoder($quality),
            'image/webp' => new WebpEncoder($quality),
        };
        $image->encoder = $encoder;
        return $next($image);
    }
}