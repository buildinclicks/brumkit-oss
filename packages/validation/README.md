# @repo/validation

Shared validation schemas and rules using Zod for React Masters monorepo.

## Features

- ✅ **Type-Safe**: Full TypeScript support with inferred types
- ✅ **i18n Ready**: All error messages use message keys for internationalization
- ✅ **Reusable Rules**: Common validation rules for email, password, username, slug
- ✅ **Entity Schemas**: Pre-built schemas for Auth, User, and Article entities
- ✅ **Prisma Compatible**: Types align with Prisma models
- ✅ **Well Tested**: 73+ tests with >95% coverage
- ✅ **Server & Client**: Works in both Next.js server actions and client-side forms

## Installation

This package is part of the monorepo workspace:

```json
{
  "dependencies": {
    "@repo/validation": "workspace:*"
  }
}
```

## Usage

### Validation Rules

#### Email Validation

```typescript
import { emailSchema, emailRule } from '@repo/validation';

// Required email
const result = emailRule.required.safeParse('user@example.com');

// Optional email
const result2 = emailRule.optional.safeParse(undefined); // valid

// With error handling
if (!result.success) {
  console.log(result.error.errors[0].message); // i18n message key
}
```

#### Password Validation

```typescript
import { passwordSchema } from '@repo/validation';

const result = passwordSchema.safeParse('Password123');
// ✅ Must be 8-128 chars, contain uppercase, lowercase, and number
```

#### Username Validation

```typescript
import { usernameSchema } from '@repo/validation';

const result = usernameSchema.safeParse('johndoe');
// ✅ 3-20 chars, alphanumeric + underscore/hyphen, starts with letter
```

#### Slug Validation

```typescript
import { slugSchema } from '@repo/validation';

const result = slugSchema.safeParse('hello-world-123');
// ✅ Lowercase letters, numbers, hyphens only
```

### Authentication Schemas

#### Login

```typescript
import { loginSchema, type LoginInput } from '@repo/validation';

const loginData: LoginInput = {
  email: 'user@example.com',
  password: 'password123',
};

const result = loginSchema.safeParse(loginData);
```

#### Register

```typescript
import { registerSchema, type RegisterInput } from '@repo/validation';

const registerData: RegisterInput = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
};

const result = registerSchema.safeParse(registerData);
// ✅ Validates password match
```

#### Change Password

```typescript
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from '@repo/validation';

const data: ChangePasswordInput = {
  currentPassword: 'OldPassword123',
  newPassword: 'NewPassword123',
  confirmPassword: 'NewPassword123',
};

const result = changePasswordSchema.safeParse(data);
// ✅ Validates passwords match and new password is different
```

### User Schemas

#### Create User

```typescript
import { createUserSchema, type CreateUserInput } from '@repo/validation';

const userData: CreateUserInput = {
  name: 'John Doe',
  email: 'john@example.com',
  username: 'johndoe',
  password: 'Password123',
  bio: 'Software developer',
};

const result = createUserSchema.safeParse(userData);
```

#### Update Profile

```typescript
import {
  updateUserProfileSchema,
  type UpdateUserProfileInput,
} from '@repo/validation';

const updates: UpdateUserProfileInput = {
  name: 'John Smith',
  bio: 'Updated bio',
};

const result = updateUserProfileSchema.safeParse(updates);
```

### Article Schemas

#### Create Article

```typescript
import { createArticleSchema, type CreateArticleInput } from '@repo/validation';

const articleData: CreateArticleInput = {
  title: 'My First Article',
  slug: 'my-first-article',
  content: {}, // TipTap JSON
  excerpt: 'This is a short excerpt',
  coverImage: 'https://example.com/image.jpg',
  metaTitle: 'My First Article - SEO Title',
  metaDescription: 'SEO description',
  tagIds: ['tag1', 'tag2'],
  published: false,
};

const result = createArticleSchema.safeParse(articleData);
```

#### Update Article

```typescript
import { updateArticleSchema, type UpdateArticleInput } from '@repo/validation';

const updates: UpdateArticleInput = {
  title: 'Updated Title',
  published: true,
};

const result = updateArticleSchema.safeParse(updates);
```

### Error Handling

#### Format Errors

```typescript
import { formatZodError, getFieldError } from '@repo/validation';

const result = loginSchema.safeParse(invalidData);

if (!result.success) {
  // Get all errors
  const errors = formatZodError(result.error);
  // [{ field: 'email', message: 'validation.email.invalid', code: 'invalid_string' }]

  // Get specific field error
  const emailError = getFieldError(result.error, 'email');
  console.log(emailError); // 'validation.email.invalid'

  // Convert to object
  const errorObj = zodErrorToObject(result.error);
  // { email: 'validation.email.invalid', password: 'validation.password.required' }
}
```

### Next.js Server Actions

```typescript
// app/actions/auth.ts
'use server';

import { loginSchema } from '@repo/validation';
import { prisma } from '@repo/database';

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  // Validate
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: zodErrorToObject(result.error),
    };
  }

  // Proceed with authentication...
  const user = await prisma.user.findUnique({
    where: { email: result.data.email },
  });

  return { success: true, user };
}
```

### React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@repo/validation';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    // Data is validated and type-safe
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Login</button>
    </form>
  );
}
```

## Validation Rules Reference

| Rule         | Min | Max | Pattern                            | Notes                                      |
| ------------ | --- | --- | ---------------------------------- | ------------------------------------------ |
| **Email**    | 5   | 255 | RFC 5322                           | Auto-trimmed & lowercased                  |
| **Password** | 8   | 128 | 1 uppercase, 1 lowercase, 1 number |                                            |
| **Username** | 3   | 20  | `^[a-zA-Z][a-zA-Z0-9_-]*$`         | Starts with letter, auto-lowercased        |
| **Slug**     | 3   | 255 | `^[a-z0-9]+(?:-[a-z0-9]+)*$`       | Lowercase, hyphens, no consecutive hyphens |

## Message Keys

All validation messages use i18n keys in the format: `validation.{category}.{specific_error}`

Example keys:

- `validation.email.invalid`
- `validation.password.too_short`
- `validation.password.no_uppercase`
- `validation.username.invalid_format`
- `validation.article.title_required`

Map these keys to actual translations in your i18n files.

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## Type Safety

All schemas export TypeScript types:

```typescript
import type {
  LoginInput,
  RegisterInput,
  CreateUserInput,
  UpdateUserInput,
  CreateArticleInput,
  UpdateArticleInput,
} from '@repo/validation';
```

## Adding New Schemas

To add validation for other entities:

1. Create schema file in `src/schemas/`
2. Export types with `z.infer<typeof schema>`
3. Add to `src/index.ts` exports
4. Create tests in `test/schemas/`

## License

Private - Part of React Masters monorepo
