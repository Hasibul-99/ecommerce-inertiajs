<?php

if (!function_exists('activity')) {
    /**
     * No-op stub for spatie/laravel-activitylog (package not installed).
     * Returns a fluent object that silently discards all chained calls.
     */
    function activity(string $logName = 'default'): object
    {
        return new class {
            public function performedOn(mixed $model): static { return $this; }
            public function causedBy(mixed $causer): static   { return $this; }
            public function withProperties(mixed $properties): static { return $this; }
            public function withProperty(string $key, mixed $value): static { return $this; }
            public function log(string $description): void {}
        };
    }
}

if (!function_exists('settings')) {
    /**
     * Get a setting value by key.
     *
     * @param string|null $key
     * @param mixed $default
     * @return mixed|\App\Services\SettingService
     */
    function settings(?string $key = null, $default = null)
    {
        $service = app('settings');

        if ($key === null) {
            return $service;
        }

        return $service->get($key, $default);
    }
}
