<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductImageController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Upload images for a product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'images' => 'required|array|min:1|max:10',
            'images.*' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max per image
        ]);

        try {
            $uploadedCount = 0;

            foreach ($request->file('images') as $image) {
                // Add image to product using Spatie Media Library
                $product->addMedia($image)
                    ->toMediaCollection('images');

                $uploadedCount++;
            }

            return redirect()->back()->with('success', "Successfully uploaded {$uploadedCount} image(s)");
        } catch (\Exception $e) {
            Log::error('Product image upload failed: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Failed to upload images: ' . $e->getMessage());
        }
    }

    /**
     * Remove an image from a product.
     *
     * @param  \App\Models\Product  $product
     * @param  int  $mediaId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product, $mediaId)
    {
        try {
            $media = $product->media()->findOrFail($mediaId);
            $media->delete();

            return redirect()->back()->with('success', 'Image deleted successfully');
        } catch (\Exception $e) {
            Log::error('Product image deletion failed: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'media_id' => $mediaId,
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Failed to delete image: ' . $e->getMessage());
        }
    }
}
