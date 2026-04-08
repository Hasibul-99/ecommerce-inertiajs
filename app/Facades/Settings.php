<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static mixed get(string $key, $default = null)
 * @method static bool set(string $key, $value)
 * @method static array getGroup(string $group)
 * @method static array getGroupWithMetadata(string $group)
 * @method static bool updateGroup(string $group, array $settings)
 * @method static void clearCache()
 * @method static array getGroups()
 * @method static \App\Models\Setting createOrUpdate(string $group, string $key, $value, string $type = 'string', ?string $description = null, bool $isPublic = false)
 * @method static string|null uploadFile(string $key, $file, string $disk = 'public')
 * @method static array getPublicSettings()
 *
 * @see \App\Services\SettingService
 */
class Settings extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'settings';
    }
}
