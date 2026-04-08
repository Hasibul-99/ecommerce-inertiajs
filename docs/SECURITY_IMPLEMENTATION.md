# Security Implementation Guide

This document outlines all security enhancements implemented in the multi-vendor e-commerce platform.

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Security Service](#security-service)
4. [Middleware](#middleware)
5. [Events & Listeners](#events--listeners)
6. [Notifications](#notifications)
7. [Admin Security Pages](#admin-security-pages)
8. [Security Audit Command](#security-audit-command)
9. [Usage Examples](#usage-examples)
10. [Best Practices](#best-practices)

---

## Overview

The security system provides comprehensive protection and monitoring for the platform through:

- **Login Attempt Tracking**: Monitor all login attempts (successful and failed)
- **Account Lockout**: Automatic account locking after repeated failed attempts
- **IP Blocking**: Block malicious IP addresses temporarily or permanently
- **XSS Protection**: Detect and sanitize cross-site scripting attempts
- **Rate Limiting**: Per-user rate limiting to prevent abuse
- **Vendor Access Control**: Ensure only approved vendors access vendor areas
- **Security Event Logging**: Comprehensive logging of all security-related events
- **Real-time Notifications**: Alert admins and users of security issues
- **Security Audit Tools**: Command-line tool for security audits
- **Security Headers**: Implement industry-standard security headers

---

## Database Schema

### Tables Created

**1. security_events**
```sql
- id (bigint, primary key)
- user_id (nullable, foreign key to users)
- type (string) - Event type (login_failed, xss_attempt, etc.)
- ip (string) - IP address
- description (text) - Event description
- data (json, nullable) - Additional event data
- user_agent (text, nullable) - Browser user agent
- url (text, nullable) - Request URL
- created_at (timestamp)

Indexes:
- type, user_id, ip, created_at
```

**2. blocked_ips**
```sql
- id (bigint, primary key)
- ip (string, unique) - Blocked IP address
- reason (text) - Reason for blocking
- blocked_by_id (nullable, foreign key to users)
- blocked_until (nullable, timestamp) - Auto-unblock time (null = permanent)
- created_at, updated_at (timestamps)

Indexes:
- ip, blocked_until, created_at
```

**3. login_attempts**
```sql
- id (bigint, primary key)
- user_id (nullable, foreign key to users)
- email (string) - Email used in attempt
- ip (string) - IP address
- user_agent (text) - Browser user agent
- successful (boolean) - Success/failure
- failure_reason (nullable, string) - Reason for failure
- metadata (json, nullable) - Additional data
- created_at (timestamp)

Indexes:
- user_id, email, ip, successful, created_at
```

**4. account_locks**
```sql
- id (bigint, primary key)
- user_id (foreign key to users)
- reason (string) - Lock reason
- locked_until (timestamp) - Unlock time
- created_at, updated_at (timestamps)

Indexes:
- user_id, locked_until
```

**5. trusted_devices** (Future Use)
```sql
- id (bigint, primary key)
- user_id (foreign key to users)
- device_fingerprint (string) - Unique device identifier
- device_name (string) - User-friendly name
- ip (string) - IP address
- user_agent (text) - Browser user agent
- last_used_at (timestamp)
- trusted_at (timestamp)
- created_at, updated_at (timestamps)

Indexes:
- user_id, device_fingerprint
```

---

## Security Service

**Location**: `app/Services/SecurityService.php`

### Key Methods

#### Event Logging
```php
public function logSecurityEvent(
    string $type,
    array $data,
    ?User $user = null,
    ?string $description = null
): SecurityEvent
```

**Usage**:
```php
$securityService->logSecurityEvent(
    'xss_attempt',
    ['pattern' => '<script>', 'input' => $request->all()],
    $request->user(),
    'XSS attempt detected in user input'
);
```

#### Login Tracking
```php
public function trackLoginAttempt(
    string $email,
    bool $successful,
    array $metadata = []
): LoginAttempt
```

**Usage**:
```php
$securityService->trackLoginAttempt(
    $email,
    true,
    ['ip' => $request->ip(), 'user_agent' => $request->userAgent()]
);
```

#### Account Locking
```php
public function checkAndLockAccount(string $email): ?AccountLock
public function isAccountLocked(User $user): bool
public function unlockAccount(User $user): bool
```

**Usage**:
```php
// Check and lock if needed
$lock = $securityService->checkAndLockAccount($email);

// Check if locked
if ($securityService->isAccountLocked($user)) {
    return redirect()->with('error', 'Your account is temporarily locked');
}

// Manual unlock
$securityService->unlockAccount($user);
```

#### IP Blocking
```php
public function blockIp(
    string $ip,
    string $reason,
    int $hours = 24,
    ?User $blockedBy = null
): BlockedIp

public function isIpBlocked(string $ip): bool
public function unblockIp(string $ip): bool
```

**Usage**:
```php
// Block IP for 24 hours
$securityService->blockIp(
    '192.168.1.100',
    'Multiple failed login attempts',
    24,
    auth()->user()
);

// Check if blocked
if ($securityService->isIpBlocked($request->ip())) {
    abort(403, 'Your IP has been blocked');
}
```

#### Suspicious Activity Detection
```php
public function detectSuspiciousActivity(User $user): bool
```

**Detection Criteria**:
- Multiple logins from different countries within 1 hour
- Rapid failed login attempts
- Unusual access patterns

#### Security Summary
```php
public function getSecuritySummary(int $days = 7): array
```

**Returns**:
```php
[
    'total_events' => 1500,
    'failed_logins' => 120,
    'xss_attempts' => 5,
    'suspicious_activities' => 8,
    'blocked_ips' => 12,
]
```

---

## Middleware

### 1. XssProtection

**Location**: `app/Http/Middleware/XssProtection.php`

**Purpose**: Detect and sanitize XSS attempts in user input.

**How It Works**:
1. Scans all request input for suspicious patterns
2. Logs XSS attempts to security_events
3. Sanitizes all string values using `htmlspecialchars()`
4. Replaces original request input with sanitized version

**Patterns Detected**:
- `<script>` tags
- `javascript:` protocol
- Event handlers (onclick, onload, etc.)
- `<iframe>`, `<object>`, `<embed>` tags

**Registration**:
```php
// app/Http/Kernel.php
protected $middleware = [
    \App\Http\Middleware\XssProtection::class,
];
```

### 2. RateLimitByUser

**Location**: `app/Http/Middleware/RateLimitByUser.php`

**Purpose**: Rate limit requests per authenticated user.

**Usage**:
```php
// In routes/web.php
Route::middleware(['auth', 'rate-limit:60,1'])->group(function () {
    // 60 requests per 1 minute
    Route::post('/api/search', [SearchController::class, 'search']);
});
```

**Parameters**:
- First: Max attempts (default: 60)
- Second: Decay minutes (default: 1)

**Headers Set**:
- `X-RateLimit-Limit`: Maximum allowed requests
- `X-RateLimit-Remaining`: Remaining requests

### 3. VendorAccessMiddleware

**Location**: `app/Http/Middleware/VendorAccessMiddleware.php`

**Purpose**: Ensure only approved vendors access vendor areas.

**Checks**:
1. User has 'vendor' role
2. User has vendor profile
3. Vendor status is 'approved'

**Redirects**:
- Pending: `/vendor/pending`
- Rejected: `/vendor/rejected`
- Suspended: `/vendor/suspended`

**Registration**:
```php
// app/Http/Kernel.php
protected $middlewareAliases = [
    'vendor.access' => \App\Http\Middleware\VendorAccessMiddleware::class,
];

// In routes/web.php
Route::middleware(['auth', 'vendor.access'])->group(function () {
    Route::get('/vendor/dashboard', [VendorController::class, 'dashboard']);
});
```

### 4. SecurityHeaders

**Location**: `app/Http/Middleware/SecurityHeaders.php`

**Purpose**: Set security-related HTTP headers on all responses.

**Headers Set**:

1. **Content-Security-Policy (CSP)**
   - Restricts resource loading to trusted sources
   - Prevents XSS attacks
   - Disables unsafe inline scripts (except in development)

2. **Strict-Transport-Security (HSTS)**
   - Forces HTTPS for 1 year
   - Includes subdomains

3. **X-Frame-Options**
   - Prevents clickjacking attacks
   - Set to `SAMEORIGIN`

4. **X-Content-Type-Options**
   - Prevents MIME sniffing
   - Set to `nosniff`

5. **X-XSS-Protection**
   - Enables browser XSS filtering
   - Set to `1; mode=block`

6. **Referrer-Policy**
   - Controls referrer information
   - Set to `strict-origin-when-cross-origin`

7. **Permissions-Policy**
   - Controls browser features
   - Disables: microphone, camera, USB, geolocation (except self)

**Registration**:
```php
// app/Http/Kernel.php
protected $middleware = [
    \App\Http\Middleware\SecurityHeaders::class,
];
```

---

## Events & Listeners

### Events

**1. SuspiciousActivityDetected**
```php
use App\Events\SuspiciousActivityDetected;

event(new SuspiciousActivityDetected(
    $user,
    $securityEvent,
    'multiple_country_logins',
    ['countries' => ['US', 'CN', 'RU']]
));
```

**2. AccountLocked**
```php
use App\Events\AccountLocked;

event(new AccountLocked(
    $user,
    $accountLock,
    'Multiple failed login attempts',
    5
));
```

**3. NewDeviceLogin**
```php
use App\Events\NewDeviceLogin;

event(new NewDeviceLogin(
    $user,
    $loginAttempt,
    'Chrome on Windows',
    'New York, USA'
));
```

### Listeners

**1. NotifyAdminOfSuspiciousActivity**
- Logs suspicious activity
- Sends notification to all admins
- Queued for background processing

**2. SendAccountLockedNotification**
- Logs account lock
- Sends email/in-app notification to user
- Queued for background processing

**3. SendNewDeviceLoginNotification**
- Logs new device login
- Sends email/in-app notification to user
- Queued for background processing

### Event Registration

Add to `app/Providers/EventServiceProvider.php`:

```php
use App\Events\SuspiciousActivityDetected;
use App\Events\AccountLocked;
use App\Events\NewDeviceLogin;
use App\Listeners\NotifyAdminOfSuspiciousActivity;
use App\Listeners\SendAccountLockedNotification;
use App\Listeners\SendNewDeviceLoginNotification;

protected $listen = [
    SuspiciousActivityDetected::class => [
        NotifyAdminOfSuspiciousActivity::class,
    ],
    AccountLocked::class => [
        SendAccountLockedNotification::class,
    ],
    NewDeviceLogin::class => [
        SendNewDeviceLoginNotification::class,
    ],
];
```

---

## Notifications

### 1. SuspiciousActivityNotification

**Channels**: database, mail
**Recipient**: Admins
**Triggered By**: Suspicious activity detection

**Content**:
- User involved
- Activity type
- IP address
- Link to security logs

### 2. AccountLockedNotification

**Channels**: database, mail
**Recipient**: Affected user
**Triggered By**: Account lock after failed attempts

**Content**:
- Number of failed attempts
- Lock duration
- Unlock time
- Support contact information

### 3. NewDeviceLoginNotification

**Channels**: database, mail
**Recipient**: User
**Triggered By**: Login from unrecognized device

**Content**:
- Device information
- Location
- IP address
- Time of login
- Action link to secure account

---

## Admin Security Pages

### 1. Security Logs

**Route**: `/admin/security/logs`
**File**: `resources/js/Pages/Admin/Security/Logs.tsx`

**Features**:
- View all security events
- Filter by type, date range, user
- Search by IP, description, URL
- Summary statistics dashboard
- Event details modal
- Export to CSV
- Cleanup old logs

**Summary Metrics**:
- Total events (30 days)
- Failed logins
- XSS attempts
- Suspicious activities
- Blocked IPs

### 2. Blocked IPs

**Route**: `/admin/security/blocked-ips`
**File**: `resources/js/Pages/Admin/Security/BlockedIps.tsx`

**Features**:
- View all blocked IPs
- Block new IP addresses
- Unblock IPs
- Filter by status (active/expired)
- Search by IP or reason
- See who blocked each IP
- View block duration

**Block IP Form**:
- IP Address (required)
- Reason (required)
- Duration in hours (1-8760)

### 3. Login Attempts

**Route**: `/admin/security/login-attempts`
**File**: `resources/js/Pages/Admin/Security/LoginAttempts.tsx`

**Features**:
- View all login attempts
- Filter by status (successful/failed)
- Filter by date range
- Search by email, IP
- Statistics dashboard
- Device and browser detection

**Statistics**:
- Total attempts
- Successful attempts
- Failed attempts
- Success rate
- Today's attempts

---

## Security Audit Command

**Command**: `php artisan security:audit`

**Usage**:
```bash
# Console output (default)
php artisan security:audit

# JSON output
php artisan security:audit --output=json

# HTML report
php artisan security:audit --output=html
```

### Report Sections

**1. Summary (30 days)**
- Total events
- Failed logins
- XSS attempts
- Suspicious activities
- Blocked IPs

**2. Failed Login Analysis (7 days)**
- Total failed attempts
- Unique IPs
- Unique emails
- Top IPs by failed attempts
- Top emails by failed attempts

**3. Blocked IP Analysis**
- Total blocked IPs
- Active blocks
- Expired blocks
- Recent blocks (7 days)

**4. Suspicious Activities (7 days)**
- Total suspicious events
- Breakdown by type
- Top users with suspicious activity

**5. User Account Analysis**
- Total users
- Active users (30 days)
- Locked accounts
- Users by role (admin, vendor, customer)

**6. Recent Security Events**
- Last 50 security events
- Full event details

**7. Security Recommendations**

**Recommendation Triggers**:

- **High Severity**:
  - More than 50 failed logins in 1 hour
  - More than 10 XSS attempts in 24 hours

- **Medium Severity**:
  - More than 20 locked accounts
  - More than 5 admin accounts

- **Low Severity**:
  - More than 10,000 events older than 90 days

### HTML Report

Generated at: `storage/app/security-audit-{timestamp}.html`

Contains formatted report with:
- Color-coded severity levels
- Charts and graphs (if view exists)
- Printable format

---

## Usage Examples

### Tracking Login in AuthenticatedSessionController

```php
use App\Services\SecurityService;

class AuthenticatedSessionController extends Controller
{
    public function __construct(
        private SecurityService $securityService
    ) {}

    public function store(LoginRequest $request)
    {
        try {
            $request->authenticate();

            // Track successful login
            $this->securityService->trackLoginAttempt(
                $request->email,
                true,
                [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'country' => geoip($request->ip())->country ?? 'Unknown',
                ]
            );

            $request->session()->regenerate();

            return redirect()->intended(route('dashboard'));

        } catch (ValidationException $e) {
            // Track failed login
            $this->securityService->trackLoginAttempt(
                $request->email,
                false,
                [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'failure_reason' => 'Invalid credentials',
                ]
            );

            // Check if account should be locked
            $lock = $this->securityService->checkAndLockAccount($request->email);

            if ($lock) {
                event(new AccountLocked(
                    User::where('email', $request->email)->first(),
                    $lock,
                    'Multiple failed login attempts',
                    5
                ));

                throw ValidationException::withMessages([
                    'email' => 'Too many failed attempts. Your account has been temporarily locked.',
                ]);
            }

            throw $e;
        }
    }
}
```

### Checking Account Lock Before Login

```php
public function store(LoginRequest $request)
{
    $user = User::where('email', $request->email)->first();

    // Check if account is locked
    if ($user && $this->securityService->isAccountLocked($user)) {
        throw ValidationException::withMessages([
            'email' => 'Your account is temporarily locked due to multiple failed login attempts. Please try again later.',
        ]);
    }

    // Continue with normal authentication...
}
```

### Logging Security Event in Controller

```php
use App\Services\SecurityService;

class ProductController extends Controller
{
    public function destroy(Product $product, SecurityService $securityService)
    {
        $this->authorize('delete', $product);

        $securityService->logSecurityEvent(
            'product_deleted',
            [
                'product_id' => $product->id,
                'product_title' => $product->title,
            ],
            auth()->user(),
            "Product '{$product->title}' was deleted"
        );

        $product->delete();

        return redirect()->route('vendor.products.index')
            ->with('success', 'Product deleted successfully');
    }
}
```

### Blocking IP from Admin Panel

Controller method in `Admin/SecurityController.php`:

```php
public function blockIp(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'ip' => 'required|ip',
        'reason' => 'required|string|max:255',
        'duration' => 'required|integer|min:1|max:8760',
    ]);

    $this->securityService->blockIp(
        $validated['ip'],
        $validated['reason'],
        $validated['duration'],
        $request->user()
    );

    return redirect()
        ->route('admin.security.blocked-ips')
        ->with('success', "IP address {$validated['ip']} has been blocked.");
}
```

### Detecting Suspicious Activity

```php
// In LoginController or middleware
public function detectSuspiciousLogin(User $user, Request $request)
{
    if ($this->securityService->detectSuspiciousActivity($user)) {
        $securityEvent = $this->securityService->logSecurityEvent(
            'suspicious_login',
            [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'country' => geoip($request->ip())->country ?? 'Unknown',
            ],
            $user,
            'Suspicious login pattern detected'
        );

        event(new SuspiciousActivityDetected(
            $user,
            $securityEvent,
            'unusual_login_pattern',
            [
                'ip' => $request->ip(),
                'country' => geoip($request->ip())->country ?? 'Unknown',
            ]
        ));
    }
}
```

---

## Best Practices

### 1. Always Log Security Events

```php
// ✅ Good: Log security-sensitive actions
$securityService->logSecurityEvent(
    'admin_settings_changed',
    ['changes' => $request->all()],
    auth()->user(),
    'Admin changed platform settings'
);

// ❌ Bad: Don't skip logging
$settings->update($request->all());
```

### 2. Check Account Locks Early

```php
// ✅ Good: Check before processing login
if ($this->securityService->isAccountLocked($user)) {
    return back()->with('error', 'Account locked');
}

// ❌ Bad: Check after authentication attempt
$request->authenticate();
if ($this->securityService->isAccountLocked($user)) { ... }
```

### 3. Use Middleware for Route Protection

```php
// ✅ Good: Apply middleware to route groups
Route::middleware(['auth', 'vendor.access'])->group(function () {
    // All vendor routes
});

// ❌ Bad: Manual checks in every controller method
public function index() {
    if (!auth()->user()->vendor || auth()->user()->vendor->status !== 'approved') {
        abort(403);
    }
    // ...
}
```

### 4. Queue Security Notifications

```php
// ✅ Good: Events are automatically queued
event(new AccountLocked($user, $lock, 'Failed attempts', 5));

// ❌ Bad: Synchronous notification in request cycle
Mail::to($user)->send(new AccountLockedMail($lock));
```

### 5. Sanitize Log Data

```php
// ✅ Good: Remove sensitive data before logging
$securityService->logSecurityEvent(
    'failed_login',
    ['email' => $email, 'ip' => $request->ip()], // No password
    null,
    'Failed login attempt'
);

// ❌ Bad: Log sensitive data
$securityService->logSecurityEvent(
    'failed_login',
    $request->all(), // Includes password!
    null,
    'Failed login attempt'
);
```

### 6. Regular Security Audits

```bash
# Schedule in app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Run security audit daily
    $schedule->command('security:audit --output=html')
        ->daily()
        ->at('02:00');

    // Cleanup old security events weekly
    $schedule->command('cleanup:old-security-events --days=90')
        ->weekly()
        ->sundays()
        ->at('03:00');
}
```

### 7. Monitor Failed Login Patterns

```php
// Check for brute force attacks
$failedAttempts = LoginAttempt::where('ip', $request->ip())
    ->where('successful', false)
    ->where('created_at', '>=', now()->subMinutes(15))
    ->count();

if ($failedAttempts >= 5) {
    $this->securityService->blockIp(
        $request->ip(),
        'Brute force attack detected',
        24
    );
}
```

### 8. Implement CSRF Protection

```php
// Always enabled in Laravel by default
// Ensure forms include @csrf directive

<form method="POST" action="{{ route('login') }}">
    @csrf
    <!-- Form fields -->
</form>
```

### 9. Use Security Headers in Production

```php
// Ensure SecurityHeaders middleware is globally applied
// app/Http/Kernel.php
protected $middleware = [
    \App\Http\Middleware\SecurityHeaders::class,
];
```

### 10. Regular Security Updates

```bash
# Keep dependencies updated
composer update

# Check for security vulnerabilities
composer audit

# Update npm packages
npm audit fix
```

---

## Environment Configuration

Add these settings to `.env`:

```env
# Security Settings
SECURITY_MAX_LOGIN_ATTEMPTS=5
SECURITY_LOCKOUT_DURATION=30
SECURITY_FAILED_ATTEMPT_WINDOW=15

# Session Security
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=lax

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
API_RATE_LIMIT=120

# Security Headers
SECURITY_HEADERS_ENABLED=true
CSP_REPORT_URI=https://yourdomain.com/csp-report
```

---

## Routes Configuration

Add these routes to `routes/web.php`:

```php
// Admin Security Routes
Route::middleware(['auth', 'role:admin|super-admin'])->prefix('admin/security')->name('admin.security.')->group(function () {
    Route::get('/logs', [Admin\SecurityController::class, 'logs'])->name('logs');
    Route::get('/blocked-ips', [Admin\SecurityController::class, 'blockedIps'])->name('blocked-ips');
    Route::get('/login-attempts', [Admin\SecurityController::class, 'loginAttempts'])->name('login-attempts');
    Route::post('/block-ip', [Admin\SecurityController::class, 'blockIp'])->name('block-ip');
    Route::delete('/unblock-ip/{blockedIp}', [Admin\SecurityController::class, 'unblockIp'])->name('unblock-ip');
    Route::post('/cleanup-events', [Admin\SecurityController::class, 'cleanupEvents'])->name('cleanup-events');
    Route::get('/export-logs', [Admin\SecurityController::class, 'exportLogs'])->name('export-logs');
});
```

---

## Testing Security Features

### Test Login Attempt Tracking

```php
public function test_successful_login_is_tracked()
{
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertDatabaseHas('login_attempts', [
        'user_id' => $user->id,
        'email' => $user->email,
        'successful' => true,
    ]);
}
```

### Test Account Locking

```php
public function test_account_locks_after_failed_attempts()
{
    $user = User::factory()->create();

    // Make 5 failed login attempts
    for ($i = 0; $i < 5; $i++) {
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);
    }

    $this->assertDatabaseHas('account_locks', [
        'user_id' => $user->id,
    ]);
}
```

### Test IP Blocking

```php
public function test_ip_blocking_prevents_access()
{
    $securityService = app(SecurityService::class);
    $securityService->blockIp('192.168.1.100', 'Test block', 1);

    $this->assertTrue($securityService->isIpBlocked('192.168.1.100'));
}
```

---

**Last Updated**: January 2026
**Version**: 1.0
**Author**: Development Team
