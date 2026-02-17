# Task 5.3: React Testing Library Setup

**Status:** ✅ Completed  
**Date:** 2026-01-13

## Objective

Set up comprehensive React Testing Library infrastructure with custom render utilities, MSW for API mocking, and testing patterns for Next.js App Router components, Server Components, and Server Actions.

## Changes Made

### 1. Custom Render Utilities

**File:** `apps/web/lib/test/render.tsx`

Created `renderWithProviders` function that wraps components with all necessary providers:

- **NextIntlClientProvider:** i18n translations
- **QueryClientProvider:** Tanstack Query state management
- **ThemeProvider:** Dark/light mode (optional)

**Features:**

- Configurable locale and messages
- Custom QueryClient with test-optimized defaults (no retry, no cache)
- Theme support (light/dark/system) with opt-out
- Returns QueryClient instance for test assertions
- Re-exports all React Testing Library utilities

**Example Usage:**

```tsx
import { renderWithProviders, screen, userEvent } from '@/lib/test';

// Basic usage
renderWithProviders(<MyComponent />);

// With custom query client
const { queryClient } = renderWithProviders(<MyComponent />);

// Without theme provider (recommended for most tests)
renderWithProviders(<MyComponent />, { disableTheme: true });
```

### 2. MSW (Mock Service Worker) Integration

**Files:**

- `apps/web/lib/test/mocks/handlers.ts` - Mock API handlers
- `apps/web/lib/test/mocks/server.ts` - MSW server for Node.js
- `apps/web/lib/test/mocks/browser.ts` - MSW worker for browser (future use)

**Mock Data Exports:**

- `mockUser` - Test user data
- `mockArticle` - Test article data
- `mockTag` - Test tag data

**Default Handlers:**

- Auth endpoints: `/api/auth/register`, `/api/auth/callback/credentials`
- User profile: `/api/user/profile` (GET, PUT)
- Articles: `/api/articles` (GET, POST), `/api/articles/:slug` (GET)
- Tags: `/api/tags` (GET)

**Features:**

- Request interception in Node.js environment
- Realistic response simulation
- Error scenario testing
- Field-specific error responses
- Pagination support

**Example Usage:**

```tsx
import { server, http, HttpResponse } from '@/lib/test';

// Override handler in a test
server.use(
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      success: true,
      data: { name: 'Custom User' },
    });
  })
);
```

### 3. Enhanced Vitest Setup

**File:** `apps/web/vitest.setup.ts`

Added comprehensive mocking:

- **MSW Server Lifecycle:**
  - `beforeAll`: Start server
  - `afterEach`: Reset handlers
  - `afterAll`: Close server

- **Browser API Mocks:**
  - `window.matchMedia` - For next-themes
  - `window.localStorage` - For theme persistence

- **Next.js Mocks:**
  - `next/navigation`: useRouter, usePathname, useSearchParams, redirect
  - `server-only`: Empty module
  - `next-intl/server`: getTranslations, getLocale, getMessages

- **Auth Mocks:**
  - `next-auth/react`: signIn, signOut, useSession, SessionProvider
  - `next-auth`: Default export

### 4. Example Tests

**File:** `apps/web/lib/test/example.test.tsx`

Comprehensive test examples demonstrating:

1. **Component Testing:**
   - Rendering with/without providers
   - Theme provider usage (with limitations noted)

2. **MSW API Mocking:**
   - Overriding default handlers
   - Testing success and error responses
   - Network request interception

3. **User Interactions:**
   - Button clicks with `userEvent`
   - Form input and validation
   - Async state updates with `waitFor`

4. **Accessibility:**
   - Testing with `getByRole`
   - ARIA labels and alerts

### 5. Test Centralization

**File:** `apps/web/lib/test/index.ts`

Single import point for all testing utilities:

```tsx
import {
  renderWithProviders,
  screen,
  waitFor,
  userEvent,
  server,
  http,
  HttpResponse,
  mockUser,
  mockArticle,
  mockTag,
} from '@/lib/test';
```

## Testing Patterns Established

### 1. Component Testing

```tsx
import { renderWithProviders, screen } from '@/lib/test';

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />, { disableTheme: true });
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### 2. User Interaction Testing

```tsx
import { renderWithProviders, screen, userEvent } from '@/lib/test';

it('should handle user click', async () => {
  const user = userEvent.setup();
  renderWithProviders(<MyButton />, { disableTheme: true });

  await user.click(screen.getByRole('button'));

  expect(screen.getByText('Clicked')).toBeInTheDocument();
});
```

### 3. API Mocking

```tsx
import { renderWithProviders, server, http, HttpResponse } from '@/lib/test';

it('should handle API error', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json({ error: 'Failed' }, { status: 500 });
    })
  );

  renderWithProviders(<MyComponent />, { disableTheme: true });

  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

### 4. Async Testing

```tsx
import { renderWithProviders, waitFor, screen } from '@/lib/test';

it('should load data async', async () => {
  renderWithProviders(<MyComponent />, { disableTheme: true });

  await waitFor(
    () => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    },
    { timeout: 3000 }
  );
});
```

## Known Limitations

### ThemeProvider Testing

Due to `matchMedia` complexities in jsdom environment, tests with `ThemeProvider` enabled may encounter issues. **Recommendation:**

- Use `disableTheme: true` for most component tests
- Test theme-dependent logic separately without the provider
- Use E2E tests (Playwright) for full theme functionality testing

**Example:**

```tsx
// Recommended approach
renderWithProviders(<MyComponent />, { disableTheme: true });

// If theme is needed, test logic separately
it('should apply dark mode class', () => {
  const isDark = true;
  expect(getThemeClass(isDark)).toBe('dark');
});
```

### Server Actions Testing

Server Actions should be mocked in component tests:

```tsx
vi.mock('@/app/actions/auth', () => ({
  registerUser: vi.fn(() => Promise.resolve({ success: true })),
}));
```

For integration testing of Server Actions, use database integration tests or E2E tests.

## Files Created

```
apps/web/lib/test/
├── index.ts                    # Centralized exports
├── render.tsx                  # Custom render utilities
├── example.test.tsx            # Example tests (8 tests)
└── mocks/
    ├── handlers.ts             # MSW request handlers
    ├── server.ts               # MSW server (Node.js)
    └── browser.ts              # MSW worker (browser)
```

## Files Modified

```
apps/web/vitest.setup.ts        # Enhanced with MSW and mocks
apps/web/package.json           # Added msw dependency
```

## Dependencies Added

- **msw@2.12.7** - Mock Service Worker for API mocking

## Test Results

All tests passing:

```
✓ components/form/field-error.test.tsx (3 tests)
✓ lib/test/example.test.tsx (8 tests)

Test Files: 2 passed (2)
Tests: 11 passed (11)
```

## Usage Guidelines

### 1. Always Use `disableTheme: true`

Unless specifically testing theme functionality:

```tsx
renderWithProviders(<Component />, { disableTheme: true });
```

### 2. Mock Server Actions

```tsx
vi.mock('@/app/actions', () => ({
  myAction: vi.fn(() => Promise.resolve({ success: true })),
}));
```

### 3. Use MSW for API Calls

```tsx
server.use(
  http.get('/api/endpoint', () => {
    return HttpResponse.json({ data: 'mocked' });
  })
);
```

### 4. Test User Interactions

```tsx
const user = userEvent.setup();
await user.click(screen.getByRole('button'));
await user.type(screen.getByLabelText('Email'), 'test@example.com');
```

### 5. Wait for Async Updates

```tsx
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Best Practices

1. **Test Behavior, Not Implementation:**
   - Use `getByRole`, `getByLabelText` instead of `getByTestId`
   - Test user-facing behavior

2. **Isolate Tests:**
   - Each test should be independent
   - MSW handlers reset after each test automatically

3. **Meaningful Assertions:**
   - Test what users see and interact with
   - Use accessibility queries

4. **Mock External Dependencies:**
   - Server Actions
   - API calls (via MSW)
   - Browser APIs

5. **Keep Tests Fast:**
   - Use `disableTheme: true` to avoid unnecessary overhead
   - Mock expensive operations

## Next Steps

- ✅ **Task 5.1:** Vitest Setup (COMPLETED)
- ✅ **Task 5.2:** Database Testing Strategy (COMPLETED)
- ✅ **Task 5.3:** React Testing Library Setup (COMPLETED)
- 🔜 **Task 5.4:** Playwright E2E Setup
- 🔜 **Task 5.5:** CI/CD Testing Pipeline
- 🔜 **Task 5.6:** Testing Documentation

## Notes

- MSW is configured for Node.js environment (Vitest)
- Browser worker (`mocks/browser.ts`) is available for future use in Playwright component tests
- All providers (i18n, Query, Theme) are properly mocked
- Custom render function simplifies test setup significantly
- Example tests demonstrate all major patterns
- Foundation ready for comprehensive component testing
