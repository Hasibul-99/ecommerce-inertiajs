<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->get();

        return Inertia::render('Category/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Display the specified category.
     *
     * @param  string  $slug
     * @return \Inertia\Response
     */
    public function show($slug)
    {
        $category = Category::with('children')
            ->where('slug', $slug)
            ->firstOrFail();

        $products = $category->products()
            ->with(['images'])
            ->where('status', 'published')
            ->paginate(12);

        return Inertia::render('Category/Show', [
            'category' => $category,
            'products' => $products,
        ]);
    }
}