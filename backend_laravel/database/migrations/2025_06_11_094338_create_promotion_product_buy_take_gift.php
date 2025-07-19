<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('promotion_product_buy_take_gift', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('buy_product_id')->nullable();
            $table->unsignedBigInteger('buy_product_variant_id')->nullable();
            $table->unsignedBigInteger('take_product_id')->nullable();
            $table->unsignedBigInteger('take_product_variant_id')->nullable();
            $table->integer('buy_quantity')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_product_buy_take_gift');
    }
};
