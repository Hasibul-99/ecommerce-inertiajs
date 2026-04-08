<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'subject',
        'body_html',
        'body_text',
        'variables',
        'is_active',
        'last_modified_by',
    ];

    protected $casts = [
        'variables' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who last modified this template.
     */
    public function lastModifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_modified_by');
    }

    /**
     * Render the template with given data.
     */
    public function render(array $data): array
    {
        $subject = $this->renderString($this->subject, $data);
        $bodyHtml = $this->renderString($this->body_html, $data);
        $bodyText = $this->body_text ? $this->renderString($this->body_text, $data) : strip_tags($bodyHtml);

        return [
            'subject' => $subject,
            'body_html' => $bodyHtml,
            'body_text' => $bodyText,
        ];
    }

    /**
     * Render a string with variable replacements.
     */
    protected function renderString(string $template, array $data): string
    {
        return preg_replace_callback('/\{\{(.+?)\}\}/', function ($matches) use ($data) {
            $key = trim($matches[1]);
            return data_get($data, $key, $matches[0]);
        }, $template);
    }

    /**
     * Get available variables for this template.
     */
    public function getAvailableVariables(): array
    {
        return $this->variables ?? [];
    }
}
