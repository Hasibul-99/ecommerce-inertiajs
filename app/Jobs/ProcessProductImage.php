<?php

namespace App\Jobs;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProcessProductImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The product instance.
     *
     * @var \App\Models\Product
     */
    protected $product;

    /**
     * The path to the temporary image.
     *
     * @var string
     */
    protected $tempPath;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\Product  $product
     * @param  string  $tempPath
     * @return void
     */
    public function __construct(Product $product, string $tempPath)
    {
        $this->product = $product;
        $this->tempPath = $tempPath;
        $this->queue = 'media-processing';
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Get the temporary file
            $tempFile = Storage::disk('local')->get($this->tempPath);
            
            // Add the image to the product's media collection
            $this->product->addMediaFromString($tempFile)
                ->usingFileName(basename($this->tempPath))
                ->toMediaCollection('images');
            
            // Clean up the temporary file
            Storage::disk('local')->delete($this->tempPath);
            
            Log::info('Product image processed successfully', [
                'product_id' => $this->product->id,
                'temp_path' => $this->tempPath,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to process product image', [
                'product_id' => $this->product->id,
                'temp_path' => $this->tempPath,
                'error' => $e->getMessage(),
            ]);
            
            // Re-throw the exception to trigger job failure
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed(\Throwable $exception)
    {
        // Clean up the temporary file if it still exists
        if (Storage::disk('local')->exists($this->tempPath)) {
            Storage::disk('local')->delete($this->tempPath);
        }
        
        Log::error('Product image processing job failed', [
            'product_id' => $this->product->id,
            'temp_path' => $this->tempPath,
            'error' => $exception->getMessage(),
        ]);
    }
}