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
        Schema::table('cart_items', function (Blueprint $table) {
            // Xóa foreign key cũ
            $table->dropForeign(['cart_id']);

            // Thêm foreign key mới với onDelete('cascade')
            $table->foreign('cart_id')->references('id')->on('carts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cart_items', function (Blueprint $table) {
            // Xóa foreign key đã sửa
            $table->dropForeign(['cart_id']);
            // Thêm lại foreign key cũ
            $table->foreign('cart_id')->references('id')->on('carts');
        });
    }
};
