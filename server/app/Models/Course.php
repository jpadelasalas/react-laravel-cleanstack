<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'units',
    ];

    /**
     * The students that belong to the course.
     */
    public function students()
    {
        return $this->belongsToMany(Student::class)
            ->withPivot('enrolled_at')
            ->withTimestamps();
    }
}