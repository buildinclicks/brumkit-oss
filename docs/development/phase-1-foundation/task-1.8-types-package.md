# Task 1.8: Create @repo/types Package

**Status**: ✅ Completed  
**Date**: 2026-01-11  
**Phase**: Foundation

---

## 📋 Task Description

Create a shared TypeScript types package with:

- Common type definitions
- API request/response types
- Authentication and authorization types
- Runtime type guards and assertions
- Comprehensive tests

---

## ✅ What Was Implemented

### 1. Package Structure

Created `packages/types/` with:

- `src/common.ts` - Common types (Brand, pagination, sorting, filtering)
- `src/api.ts` - API types (requests, responses, errors)
- `src/auth.ts` - Authentication types (users, roles, permissions, tokens)
- `src/utils.ts` - Type utilities (guards, assertions, helpers)
- `src/index.ts` - Main entry point
- `src/utils.test.ts` - Comprehensive tests (53 tests)

### 2. Common Types (`common.ts`)

#### Brand Types

```ts
export type Brand<T, TBrand extends string> = T & { __brand: TBrand };

// ID types
export type UserId = Brand<string, 'UserId'>;
export type ArticleId = Brand<string, 'ArticleId'>;
export type Email = Brand<string, 'Email'>;
```

#### Utility Types

```ts
export type DeepPartial<T>; // Recursively optional
export type DeepRequired<T>; // Recursively required
export type Optional<T, K>; // Make specific keys optional
export type Nullable<T>; // T | null
export type Maybe<T>; // T | null | undefined
export type JSONValue; // JSON-serializable types
```

#### Pagination & Querying

```ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface QueryOptions<T> {
  page?: number;
  pageSize?: number;
  sort?: SortOptions<T>;
  filters?: FilterCondition<T>[];
  search?: string;
}
```

### 3. API Types (`api.ts`)

#### Response Types

```ts
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: JSONObject;
  };
}
```

#### Error Codes

```ts
export enum ErrorCode {
  AUTH_INVALID_CREDENTIALS = 'auth.invalid_credentials',
  AUTH_TOKEN_EXPIRED = 'auth.token_expired',
  VALIDATION_FAILED = 'validation.failed',
  RESOURCE_NOT_FOUND = 'resource.not_found',
  RATE_LIMIT_EXCEEDED = 'rate_limit.exceeded',
  // ... more codes
}
```

#### API Error Class

```ts
export class ApiError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public code: string,
    message: string,
    public details?: JSONObject
  ) {
    super(message);
  }
}
```

### 4. Authentication Types (`auth.ts`)

#### User Roles & Permissions

```ts
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export interface Permission {
  action: PermissionAction;
  resource: PermissionResource;
  conditions?: Record<string, unknown>;
}
```

#### Authentication Data

```ts
export interface UserProfile {
  id: UserId;
  email: Email;
  name: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TokenPair {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
}
```

### 5. Type Utilities (`utils.ts`)

#### Type Guards

```ts
export function isNull(value: unknown): value is null;
export function isUndefined(value: unknown): value is undefined;
export function isNullish(value: unknown): value is null | undefined;
export function isDefined<T>(value: T | null | undefined): value is T;
export function isString(value: unknown): value is string;
export function isNumber(value: unknown): value is number;
export function isBoolean(value: unknown): value is boolean;
export function isObject(value: unknown): value is Record<string, unknown>;
export function isArray<T>(value: unknown): value is T[];
export function isDate(value: unknown): value is Date;
export function isApiSuccess<T>(response): response is ApiSuccessResponse<T>;
export function isApiError(response): response is ApiErrorResponse;
```

#### Assertions

```ts
export function assertDefined<T>(
  value: T | null | undefined
): asserts value is T;
export function assertString(value: unknown): asserts value is string;
export function assertNumber(value: unknown): asserts value is number;
export function assert(condition: boolean, message?: string): asserts condition;
export function assertUnreachable(value: never): never;
```

#### Utility Functions

```ts
export function filterNullish<T>(array: (T | null | undefined)[]): T[];
export function toNullable<T>(value: T | undefined): Nullable<T>;
export function nullToUndefined<T>(value: T | null): T | undefined;
export function getOrDefault<T>(
  value: T | null | undefined,
  defaultValue: T
): T;
```

### 6. Tests (`utils.test.ts`)

Comprehensive test suite covering:

- ✅ Type Guards (33 tests)
- ✅ API Type Guards (2 tests)
- ✅ Assertions (5 tests)
- ✅ Utility Functions (13 tests)

**Total**: 53 tests, all passing! ✅

---

## 🧪 Verification

### Run Tests

```bash
cd packages/types
pnpm test
```

**Output**:

```
✓ src/utils.test.ts (53 tests) 20ms

Test Files  1 passed (1)
     Tests  53 passed (53)
  Duration  466ms
```

### Type Check

```bash
pnpm type-check
```

---

## 📁 Files Created

```
packages/types/
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── README.md (comprehensive documentation)
└── src/
    ├── index.ts (main exports)
    ├── common.ts (common types)
    ├── api.ts (API types)
    ├── auth.ts (authentication types)
    ├── utils.ts (type guards & utilities)
    └── utils.test.ts (53 tests)
```

---

## 🎯 Key Benefits

### 1. Type Safety

- Brand types prevent ID mixing
- Strict type checking with narrowing
- Exhaustive switch statements

### 2. Reusability

- Single source of truth for types
- Shared across all packages
- Consistent naming conventions

### 3. Runtime Safety

- Type guards for runtime validation
- Assertions for invariants
- Clear error messages

### 4. Developer Experience

- Comprehensive JSDoc comments
- IntelliSense support
- Usage examples in README

---

## 📝 Usage Examples

### Brand Types

```ts
import type { UserId, ArticleId } from '@repo/types';

const userId: UserId = 'user_123' as UserId;
const articleId: ArticleId = 'article_456' as ArticleId;

// TypeScript error: types are incompatible
// const wrongId: UserId = articleId;
```

### API Responses

```ts
import type { ApiResponse } from '@repo/types';
import { isApiSuccess } from '@repo/types';

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

const result = await fetchUser('123');

if (isApiSuccess(result)) {
  console.log(result.data); // Type: User
} else {
  console.error(result.error.message);
}
```

### Type Guards

```ts
import { isDefined, isString } from '@repo/types';

const values = [1, null, 2, undefined, 3];
const definedValues = values.filter(isDefined); // Type: number[]

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // value is string
  }
}
```

### Assertions

```ts
import { assertDefined, assertString } from '@repo/types';

function processUser(user: User | undefined) {
  assertDefined(user, 'User is required');
  // user is now User (not undefined)
  return user.name;
}
```

---

## 🔄 Integration Points

This package will be used by:

- **Phase 2**: Database models (Prisma types integration)
- **Phase 3**: API routes (request/response typing)
- **Phase 3**: CASL permissions (permission types)
- **Phase 5**: Next.js apps (shared types across frontend/backend)
- **All Phases**: Every package benefits from shared types

---

## 📚 Best Practices Established

### 1. Use Brand Types for IDs

```ts
// ✅ Good
type UserId = Brand<string, 'UserId'>;

// ❌ Bad
type UserId = string;
```

### 2. Use Type Guards for Runtime Checks

```ts
// ✅ Good
if (isDefined(value)) {
  // value is T (not null | undefined)
}

// ❌ Bad
if (value !== null && value !== undefined) {
  // No type narrowing in all contexts
}
```

### 3. Use Assertions for Invariants

```ts
// ✅ Good
assertDefined(user, 'User must be provided');

// ❌ Bad
if (!user) throw new Error('Error');
```

### 4. Exhaustive Switch Statements

```ts
import { assertUnreachable } from '@repo/types';

function getColor(status: Status): string {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'approved':
      return 'green';
    case 'rejected':
      return 'red';
    default:
      return assertUnreachable(status); // Compile error if case missing
  }
}
```

---

## ✅ Task Complete!

**Files Created**:

- `packages/types/` (complete package with 6 source files)
- `docs/development/phase-1-foundation/task-1.8-types-package.md` (this file)

**Tests**: ✅ 53/53 passing

**Ready for**: Task 1.9 (`@repo/utils` package)

---

## 🚀 Next Steps

With shared types established, we can now:

1. Create `@repo/utils` package (Task 1.9)
2. Use these types in database models (Phase 2)
3. Type API routes and responses (Phase 3)
4. Share types across frontend and backend seamlessly

The type foundation is solid! 🎨
