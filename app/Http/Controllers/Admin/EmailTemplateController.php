<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Services\EmailTemplateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class EmailTemplateController extends Controller
{
    protected EmailTemplateService $templateService;

    public function __construct(EmailTemplateService $templateService)
    {
        $this->middleware(['auth', 'role:admin|super-admin']);
        $this->templateService = $templateService;
    }

    /**
     * Display a listing of email templates.
     */
    public function index()
    {
        $templates = EmailTemplate::with('lastModifiedBy:id,name')
            ->orderBy('name')
            ->get()
            ->map(function ($template) {
                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'slug' => $template->slug,
                    'subject' => $template->subject,
                    'is_active' => $template->is_active,
                    'updated_at' => $template->updated_at->format('M d, Y H:i'),
                    'last_modified_by' => $template->lastModifiedBy?->name,
                ];
            });

        return Inertia::render('Admin/EmailTemplates/Index', [
            'templates' => $templates,
        ]);
    }

    /**
     * Show the form for editing the specified template.
     */
    public function edit(EmailTemplate $template)
    {
        return Inertia::render('Admin/EmailTemplates/Edit', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'subject' => $template->subject,
                'body_html' => $template->body_html,
                'body_text' => $template->body_text,
                'variables' => $template->variables ?? [],
                'is_active' => $template->is_active,
            ],
            'sampleData' => $this->templateService->getSampleData($template->slug),
        ]);
    }

    /**
     * Update the specified template.
     */
    public function update(Request $request, EmailTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body_html' => 'required|string',
            'body_text' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['last_modified_by'] = auth()->id();

        $this->templateService->updateTemplate($template, $validated);

        return redirect()
            ->back()
            ->with('success', 'Email template updated successfully.');
    }

    /**
     * Preview the template with sample data.
     */
    public function preview(Request $request, EmailTemplate $template)
    {
        $sampleData = $request->input('sampleData', $this->templateService->getSampleData($template->slug));

        // If custom data is provided, merge it with defaults
        if ($request->has('customData')) {
            $sampleData = array_merge($sampleData, $request->input('customData'));
        }

        $rendered = $template->render($sampleData);

        return response()->json([
            'subject' => $rendered['subject'],
            'body_html' => $rendered['body_html'],
            'body_text' => $rendered['body_text'],
        ]);
    }

    /**
     * Send a test email.
     */
    public function sendTest(Request $request, EmailTemplate $template)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $sampleData = $this->templateService->getSampleData($template->slug);
        $rendered = $template->render($sampleData);

        try {
            Mail::send([], [], function ($message) use ($request, $rendered) {
                $message->to($request->email)
                    ->subject($rendered['subject'])
                    ->html($rendered['body_html'])
                    ->text($rendered['body_text']);
            });

            return redirect()
                ->back()
                ->with('success', "Test email sent successfully to {$request->email}");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'Failed to send test email: ' . $e->getMessage());
        }
    }

    /**
     * Toggle template active status.
     */
    public function toggleStatus(EmailTemplate $template)
    {
        $template->update([
            'is_active' => !$template->is_active,
            'last_modified_by' => auth()->id(),
        ]);

        $this->templateService->clearTemplateCache($template->slug);

        return redirect()
            ->back()
            ->with('success', 'Template status updated.');
    }
}
