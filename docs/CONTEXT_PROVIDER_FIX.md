# Context Provider Fix - Wishlist Page

## Issue

**Error**: `useCartWishlist must be used within a CartWishlistProvider`

**Location**: `resources/js/Pages/Wishlist/Index.tsx`

**Root Cause**: The component was trying to use the `useCartWishlist()` hook at the top level, but the `CartWishlistProvider` was being applied inside the `FrontendLayout` component. This created a timing issue where the hook was called before the provider was available.

## The Problem

### Original Structure (BROKEN):
```tsx
export default function WishlistIndex({ auth, wishlistItems, ... }) {
    // ❌ Hook called here - BEFORE provider is available
    const { addToCart, removeFromWishlist } = useCartWishlist();

    return (
        <FrontendLayout auth={auth}>  {/* Provider is inside FrontendLayout */}
            {/* Content */}
        </FrontendLayout>
    );
}
```

**Why it failed**:
1. React renders `WishlistIndex` component
2. Hook `useCartWishlist()` is called immediately
3. Hook looks for `CartWishlistProvider` in parent tree
4. Provider doesn't exist yet (it's inside FrontendLayout which hasn't rendered)
5. Error thrown: "must be used within a CartWishlistProvider"

## The Solution

### New Structure (FIXED):
```tsx
// Inner component that uses the context
function WishlistContent({ initialItems }) {
    // ✅ Hook called here - AFTER provider is available
    const { addToCart, removeFromWishlist } = useCartWishlist();

    // All the component logic and JSX
    return (
        <>
            {/* Content */}
        </>
    );
}

// Main export component that wraps with FrontendLayout
export default function WishlistIndex({ auth, wishlistItems, ... }) {
    return (
        <FrontendLayout auth={auth}>  {/* Provider wraps everything */}
            <WishlistContent initialItems={wishlistItems} />
        </FrontendLayout>
    );
}
```

**Why it works**:
1. React renders `WishlistIndex` component
2. `FrontendLayout` renders and provides `CartWishlistProvider`
3. Provider is now available in React tree
4. `WishlistContent` component renders as child
5. Hook `useCartWishlist()` is called
6. Hook finds `CartWishlistProvider` in parent tree
7. Everything works! ✅

## Component Hierarchy

```
WishlistIndex (Page Component)
  └─ FrontendLayout
      └─ CartWishlistProvider  ← Provider is here
          └─ WishlistContent  ← Hook used here (inside provider)
```

## Key Learnings

### Context API Rules:
1. **Provider must be ancestor**: The component using `useContext()` must be a descendant of the Provider
2. **Hooks execute immediately**: React hooks run when the component renders, not after
3. **Layout components**: When providers are in layout components, content must be children

### Common Pattern for Inertia.js Pages:
When using Context API with Inertia.js pages that have layouts with providers:

**Pattern 1: Separate Inner Component** (Used here)
```tsx
function PageContent() {
    const context = useMyContext();
    return <div>{/* content */}</div>;
}

export default function Page() {
    return (
        <LayoutWithProvider>
            <PageContent />
        </LayoutWithProvider>
    );
}
```

**Pattern 2: Custom Hook in Child Components**
```tsx
function ActionButtons() {
    const { addToCart } = useCartWishlist();
    return <button onClick={addToCart}>Add</button>;
}

export default function Page() {
    return (
        <LayoutWithProvider>
            <div>
                <ActionButtons />
            </div>
        </LayoutWithProvider>
    );
}
```

**Pattern 3: Use Inertia's Persistent Layouts** (Alternative)
```tsx
Page.layout = (page) => <FrontendLayout>{page}</FrontendLayout>;

export default function Page() {
    const { addToCart } = useCartWishlist();  // Works because layout is applied by Inertia
    return <div>{/* content */}</div>;
}
```

## Files Changed

### Modified:
- ✅ `resources/js/Pages/Wishlist/Index.tsx`

### Changes Made:
1. Created new `WishlistContent` component with all the logic
2. Moved `useCartWishlist()` hook into `WishlistContent`
3. Made `WishlistIndex` a wrapper that applies `FrontendLayout`
4. Passed `initialItems` prop to `WishlistContent`

## Testing

After this fix:
- ✅ No more "must be used within provider" error
- ✅ Context is available to all hooks
- ✅ Cart and wishlist counts update correctly
- ✅ Toast notifications work
- ✅ All functionality intact

## Other Pages Using Context

These pages already work correctly because they don't use the hook at top level:

✅ **ProductCard** - Uses hook inside component, always wrapped by FrontendLayout
✅ **Product/Show** - Uses hook inside component, wrapped by FrontendLayout
✅ **Header** - Uses hook inside component, part of FrontendLayout

## Prevention

To avoid this issue in the future:

1. **Check provider location**: Verify where the provider is in the component tree
2. **Hook placement**: Ensure hooks are called inside components that are children of the provider
3. **Test immediately**: After adding a hook, test the page to catch this early
4. **Console errors**: React gives clear error messages - read them carefully

## Related Documentation

- React Context API: https://react.dev/reference/react/useContext
- Inertia.js Layouts: https://inertiajs.com/pages#layouts
- Our implementation: `CART_WISHLIST_IMPLEMENTATION.md`

---

**Fix Applied**: January 2026
**Status**: ✅ RESOLVED
