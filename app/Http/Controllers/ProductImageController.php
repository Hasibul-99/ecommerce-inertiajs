<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Jobs\ProcessProductImage;

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
     * Upload an image for a product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'image' => 'required|image|max:10240', // 10MB max
        ]);

        try {
            // Store the original image temporarily
            $path = $request->file('image')->store('temp/products', 'local');
            
            // Queue the image processing job
            ProcessProductImage::dispatch($product, $path);

            return response()->json([
                'message' => 'Image uploaded successfully and queued for processing',
            ], 202);
        } catch (\Exception $e) {
            Log::error('Product image upload failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to upload image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove an image from a product.
     *
     * @param  \App\Models\Product  $product
     * @param  int  $mediaId
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Product $product, $mediaId)
    {
        try {
            $media = $product->media()->findOrFail($mediaId);
            $media->delete();

            return response()->json([
                'message' => 'Image deleted successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Product image deletion failed: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to delete image',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}