<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HeroSlideController extends Controller
{
    /**
     * Display a listing of the hero slides.
     */
    public function index(): Response
    {
        $slides = HeroSlide::ordered()->get();

        return Inertia::render('Admin/HeroSlides/Index', [
            'slides' => $slides,
        ]);
    }

    /**
     * Show the form for creating a new hero slide.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/HeroSlides/Create');
    }

    /**
     * Store a newly created hero slide in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'button_text' => 'required|string|max:50',
            'button_link' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $slide = HeroSlide::create([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'button_text' => $validated['button_text'],
            'button_link' => $validated['button_link'],
            'order' => $validated['order'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if ($request->hasFile('image')) {
            $slide->addMediaFromRequest('image')
                ->toMediaCollection('hero_images');
        }

        return redirect()->route('admin.hero-slides.index')
            ->with('success', 'Hero slide created successfully.');
    }

    /**
     * Show the form for editing the specified hero slide.
     */
    public function edit(HeroSlide $heroSlide): Response
    {
        return Inertia::render('Admin/HeroSlides/Edit', [
            'slide' => $heroSlide->load('media'),
        ]);
    }

    /**
     * Update the specified hero slide in storage.
     */
    public function update(Request $request, HeroSlide $heroSlide): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'button_text' => 'required|string|max:50',
            'button_link' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
            'order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $heroSlide->update([
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? null,
            'description' => $validated['description'] ?? null,
            'button_text' => $validated['button_text'],
            'button_link' => $validated['button_link'],
            'order' => $validated['order'],
            'is_active' => $validated['is_active'] ?? $heroSlide->is_active,
        ]);

        if ($request->hasFile('image')) {
            $heroSlide->clearMediaCollection('hero_images');
            $heroSlide->addMediaFromRequest('image')
                ->toMediaCollection('hero_images');
        }

        return redirect()->route('admin.hero-slides.index')
            ->with('success', 'Hero slide updated successfully.');
    }

    /**
     * Remove the specified hero slide from storage.
     */
    public function destroy(HeroSlide $heroSlide): RedirectResponse
    {
        $heroSlide->delete();

        return redirect()->route('admin.hero-slides.index')
            ->with('success', 'Hero slide deleted successfully.');
    }

    /**
     * Update the order of hero slides.
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slides' => 'required|array',
            'slides.*.id' => 'required|exists:hero_slides,id',
            'slides.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['slides'] as $slideData) {
            HeroSlide::where('id', $slideData['id'])
                ->update(['order' => $slideData['order']]);
        }

        return redirect()->route('admin.hero-slides.index')
            ->with('success', 'Slide order updated successfully.');
    }

    /**
     * Toggle the active status of a hero slide.
     */
    public function toggleStatus(HeroSlide $heroSlide): RedirectResponse
    {
        $heroSlide->update([
            'is_active' => !$heroSlide->is_active,
        ]);

        $status = $heroSlide->is_active ? 'activated' : 'deactivated';

        return redirect()->route('admin.hero-slides.index')
            ->with('success', "Hero slide {$status} successfully.");
    }
}
