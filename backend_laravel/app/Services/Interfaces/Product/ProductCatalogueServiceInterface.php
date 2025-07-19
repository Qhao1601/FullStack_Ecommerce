<?php

namespace App\Services\Interfaces\Product;

use App\Services\Interfaces\BaseServiceInterface;
use Illuminate\Http\Request;

interface ProductCatalogueServiceInterface extends BaseServiceInterface
{

    public function getCategoryHome();
}
