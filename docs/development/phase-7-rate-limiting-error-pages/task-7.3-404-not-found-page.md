# Task 7.3: 404 Not Found Page

**Status:** ✅ Completed  
**Date:** 2026-01-14  
**Approach:** TDD (Test-Driven Development)

## Overview

Created a custom 404 Not Found error page with professional design, internationalization support, and proper accessibility following Next.js App Router conventions.

## Objectives

1. ✅ Create `not-found.tsx` following Next.js App Router conventions
2. ✅ Implement TDD workflow with comprehensive tests
3. ✅ Support internationalization with `next-intl`
4. ✅ Ensure proper SEO with metadata
5. ✅ Maintain accessibility standards
6. ✅ Use Tailwind CSS v4 for styling

## Implementation Details

### 1. I18n Messages

**Location:** `apps/web/messages/en.json`

Added error pages section with 404 messages:

```json
{
  "errors": {
    "404": {
      "title": "Page Not Found",
      "heading": "404 - Page Not Found",
      "description": "Sorry, we couldn't find the page you're looking for.",
      "suggestions": "You might want to check the URL or try one of these options:",
      "go_home": "Go to Home",
      "go_back": "Go Back",
      "browse_articles": "Browse Articles"
    }
  }
}
```

### 2. Not Found Page

**Location:** `apps/web/app/not-found.tsx`

**Key features:**

- Server component (async) for optimal performance
- Uses `getTranslations` from `next-intl/server`
- Generates metadata for SEO
- Semantic HTML with proper `<h1>` heading
- Responsive design with card layout
- Multiple navigation options

**Structure:**

```tsx
export async function generateMetadata(): Promise<Metadata>;
export default async function NotFound();
```

**Design:**

- Centered card layout
- Clear 404 heading
- Helpful error message
- Two primary actions: "Go to Home" and "Browse Articles"
- Secondary action: "Go Back" button

### 3. Go Back Button Component

**Location:** `apps/web/app/go-back-button.tsx`

Separate client component for browser history navigation:

```tsx
'use client';

export function GoBackButton({ children }) {
  return <Button onClick={() => window.history.back()}>{children}</Button>;
}
```

**Why separate component:**

- Main page remains a server component
- Only the "Go Back" button needs client-side JavaScript
- Better performance and SEO

### 4. Test File

**Location:** `apps/web/app/not-found.test.tsx`

**Tests:**

- ✅ Renders 404 heading
- ✅ Displays descriptive error message
- ✅ Renders navigation links with correct href attributes
- ✅ Renders helpful suggestions
- ✅ Renders go back button
- ✅ Has proper structure with main container
- ✅ Has proper heading hierarchy (h1)
- ✅ Has accessible navigation links

**Mocking strategy:**

- Mocked `next-intl/server` with static translations
- Mocked `next/link` with simple anchor elements
- Tested async server component by awaiting the component call

## TDD Process

### 🔴 RED Phase

1. Created failing test file (`not-found.test.tsx`)
2. Tests expected component that didn't exist
3. All 8 tests failed initially

### 🟢 GREEN Phase

1. Created `not-found.tsx` with server component
2. Created `go-back-button.tsx` for client-side navigation
3. Used proper semantic HTML (`<h1>` instead of `CardTitle`)
4. All tests passed

### 🔵 REFACTOR Phase

- Ensured server component for SEO
- Separated client logic into dedicated component
- Used proper heading tags for accessibility

## Test Results

```bash
✓ app/not-found.test.tsx (8 tests) 326ms

Test Files  1 passed (1)
Tests       8 passed (8)
```

## Files Created

- `apps/web/app/not-found.tsx` - 404 page component
- `apps/web/app/go-back-button.tsx` - Client component for history navigation
- `apps/web/app/not-found.test.tsx` - Test file

## Files Modified

- `apps/web/messages/en.json` - Added error pages translations

## User Experience

When users land on a non-existent page, they see:

1. **Clear Error Message:** "404 - Page Not Found"
2. **Helpful Description:** "Sorry, we couldn't find the page you're looking for."
3. **Actionable Suggestions:** "You might want to check the URL or try one of these options:"
4. **Primary Actions:**
   - "Go to Home" button (primary style)
   - "Browse Articles" button (outline style)
5. **Secondary Action:**
   - "Go Back" button (ghost style)

## Accessibility Features

- ✅ Proper heading hierarchy (h1 → description)
- ✅ Semantic HTML (`<main>`, `<h1>`, `<p>`)
- ✅ Accessible navigation links
- ✅ Focus management with keyboard navigation
- ✅ Screen reader friendly

## SEO Features

- ✅ Server-side rendering (async server component)
- ✅ Custom metadata with page title
- ✅ Proper HTTP 404 status (handled by Next.js automatically)
- ✅ No client-side JavaScript for main content

## Design System

- **Card Component:** Professional container with shadow
- **Button Variants:**
  - Primary: "Go to Home"
  - Outline: "Browse Articles"
  - Ghost: "Go Back"
- **Typography:**
  - Heading: 4xl, bold
  - Description: base size, muted color
  - Suggestions: small, muted color
- **Spacing:** Consistent gaps and padding
- **Responsive:** Works on all screen sizes (max-w-md card)

## Next Steps

✅ Task 7.3 Complete  
→ Next: Task 7.4 - 500 Server Error Page

## Lessons Learned

1. **CardTitle renders as div:** Need to use semantic HTML (`<h1>`) directly for proper accessibility
2. **Server vs Client Components:** Separate client-side logic (like `window.history.back()`) into dedicated client components
3. **Testing Async Components:** Call `await Component()` then render the result
4. **Mock next-intl:** Mock `getTranslations` to return a function that returns translations

## Dependencies

- `next-intl/server` - Server-side translations
- `@repo/ui/card` - Card components
- `@repo/ui/button` - Button component
- `next/link` - Navigation
- `next` (Metadata) - SEO

---

**Task 7.3 Completed Successfully** ✅
