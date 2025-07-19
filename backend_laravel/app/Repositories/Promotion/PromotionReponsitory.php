<?php

namespace App\Repositories\Promotion;

use App\Repositories\BaseRepository;
use App\Models\Promotion;
use Illuminate\Support\Facades\DB;

class PromotionReponsitory extends BaseRepository
{
    protected $model;

    public function __construct(Promotion $model)
    {
        $this->model = $model;
        parent::__construct($model);
    }

    public function getProductQuantityPromotion(int $productId = 0, array $catalogueId = [], array $variantId = [])
    {
        $now = now();
        $condition = [];
        $bindings = [$now, $now];
        $condition[] = 'ppq.product_id = ?';
        $bindings[] = $productId;

        if (count($catalogueId)) {
            $placeholders = str_repeat('?,', count($catalogueId) - 1) . '?';
            $condition[] = "ppq.product_catalogue_id IN ({$placeholders})";
            $bindings = array_merge($bindings, $catalogueId);
        }

        if (count($variantId)) {
            $placeholders = str_repeat('?,', count($variantId) - 1) . '?';
            $condition[] = "ppq.product_variant_id IN ({$placeholders})";
            $bindings = array_merge($bindings, $variantId);
        }

        $whereCondition = implode(' OR ', $condition);
        $query = "
            SELECT
            pr.id as promotion_id,
            pr.name as promotion_name,
            pr.code as promotion_code,
            pr.priority,
            pr.promotion_catalogue_id,
            pr.is_default,
            pr.default_discount_type,
            pr.default_discount_value,
            pr.default_min_quantity,
            ppq.product_id,
            ppq.product_variant_id,
            ppq.product_catalogue_id,
            ppq.min_quantity,
            ppq.max_discount,
            ppq.discount_value,
            ppq.discount_type,
            CASE when ppq.product_id IS NOT NULL then 'product'
                when ppq.product_variant_id IS NOT NULL then 'variant'
                when ppq.product_catalogue_id IS NOT NULL then 'catalogue'
                END as target_value
            FROM promotions as pr 
            INNER JOIN promotion_product_quantity as ppq ON pr.id = ppq.promotion_id
            WHERE 
                pr.publish = 2
                AND pr.start_date <= ? 
                AND (pr.end_date IS NULL OR pr.end_date >= ?)
                AND pr.promotion_catalogue_id = 2
                AND ({$whereCondition})
            ORDER BY pr.priority DESC, pr.promotion_catalogue_id
        ";
        return DB::select($query, $bindings);
    }

    public function getPrmotionProductCombo(int $productId = 0, array $variantId = [])
    {

        $condition = ['ppb.product_id = ?'];
        $bindings = [now(), now(), $productId];

        if (count($variantId)) {
            $placeholders = str_repeat('?,', count($variantId) - 1) . '?';
            $condition[] = "ppb.product_variant_id IN ({$placeholders})";
            $bindings = array_merge($bindings, $variantId);
        }

        $whereCondition = implode(' OR ', $condition);

        $query = "
            SELECT
            pr.id as promotion_id,
            pr.name as promotion_name,
            pr.code as promotion_code,
            pr.priority,
            pr.promotion_catalogue_id,
            ppb.product_id,
            ppb.product_variant_id,
            CASE 
                when ppb.product_id IS NOT NULL then 'product'
                when ppb.product_variant_id IS NOT NULL then 'variant'
                END as target_value
            FROM promotions as pr
            INNER JOIN promotion_product_combo as ppb ON ppb.promotion_id = pr.id 
            WHERE
               pr.publish = 2
                AND pr.start_date <= ? 
                AND (pr.end_date IS NULL OR pr.end_date >= ?)
                AND pr.promotion_catalogue_id = 2
                AND ({$whereCondition})
            ORDER BY pr.priority DESC, pr.promotion_catalogue_id
        ";
        return DB::select($query, $bindings);
    }


    public function getPrmotionProductBuyTakeGift(int $productId = 0, array $variantId = [])
    {
        $condition  = ['ppbtg.buy_product_id = ?'];
        $bindings = [now(), now(), $productId];
        if (count($variantId)) {
            $placeholders = str_repeat('?,', count($variantId) - 1) . '?';
            $condition[] = "ppbtg.buy_product_variant_id IN ({$placeholders})";
            $bindings = array_merge($bindings, $variantId);
        }

        $whereCondition = implode(' OR ', $condition);

        $query = "
            SELECT 
            pr.id as promotion_id,
            pr.name as promotion_name,
            pr.code as promotion_code,
            pr.priority,
            pr.promotion_catalogue_id,
            ppbtg.buy_product_id,
            ppbtg.buy_product_variant_id,
            ppbtg.take_product_id,
            ppbtg.take_product_variant_id,
            ppbtg.buy_quantity,
            CASE  when ppbtg.buy_product_id IS NOT NULL then 'product'
                when ppbtg.buy_product_variant_id IS NOT NULL then 'variant'
                END as target_value
            FROM promotions as pr 
            INNER JOIN promotion_product_buy_take_gift as ppbtg ON ppbtg.promotion_id = pr.id
            WHERE
               pr.publish = 2
                AND pr.start_date <= ? 
                AND (pr.end_date IS NULL OR pr.end_date >= ?)
                AND pr.promotion_catalogue_id = 2
                AND ({$whereCondition})
            ORDER BY pr.priority DESC, pr.promotion_catalogue_id
        ";
        return DB::select($query, $bindings);
    }
}
