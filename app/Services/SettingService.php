<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SettingService
{
    /**
     * Cache key for all settings.
     */
    protected const CACHE_KEY = 'app_settings';

    /**
     * Cache duration in seconds (24 hours).
     */
    protected const CACHE_DURATION = 86400;

    /**
     * Get a setting value by key.
     *
     * @param string $key Key in format 'group.key' or just 'key'
     * @param mixed $default Default value if setting not found
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        $settings = $this->getAllCached();

        // Handle 'group.key' format
        if (str_contains($key, '.')) {
            [$group, $settingKey] = explode('.', $key, 2);
            $fullKey = "{$group}.{$settingKey}";
            return $settings[$fullKey] ?? $default;
        }

        // Search across all groups
        foreach ($settings as $fullKey => $value) {
            if (str_ends_with($fullKey, ".{$key}")) {
                return $value;
            }
        }

        return $default;
    }

    /**
     * Set a setting value.
     *
     * @param string $key Key in format 'group.key'
     * @param mixed $value
     * @return bool
     */
    public function set(string $key, $value): bool
    {
        if (!str_contains($key, '.')) {
            throw new \InvalidArgumentException('Setting key must be in format "group.key"');
        }

        [$group, $settingKey] = explode('.', $key, 2);

        $setting = Setting::where('group', $group)
            ->where('key', $settingKey)
            ->first();

        if (!$setting) {
            throw new \RuntimeException("Setting {$key} not found");
        }

        $setting->setTypedValue($value);
        $result = $setting->save();

        $this->clearCache();

        return $result;
    }

    /**
     * Get all settings for a specific group.
     *
     * @param string $group
     * @return array
     */
    public function getGroup(string $group): array
    {
        $settings = $this->getAllCached();
        $groupSettings = [];

        foreach ($settings as $key => $value) {
            if (str_starts_with($key, "{$group}.")) {
                $settingKey = substr($key, strlen($group) + 1);
                $groupSettings[$settingKey] = $value;
            }
        }

        return $groupSettings;
    }

    /**
     * Get all settings with metadata for a group.
     *
     * @param string $group
     * @return array
     */
    public function getGroupWithMetadata(string $group): array
    {
        return Setting::where('group', $group)
            ->get()
            ->map(function ($setting) {
                return [
                    'key' => $setting->key,
                    'value' => $setting->getTypedValue(),
                    'type' => $setting->type,
                    'description' => $setting->description,
                    'is_public' => $setting->is_public,
                ];
            })
            ->keyBy('key')
            ->toArray();
    }

    /**
     * Update multiple settings in a group.
     *
     * @param string $group
     * @param array $settings
     * @return bool
     */
    public function updateGroup(string $group, array $settings): bool
    {
        foreach ($settings as $key => $value) {
            $setting = Setting::where('group', $group)
                ->where('key', $key)
                ->first();

            if ($setting) {
                $setting->setTypedValue($value);
                $setting->save();
            }
        }

        $this->clearCache();

        return true;
    }

    /**
     * Get all settings cached.
     *
     * @return array
     */
    protected function getAllCached(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_DURATION, function () {
            return $this->loadAllSettings();
        });
    }

    /**
     * Load all settings from database.
     *
     * @return array
     */
    protected function loadAllSettings(): array
    {
        return Setting::all()
            ->mapWithKeys(function ($setting) {
                $key = "{$setting->group}.{$setting->key}";
                return [$key => $setting->getTypedValue()];
            })
            ->toArray();
    }

    /**
     * Clear settings cache.
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Get all available setting groups.
     *
     * @return array
     */
    public function getGroups(): array
    {
        return Setting::select('group')
            ->distinct()
            ->orderBy('group')
            ->pluck('group')
            ->toArray();
    }

    /**
     * Create or update a setting.
     *
     * @param string $group
     * @param string $key
     * @param mixed $value
     * @param string $type
     * @param string|null $description
     * @param bool $isPublic
     * @return Setting
     */
    public function createOrUpdate(
        string $group,
        string $key,
        $value,
        string $type = 'string',
        ?string $description = null,
        bool $isPublic = false
    ): Setting {
        $setting = Setting::updateOrCreate(
            ['group' => $group, 'key' => $key],
            [
                'type' => $type,
                'description' => $description,
                'is_public' => $isPublic,
            ]
        );

        $setting->setTypedValue($value);
        $setting->save();

        $this->clearCache();

        return $setting;
    }

    /**
     * Handle file upload for setting.
     *
     * @param string $key
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $disk
     * @return string|null
     */
    public function uploadFile(string $key, $file, string $disk = 'public'): ?string
    {
        if (!str_contains($key, '.')) {
            throw new \InvalidArgumentException('Setting key must be in format "group.key"');
        }

        [$group, $settingKey] = explode('.', $key, 2);

        // Delete old file if exists
        $oldValue = $this->get($key);
        if ($oldValue && Storage::disk($disk)->exists($oldValue)) {
            Storage::disk($disk)->delete($oldValue);
        }

        // Store new file
        $path = $file->store("settings/{$group}", $disk);

        // Update setting
        $this->set($key, $path);

        return $path;
    }

    /**
     * Get public settings (for frontend).
     *
     * @return array
     */
    public function getPublicSettings(): array
    {
        return Cache::remember('public_settings', self::CACHE_DURATION, function () {
            return Setting::where('is_public', true)
                ->get()
                ->mapWithKeys(function ($setting) {
                    $key = "{$setting->group}.{$setting->key}";
                    return [$key => $setting->getTypedValue()];
                })
                ->toArray();
        });
    }
}
