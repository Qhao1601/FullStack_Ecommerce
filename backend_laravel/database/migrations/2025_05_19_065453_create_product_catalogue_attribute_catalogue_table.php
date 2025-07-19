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
        Schema::create('product_catalogue_attribute_catalogue', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_catalogue_id');
            $table->unsignedBigInteger('attribute_catalogue_id');
            $table->foreign('product_catalogue_id', 'pc_ac_pc_id_foreign')->references('id')->on('product_catalogues')->onDelete('cascade');
            $table->foreign('attribute_catalogue_id', 'pc_ac_ac_id_foreign')->references('id')->on('attribute_catalogues')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_catalogue_attribute_catalogue');
    }
};
