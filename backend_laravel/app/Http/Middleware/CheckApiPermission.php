<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Repositories\User\PermissionReponsitory;
use App\Traits\loggable;
use Illuminate\Support\Str;
use App\Enums\Config\Common;
use App\Http\Controllers\Controller;
use App\Http\Resources\ApiResource;
use App\Models\Permission;

class CheckApiPermission
{
    use loggable;
    private $permissionReponsitory;
    private $auth;

    public function __construct(PermissionReponsitory $permissionReponsitory)
    {
        $this->permissionReponsitory = $permissionReponsitory;
        /**
         * @var \Tymon\JWTAuth\JWTGuard
         */
        $this->auth = auth(Common::API);
    }
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */

    // phân quyền .
    public function handle(Request $request, Closure $next): Response
    {
        // try {

        //     $action = $request->route()->getActionName();

        //     // explode cắt chuỗi
        //     [$controller, $method] = explode('@', $action);

        //     //str_replace cắt chuỗi và thêm chuỗi mới vào
        //     $controllerName = str_replace('_controller', 's', Str::snake(class_basename($controller)));

        //     $permissionName = "{$controllerName}:{$method}";
        //     if (!$permission = $this->permissionReponsitory->findByName($permissionName)) {
        //         return ApiResource::message("Không tìm thấy quyền trong danh sách", Response::HTTP_NOT_FOUND);
        //     }

        //     $requiredValue = $permission->value; //`4

        //     /** @var User user */

        //     $user = $this->auth->user();
        //     if (!$user) {
        //         return ApiResource::message("Không thể xác thực được User", Response::HTTP_UNAUTHORIZED);
        //     }

        //     $user->load(['user_catalogues.permissions']);
        //     if (!$user->user_catalogues) {
        //         return ApiResource::message("User chưa được cấp quyền", Response::HTTP_FORBIDDEN);
        //     }

        //     /*
        //         Quyền	Giá trị (thập phân)	Nhị phân
        //         View	1	0001
        //         Create	2	0010
        //         Edit	4	0100
        //         7 là 0111  4 là 0100  so sanh 
        //         0111 & 0100 = 0100 = 4

        //         & Bit 1	Bit 2	Kết quả (Bit 1 & Bit 2)
        //                 1	1	1
        //                 1	0	0
        //                 0	1	0
        //                 0	0	0
        //     */
        //     $hasPermission = false;
        //     foreach ($user->user_catalogues as $key => $val) {
        //         $permissions = $val->permissions->where('module', $controllerName)->pluck('value')->toArray();
        //         $totalPermissions = array_reduce($permissions, function ($carry, $item) {
        //             return $carry | $item;
        //         }, 0);
        //         if (($totalPermissions & $requiredValue) === $requiredValue) {
        //             $hasPermission = true;
        //             break;
        //         }
        //     }
        //     if (!$hasPermission) {
        //         return ApiResource::message("Bạn không có quyền truy cập vào chức năng này", Response::HTTP_FORBIDDEN);
        //     }
        // } catch (\Exception $e) {
        //     return $this->handleLogException($e);
        // }

        return $next($request);
    }
}
