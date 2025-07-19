<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class ConvertCamelCaseToSnackeCase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */


    // phương thức đồng bộ là  cameslcase thành came_snake vd(lastname chuyển thành => last_name)
    // chuyển đổi trước khi request gửi đi
    public function handle(Request $request, Closure $next): Response
    {

        $input = collect($request->all())
            ->mapwithKeys(function ($value, $key) {
                return [Str::snake($key) => $value];
            })->all();
        $request->replace($input);
        return $next($request);
    }
}
