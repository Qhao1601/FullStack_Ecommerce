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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // user_catalogue.view | user_catalogue.store
            $table->string('module');// user_catalogue , user...
            $table->integer('value');// giá trị nhị phân của phân quyền
            $table->string('title');// tên hiển thị: xem danh sách thành viên
            $table->text('description')->nullable();// mô tả
            $table->timestamps();
            $table->unique(['module','value']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
