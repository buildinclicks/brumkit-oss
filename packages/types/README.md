# @repo/types

Shared TypeScript types and utilities for React Masters monorepo.

## Features

- ✅ **Common Types** - Brand types, pagination, sorting, filtering
- ✅ **API Types** - Request/response types, error handling
- ✅ **Auth Types** - User roles, permissions, sessions, tokens
- ✅ **Type Utilities** - Runtime type guards and assertions
- ✅ **Fully Tested** - 53 tests covering all utilities
- ✅ **Type-Safe** - Strict TypeScript types with inference

## Installation

This package is already part of the monorepo. No installation needed.

```bash
# Apps automatically have access via workspace
pnpm add @repo/types --filter @repo/admin
```

## Usage

### Importing Types

```ts
// Import specific types
import type { UserProfile, ApiResponse, PaginatedResponse } from '@repo/types';

// Import from specific modules
import type { ErrorCode, HttpStatusCode } from '@repo/types/api';
import type { UserRole, PermissionAction } from '@repo/types/auth';

// Import utilities (runtime functions)
import { isDefined, isApiSuccess, assertString } from '@repo/types';
```

### Common Types

#### Brand Types

Create nominal types to prevent mixing incompatible IDs:

```ts
import type { UserId, ArticleId } from '@repo/types';

const userId: UserId = 'user_123' as UserId;
const articleId: ArticleId = 'article_456' as ArticleId;

// TypeScript error: Type 'ArticleId' is not assignable to type 'UserId'
// const wrongId: UserId = articleId;
```

#### Pagination

```ts
import type { PaginatedResponse, QueryOptions } from '@repo/types';

interface Article {
  id: string;
  title: string;
}

const response: PaginatedResponse<Article> = {
  data: [
    { id: '1', title: 'Article 1' },
    { id: '2', title: 'Article 2' },
  ],
  meta: {
    page: 1,
    pageSize: 10,
    totalPages: 5,
    totalCount: 50,
    hasNextPage: true,
    hasPreviousPage: false,
  },
};

const query: QueryOptions<Article> = {
  page: 1,
  pageSize: 10,
  sort: { field: 'title', direction: 'asc' },
  search: 'react',
};
```

#### Type Utilities

```ts
import type { DeepPartial, Optional, KeysOfType } from '@repo/types';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Make all properties optional recursively
type PartialUser = DeepPartial<User>;

// Make specific keys optional
type UserWithOptionalEmail = Optional<User, 'email'>;

// Extract keys of a specific type
type StringKeys = KeysOfType<User, string>; // "id" | "name" | "email"
type NumberKeys = KeysOfType<User, number>; // "age"
```

### API Types

#### Success/Error Responses

```ts
import type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@repo/types';
import { isApiSuccess, isApiError } from '@repo/types';

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

const result = await fetchUser('123');

if (isApiSuccess(result)) {
  console.log(result.data); // Type: User
} else {
  console.error(result.error.message); // Type: string
}
```

#### Error Codes

```ts
import { ErrorCode, ApiError } from '@repo/types';

throw new ApiError(404, ErrorCode.RESOURCE_NOT_FOUND, 'User not found', {
  userId: '123',
});
```

#### Validation Errors

```ts
import type { ValidationErrorResponse } from '@repo/types';

const error: ValidationErrorResponse = {
  success: false,
  error: {
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
    fields: [
      {
        field: 'email',
        message: 'Invalid email format',
        code: 'validation.invalid_email',
      },
      {
        field: 'password',
        message: 'Password too short',
        code: 'validation.password_length',
      },
    ],
  },
};
```

### Authentication Types

#### User Roles and Permissions

```ts
import { UserRole, PermissionAction, PermissionResource } from '@repo/types';
import type { Permission } from '@repo/types';

const permission: Permission = {
  action: PermissionAction.UPDATE,
  resource: PermissionResource.ARTICLE,
  conditions: { ownedBy: 'user_123' },
};

function canEditArticle(userRole: UserRole): boolean {
  return [UserRole.ADMIN, UserRole.MODERATOR].includes(userRole);
}
```

#### Authentication Flow

```ts
import type {
  LoginCredentials,
  AuthTokensResponse,
  AccessToken,
  RefreshToken,
} from '@repo/types';

const credentials: LoginCredentials = {
  email: 'user@example.com' as Email,
  password: 'securepassword',
};

const authResponse: AuthTokensResponse = {
  user: {
    id: 'user_123' as UserId,
    email: 'user@example.com' as Email,
    name: 'John Doe',
    role: UserRole.USER,
    isEmailVerified: true,
    createdAt: new Date() as Timestamp,
    updatedAt: new Date() as Timestamp,
  },
  tokens: {
    accessToken: {
      token: 'eyJhbGc...',
      expiresIn: 900, // 15 minutes
      type: 'Bearer',
    },
    refreshToken: {
      token: 'dGhpcyBp...',
      expiresIn: 604800, // 7 days
    },
  },
};
```

### Type Guards

Runtime type checking with TypeScript type narrowing:

```ts
import {
  isDefined,
  isString,
  isNumber,
  isArray,
  isObject,
  isApiSuccess,
} from '@repo/types';

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // value is string
  }

  if (isNumber(value)) {
    console.log(value.toFixed(2)); // value is number
  }

  if (isArray<string>(value)) {
    value.forEach((item) => console.log(item)); // value is string[]
  }
}

// Filter out nullish values
const values = [1, null, 2, undefined, 3];
const definedValues = values.filter(isDefined); // Type: number[]
```

### Assertions

Throw errors if conditions aren't met:

```ts
import { assertDefined, assertString, assertNumber, assert } from '@repo/types';

function processUser(user: User | undefined) {
  assertDefined(user, 'User is required');
  // user is now User (not undefined)

  console.log(user.name);
}

function processInput(input: unknown) {
  assertString(input, 'Input must be a string');
  // input is now string

  return input.toUpperCase();
}

function divide(a: number, b: number) {
  assert(b !== 0, 'Cannot divide by zero');
  return a / b;
}
```

### Utility Functions

```ts
import {
  filterNullish,
  toNullable,
  nullToUndefined,
  getOrDefault,
} from '@repo/types';

// Filter out null and undefined
const values = [1, null, 2, undefined, 3];
const cleanedValues = filterNullish(values); // [1, 2, 3]

// Convert undefined to null
const maybeValue: string | undefined = undefined;
const nullableValue = toNullable(maybeValue); // null

// Convert null to undefined
const nullValue: string | null = null;
const undefinedValue = nullToUndefined(nullValue); // undefined

// Get value or default
const userName = getOrDefault(user?.name, 'Anonymous');
```

## Type Safety Best Practices

### 1. Use Brand Types for IDs

```ts
// ✅ Good - prevents mixing IDs
type UserId = Brand<string, 'UserId'>;
type ArticleId = Brand<string, 'ArticleId'>;

function getUser(id: UserId) {
  /* ... */
}
function getArticle(id: ArticleId) {
  /* ... */
}

// TypeScript error if you mix them
const userId: UserId = '123' as UserId;
// getArticle(userId); // Error!

// ❌ Bad - no type safety
function getUser(id: string) {
  /* ... */
}
function getArticle(id: string) {
  /* ... */
}
```

### 2. Use Type Guards for Runtime Checks

```ts
// ✅ Good - type-safe with narrowing
if (isString(value)) {
  return value.toUpperCase();
}

// ❌ Bad - no type narrowing
if (typeof value === 'string') {
  return value.toUpperCase(); // Still unknown in some contexts
}
```

### 3. Use Assertions for Invariants

```ts
// ✅ Good - clear error messages
function processUser(user: User | undefined) {
  assertDefined(user, 'User must be provided');
  // user is now User

  return user.name;
}

// ❌ Bad - unclear errors
function processUser(user: User | undefined) {
  if (!user) throw new Error('Error');
  // user is still User | undefined in some cases
}
```

### 4. Use Exhaustive Checks

```ts
import { assertUnreachable } from '@repo/types';

type Status = 'pending' | 'approved' | 'rejected';

function getStatusColor(status: Status): string {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'approved':
      return 'green';
    case 'rejected':
      return 'red';
    default:
      return assertUnreachable(status); // Compile error if new status added
  }
}
```

## Testing

All type utilities are tested:

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type check
pnpm type-check
```

**Test Coverage**: 53/53 tests passing ✅

## Adding New Types

1. **Add types** to appropriate file (`common.ts`, `api.ts`, `auth.ts`, or `utils.ts`)
2. **Export** from `src/index.ts`
3. **Add tests** if creating utilities (type guards, assertions)
4. **Document** in this README

### Example: Adding a New Type

```ts
// packages/types/src/common.ts
export type NotificationId = Brand<string, 'NotificationId'>;

export interface Notification extends BaseEntity {
  id: NotificationId;
  userId: UserId;
  message: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'error';
}

// packages/types/src/index.ts
export * from './common';
```

### Example: Adding a Type Guard

```ts
// packages/types/src/utils.ts
export function isNotification(value: unknown): value is Notification {
  return (
    isObject(value) &&
    'id' in value &&
    'userId' in value &&
    'message' in value &&
    'isRead' in value &&
    'type' in value
  );
}

// packages/types/src/utils.test.ts
describe('isNotification', () => {
  it('should return true for valid notification', () => {
    const notification = {
      id: 'notif_123',
      userId: 'user_456',
      message: 'Hello',
      isRead: false,
      type: 'info',
    };
    expect(isNotification(notification)).toBe(true);
  });
});
```

## TypeScript Configuration

The package uses strict TypeScript:

```json
{
  "extends": "@repo/config-typescript/node.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true
  }
}
```

## Exports

The package provides multiple entry points:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./common": "./src/common.ts",
    "./api": "./src/api.ts",
    "./auth": "./src/auth.ts",
    "./utils": "./src/utils.ts"
  }
}
```

## Compatibility

- ✅ TypeScript 5.x
- ✅ Node.js 20+
- ✅ ESM modules
- ✅ All monorepo packages

## Contributing

When adding new types:

1. Follow existing naming conventions
2. Use Brand types for IDs
3. Add JSDoc comments
4. Write tests for utilities
5. Update this README

## License

Private package for React Masters monorepo.
