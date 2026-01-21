<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ImageOptimizationService
{
    // Image sizes for responsive images
    public const SIZES = [
        'thumbnail' => ['width' => 150, 'height' => 150],
        'small' => ['width' => 300, 'height' => 300],
        'medium' => ['width' => 600, 'height' => 600],
        'large' => ['width' => 1200, 'height' => 1200],
    ];

    /**
     * Optimize and store uploaded image with multiple sizes.
     */
    public function optimizeAndStore(UploadedFile $file, string $path = 'products'): array
    {
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $extension = $file->getClientOriginalExtension();
        $fileName = $this->generateFileName($originalName, $extension);

        $storedFiles = [];

        try {
            // Store original
            $originalPath = $file->storeAs($path, $fileName, 'public');
            $storedFiles['original'] = $originalPath;

            // Create and store resized versions
            foreach (self::SIZES as $sizeName => $dimensions) {
                $resizedPath = $this->createResizedVersion(
                    $file,
                    $path,
                    $fileName,
                    $sizeName,
                    $dimensions['width'],
                    $dimensions['height']
                );

                if ($resizedPath) {
                    $storedFiles[$sizeName] = $resizedPath;
                }
            }

            // Create WebP versions if supported
            if ($this->supportsWebP()) {
                $webpPath = $this->createWebPVersion($file, $path, $fileName);
                if ($webpPath) {
                    $storedFiles['webp'] = $webpPath;
                }
            }

            return $storedFiles;
        } catch (\Exception $e) {
            Log::error('Image optimization failed', [
                'file' => $fileName,
                'error' => $e->getMessage(),
            ]);

            // Clean up any stored files if optimization fails
            foreach ($storedFiles as $storedFile) {
                Storage::disk('public')->delete($storedFile);
            }

            throw $e;
        }
    }

    /**
     * Create a resized version of the image.
     */
    private function createResizedVersion(
        UploadedFile $file,
        string $path,
        string $fileName,
        string $sizeName,
        int $width,
        int $height
    ): ?string {
        try {
            $image = Image::make($file);

            // Resize maintaining aspect ratio
            $image->resize($width, $height, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize(); // Prevent upsizing
            });

            // Optimize quality
            $image->encode($file->getClientOriginalExtension(), 85);

            $resizedFileName = $this->getResizedFileName($fileName, $sizeName);
            $resizedPath = "{$path}/{$resizedFileName}";

            // Store resized image
            Storage::disk('public')->put($resizedPath, (string) $image->encode());

            return $resizedPath;
        } catch (\Exception $e) {
            Log::error('Image resize failed', [
                'file' => $fileName,
                'size' => $sizeName,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Create WebP version of the image.
     */
    private function createWebPVersion(UploadedFile $file, string $path, string $fileName): ?string
    {
        try {
            $image = Image::make($file);

            // Convert to WebP with quality 85
            $image->encode('webp', 85);

            $webpFileName = pathinfo($fileName, PATHINFO_FILENAME) . '.webp';
            $webpPath = "{$path}/{$webpFileName}";

            Storage::disk('public')->put($webpPath, (string) $image);

            return $webpPath;
        } catch (\Exception $e) {
            Log::error('WebP conversion failed', [
                'file' => $fileName,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Generate unique filename.
     */
    private function generateFileName(string $originalName, string $extension): string
    {
        $sanitized = preg_replace('/[^a-z0-9]+/i', '-', strtolower($originalName));
        $sanitized = trim($sanitized, '-');

        return sprintf(
            '%s-%s.%s',
            $sanitized,
            uniqid(),
            $extension
        );
    }

    /**
     * Get resized filename.
     */
    private function getResizedFileName(string $fileName, string $sizeName): string
    {
        $info = pathinfo($fileName);
        return sprintf('%s-%s.%s', $info['filename'], $sizeName, $info['extension']);
    }

    /**
     * Check if WebP is supported.
     */
    private function supportsWebP(): bool
    {
        return function_exists('imagewebp');
    }

    /**
     * Delete all versions of an image.
     */
    public function deleteImage(array $paths): void
    {
        foreach ($paths as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }
    }

    /**
     * Get responsive image URLs.
     */
    public function getResponsiveUrls(string $originalPath): array
    {
        $info = pathinfo($originalPath);
        $directory = $info['dirname'];
        $filename = $info['filename'];
        $extension = $info['extension'];

        $urls = [
            'original' => Storage::disk('public')->url($originalPath),
        ];

        foreach (self::SIZES as $sizeName => $dimensions) {
            $resizedPath = "{$directory}/{$filename}-{$sizeName}.{$extension}";
            if (Storage::disk('public')->exists($resizedPath)) {
                $urls[$sizeName] = Storage::disk('public')->url($resizedPath);
            }
        }

        // Add WebP version if exists
        $webpPath = "{$directory}/{$filename}.webp";
        if (Storage::disk('public')->exists($webpPath)) {
            $urls['webp'] = Storage::disk('public')->url($webpPath);
        }

        return $urls;
    }
}
