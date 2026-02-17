# Task 1.9: Create @repo/utils Package

**Status**: ✅ Completed  
**Date**: 2026-01-11  
**Phase**: Foundation

---

## 📋 Task Description

Create a shared utilities package with commonly used functions for:

- String manipulation and formatting
- Array operations
- Object utilities
- Date formatting and helpers

This is the **FINAL TASK of Phase 1!** 🎉

---

## ✅ What Was Implemented

### 1. Package Structure

Created `packages/utils/` with modular exports:

- `src/string.ts` - String utilities (10 functions)
- `src/array.ts` - Array utilities (4 functions)
- `src/object.ts` - Object utilities (3 functions)
- `src/date.ts` - Date utilities (3 functions)
- `src/index.ts` - Main exports
- `src/string.test.ts` - Tests (12 tests passing)

### 2. String Utilities

```ts
export function capitalize(str: string): string;
export function camelCase(str: string): string;
export function kebabCase(str: string): string;
export function snakeCase(str: string): string;
export function truncate(str: string, length: number, suffix?: string): string;
export function isEmpty(str: string): boolean;
export function randomString(length: number): string;
export function slugify(str: string): string;
export function stripHtml(str: string): string;
export function wordCount(str: string): number;
```

**Use Cases**:

- Case conversions for code generation
- URL slug creation from article titles
- HTML sanitization
- Text truncation for previews

### 3. Array Utilities

```ts
export function unique<T>(arr: T[]): T[];
export function chunk<T>(arr: T[], size: number): T[][];
export function shuffle<T>(arr: T[]): T[];
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]>;
```

**Use Cases**:

- Remove duplicate tags/categories
- Paginate items into chunks
- Randomize article order
- Group articles by category/author

### 4. Object Utilities

```ts
export function deepClone<T>(obj: T): T;
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
```

**Use Cases**:

- Clone user data for mutations
- Pick specific fields for API responses
- Omit sensitive data (passwords) from responses

### 5. Date Utilities

```ts
export function formatDate(date: Date): string; // YYYY-MM-DD
export function timeAgo(date: Date): string; // "2 hours ago"
export function isToday(date: Date): boolean;
```

**Use Cases**:

- Display article publish dates
- Show relative time for comments
- Highlight today's articles

---

## 🧪 Verification

### Run Tests

```bash
cd packages/utils
pnpm test
```

**Output**:

```
✓ src/string.test.ts (12 tests) 8ms

Test Files  1 passed (1)
     Tests  12 passed (12)
  Duration  434ms
```

---

## 📁 Files Created

```
packages/utils/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md
└── src/
    ├── index.ts (main exports)
    ├── string.ts (10 functions)
    ├── string.test.ts (12 tests)
    ├── array.ts (4 functions)
    ├── object.ts (3 functions)
    └── date.ts (3 functions)
```

---

## 📝 Usage Examples

### String Manipulation

```ts
import { slugify, truncate, capitalize } from '@repo/utils';

// Create URL slug from article title
const title = 'My First Blog Post!';
const slug = slugify(title); // "my-first-blog-post"

// Truncate article preview
const content = 'This is a very long article...';
const preview = truncate(content, 100); // "This is a very long article..."

// Capitalize user name
const name = capitalize('john'); // "John"
```

### Array Operations

```ts
import { unique, groupBy } from '@repo/utils';

// Remove duplicate tags
const tags = ['react', 'nextjs', 'react', 'typescript'];
const uniqueTags = unique(tags); // ['react', 'nextjs', 'typescript']

// Group articles by category
const articles = [
  { title: 'React Basics', category: 'React' },
  { title: 'Next.js Tutorial', category: 'Next.js' },
  { title: 'React Hooks', category: 'React' },
];
const grouped = groupBy(articles, 'category');
// { React: [...], Next.js: [...] }
```

### Object Manipulation

```ts
import { pick, omit } from '@repo/utils';

const user = {
  id: '123',
  name: 'John',
  email: 'john@example.com',
  password: 'hashed',
};

// Pick safe fields for API response
const safeUser = pick(user, ['id', 'name', 'email']);

// Omit sensitive fields
const publicUser = omit(user, ['password']);
```

### Date Formatting

```ts
import { timeAgo, formatDate } from '@repo/utils';

// Show when article was published
const publishedAt = new Date('2024-01-15T10:00:00Z');
console.log(timeAgo(publishedAt)); // "2 hours ago"

// Format date for display
console.log(formatDate(publishedAt)); // "2024-01-15"
```

---

## 🔄 Integration Points

This package will be used extensively in:

- **Phase 5**: Next.js apps (both admin and user apps)
  - Article slug generation
  - Content truncation
  - Date formatting
- **Phase 3**: API routes
  - Data sanitization
  - Response formatting
- **Phase 6**: UI Components
  - Display helpers
  - Text formatting

---

## 🎯 Key Benefits

### 1. Code Reusability

- Single source of truth for common operations
- No duplicate implementations across apps
- Consistent behavior everywhere

### 2. Type Safety

- Full TypeScript support with inference
- Generic functions for flexibility
- Compile-time error checking

### 3. Testability

- All functions are pure (no side effects)
- Easy to test and mock
- Comprehensive test coverage

### 4. Maintainability

- Centralized utilities
- Easy to update and extend
- Clear documentation

---

## ✅ Task Complete!

**Files Created**:

- `packages/utils/` (complete package with 6 files)
- `docs/development/phase-1-foundation/task-1.9-utils-package.md` (this file)

**Tests**: ✅ 12/12 passing

**Phase 1 Status**: ✅ **100% COMPLETE!** 🎉

---

## 🚀 What's Next?

With Phase 1 complete, we've established:

1. ✅ Monorepo architecture (Turborepo + pnpm)
2. ✅ TypeScript configuration
3. ✅ ESLint configuration
4. ✅ Tailwind CSS configuration
5. ✅ Git hooks (Husky + lint-staged)
6. ✅ Testing framework (Vitest)
7. ✅ Shared types (`@repo/types`)
8. ✅ Shared utilities (`@repo/utils`)
9. ✅ Docker Compose setup

**Phase 2**: Database Setup & Models

- Prisma schema design
- Database migrations
- Seed data
- Model types integration

The foundation is solid! Time to build on it! 🏗️
