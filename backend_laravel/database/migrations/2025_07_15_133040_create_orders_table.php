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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('code')->unique();
            $table->string('fullname');
            $table->string('phone');
            $table->string('email');
            $table->string('address');
            $table->text('description')->nullable();
            $table->enum('payment_method', ['cod', 'paypal']);
            $table->enum('status', ['pending', 'paid', 'failed', 'canceled', 'success']);
            $table->float('sub_total')->default(0);
            $table->float('total_discount')->default(0);
            $table->float('total_amount')->default(0);
            $table->integer('total_quantity')->default(1);
            $table->integer('total_items')->default(1);
            $table->json('paypal_data')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
