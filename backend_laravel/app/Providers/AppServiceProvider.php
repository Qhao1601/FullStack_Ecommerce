<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Interfaces\Auth\AuthServiceInterface;
use App\Services\Impl\Auth\AuthService;
use App\Services\Interfaces\User\UserCatalogueServiceInterface;
use App\Services\Impl\User\UserCatalogueService;

use App\Services\Interfaces\User\UserServiceInterface;
use App\Services\Impl\User\UserService;

use App\Services\Interfaces\User\PermissionServiceInterface;
use App\Services\Impl\User\PermissionService;

use App\Services\Interfaces\Post\PostCatalogueServiceInterface;
use App\Services\Impl\Post\PostCatalogueService;

use App\Services\Interfaces\Post\PostServiceInterface;
use App\Services\Impl\Post\PostService;


use App\Services\Interfaces\Brand\BrandServiceInterface;
use App\Services\Impl\Brand\BrandService;


use App\Services\Interfaces\Attribute\AttributeCatalogueServiceInterface;
use App\Services\Impl\Attribute\AttributeCatalogueService;

use App\Services\Interfaces\Attribute\AttributeServiceInterface;
use App\Services\Impl\Attribute\AttributeService;

use App\Services\Interfaces\Product\ProductCatalogueServiceInterface;
use App\Services\Impl\Product\ProductCatalogueService;

use App\Services\Interfaces\Product\ProductServiceInterface;
use App\Services\Impl\Product\ProductService;

use App\Services\Interfaces\Slides\SlidesServiceInterface;
use App\Services\Impl\Slides\SlidesService;


use App\Services\Interfaces\Product\ProductVariantServiceInterface;
use App\Services\Impl\Product\ProductVariantService;

use App\Services\Interfaces\Promotion\PromotionCatalogueServiceInterface;
use App\Services\Impl\Promotion\PromotionCatalogueService;

use App\Services\Interfaces\Promotion\PromotionServiceInterface;
use App\Services\Impl\Promotion\PromotionService;


use App\Services\Interfaces\Menu\MenuServiceInterface;
use App\Services\Impl\Menu\MenuService;


use App\Services\Interfaces\Menu\MenuCatalogueServiceInterface;
use App\Services\Impl\Menu\MenuCatalogueService;


use App\Services\Interfaces\Customer\CustomerServiceInterface;
use App\Services\Impl\Customer\CustomerService;

use App\Services\Interfaces\Order\OrderServiceInterface;
use App\Services\Impl\Order\OrderService;

use App\Services\Interfaces\Order\OrderItemServiceInterface;
use App\Services\Impl\Order\OrderItemService;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
        $this->app->bind(UserCatalogueServiceInterface::class, UserCatalogueService::class);

        $this->app->bind(UserServiceInterface::class, UserService::class);

        $this->app->bind(PermissionServiceInterface::class, PermissionService::class);

        $this->app->bind(PostCatalogueServiceInterface::class, PostCatalogueService::class);

        $this->app->bind(PostServiceInterface::class, PostService::class);

        $this->app->bind(BrandServiceInterface::class, BrandService::class);

        $this->app->bind(AttributeCatalogueServiceInterface::class, AttributeCatalogueService::class);

        $this->app->bind(AttributeServiceInterface::class, AttributeService::class);

        $this->app->bind(ProductCatalogueServiceInterface::class, ProductCatalogueService::class);

        $this->app->bind(ProductServiceInterface::class, ProductService::class);

        $this->app->bind(SlidesServiceInterface::class, SlidesService::class);

        $this->app->bind(ProductVariantServiceInterface::class, ProductVariantService::class);

        $this->app->bind(PromotionCatalogueServiceInterface::class, PromotionCatalogueService::class);

        $this->app->bind(PromotionServiceInterface::class, PromotionService::class);

        $this->app->bind(MenuServiceInterface::class, MenuService::class);

        $this->app->bind(MenuCatalogueServiceInterface::class, MenuCatalogueService::class);

        $this->app->bind(CustomerServiceInterface::class, CustomerService::class);


        $this->app->bind(OrderServiceInterface::class, OrderService::class);

        $this->app->bind(OrderItemServiceInterface::class, OrderItemService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
