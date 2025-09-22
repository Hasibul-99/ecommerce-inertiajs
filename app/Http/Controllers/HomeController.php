<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    /**
     * Display the about us page.
     *
     * @return \Inertia\Response
     */
    public function aboutUs()
    {
        return Inertia::render('AboutUs/Index');
    }

    /**
     * Display the contact us page.
     *
     * @return \Inertia\Response
     */
    public function contactUs()
    {
        return Inertia::render('ContactUs/Index');
    }

    /**
     * Handle contact form submission.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function submitContactForm()
    {
        // Handle contact form submission
        return redirect()->back()->with('success', 'Your message has been sent!');
    }
}