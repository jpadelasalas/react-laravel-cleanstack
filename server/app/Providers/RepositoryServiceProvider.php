<?php

namespace App\Providers;

use App\Repositories\Interfaces\CourseRepositoryInterface;
use App\Repositories\Interfaces\StudentRepositoryInterface;
use App\Repositories\CourseRepository;
use App\Repositories\StudentRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider  extends ServiceProvider
{
    /**
     * Register any repository services.
     * Remember to register it in config/app
     */
    public function register(): void
    {
        //
        $this->app->bind(StudentRepositoryInterface::class, StudentRepository::class);
        $this->app->bind(CourseRepositoryInterface::class, CourseRepository::class);
    }

    /**
     * Bootstrap any repository services.
     */
    public function boot(): void
    {
        //
    }
}