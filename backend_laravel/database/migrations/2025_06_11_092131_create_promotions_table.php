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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('promotion_catalogue_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('code');
            $table->integer('combo_price')->nullable();
            $table->integer('priority');
            $table->text('description');
            $table->integer('default_discount_value')->nullable();
            $table->enum('default_discount_type', ['amount', 'range'])->nullable();
            $table->integer('default_min_quantity')->default(0)->nullable();
            $table->boolean('is_default')->default(false);
            $table->integer('usage_count')->default(0);
            $table->dateTime('start_date');
            $table->dateTime('end_date')->nullable(); // End = null
            $table->string('publish');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
