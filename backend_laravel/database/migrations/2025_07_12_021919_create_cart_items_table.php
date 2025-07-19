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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cart_id')->constrained()->delete('cascade');
            $table->string('client_id');  // ID từ reactjs Product_variantId
            $table->foreignId('product_id');
            $table->foreignId('product_variant_id')->nullable()->constrained()->delete('cascade');
            $table->string('product_name');
            $table->string('product_image')->nullable();
            $table->string('product_code');
            $table->string('variant_sku')->nullable();
            $table->json('selected_attributes')->nullable();
            $table->float('original_price')->default(0);
            $table->float('final_price')->default(0);
            $table->float('discount')->default(0);
            $table->integer('quantity')->default(1);
            $table->float('total_price')->default(0);
            $table->timestamps();


            $table->unique(['cart_id', 'client_id']);
            $table->index(['cart_id', 'product_id']);
            $table->index(['product_id', 'product_variant_id']);
            $table->index(['client_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
