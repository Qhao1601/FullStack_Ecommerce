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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('brand_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name')->nullable();
            $table->string('code', 50)->unique();
            $table->string('canonical')->unique();
            $table->integer('price');
            $table->string('made_in');
            $table->string('description')->nullable();
            $table->longText('content')->nullable();
            $table->longText('meta_description')->nullable();
            $table->string('meta_keyword')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('image')->nullable();
            $table->string('icon')->nullable();
            $table->longText('album')->nullable();
            $table->tinyInteger('publish')->default(2);
            $table->integer('order')->default(0);
            $table->integer('product_catalogue_id')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
