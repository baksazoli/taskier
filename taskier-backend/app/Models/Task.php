<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'description',
        'user_id',
        'estimated_time',
        'used_time',
        'completed_at'
    ];

    protected $dates = ['completed_at', 'deleted_at'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}