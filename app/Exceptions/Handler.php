<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render HTTP errors as Inertia pages for SPA requests.
     */
    public function render($request, Throwable $e)
    {
        $response = parent::render($request, $e);
        $status   = $response->getStatusCode();

        if ($request->header('X-Inertia') && in_array($status, [403, 404, 419, 429, 500, 503])) {
            return Inertia::render("Errors/{$status}", [
                'status'  => $status,
                'message' => $e->getMessage() ?: null,
            ])
            ->toResponse($request)
            ->setStatusCode($status);
        }

        return $response;
    }
}
