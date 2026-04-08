<?php

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
