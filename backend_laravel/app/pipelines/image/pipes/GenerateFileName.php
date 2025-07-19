<?php

namespace App\pipelines\image\pipes;
use  App\pipelines\image\pipes\AbtractPipeLine;
use Illuminate\Support\Str;

class GenerateFileName extends AbtractPipeLine {
//getClientOriginalName lấy tên gốc file ảnh bao gồm phần mở rộng (là phần đuôi file ảnh). 
// getClientOriginalExtension chỉ lấy phần mở rộng là lấy đuôi file
    public function handle($image, \Closure $next){
        if(!isset($image->fileName)){
            $ogirinalName = $image->originalFile->getClientOriginalName();
            $extension = $image->originalFile->getClientOriginalExtension();

            $image->fileName = Str::uuid().'.'.$extension;
            $image->originalName = $ogirinalName;
        }
        return $next($image);
    }
}