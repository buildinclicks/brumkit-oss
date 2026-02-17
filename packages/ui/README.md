# @repo/ui

Shared UI component library built with **shadcn/ui**, **Radix UI**, and **Tailwind CSS** for React Masters monorepo.

## Features

- 🎨 **shadcn/ui Components** - Beautiful, accessible components (25+ components)
- 🧩 **Radix UI Primitives** - Unstyled, accessible components
- 🎭 **Tailwind CSS** - Utility-first styling with CSS variables
- 🌙 **Dark Mode** - Built-in dark mode support via next-themes
- ♿ **Accessible** - ARIA-compliant components
- 🔧 **Customizable** - Own the code, customize as needed
- 📝 **TypeScript** - Full type safety
- 🎯 **Form Integration** - React Hook Form + Zod validation

## Installation

This package is part of the monorepo workspace:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

## Setup

### 1. Import Global Styles

In your Next.js app layout:

```tsx
// app/layout.tsx
import '@repo/ui/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 2. Add Toaster for Notifications

```tsx
// app/layout.tsx
import '@repo/ui/globals.css';
import { Toaster } from '@repo/ui';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

### 3. Configure Tailwind

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/config-tailwind';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}', // Include UI package
  ],
  presets: [sharedConfig],
};

export default config;
```

## Components

### Form Components

#### Input & Label

```tsx
import { Input, Label } from '@repo/ui';

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>;
```

#### Textarea

```tsx
import { Textarea, Label } from '@repo/ui';

<div>
  <Label htmlFor="bio">Bio</Label>
  <Textarea id="bio" placeholder="Tell us about yourself" />
</div>;
```

#### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a role" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="user">User</SelectItem>
    <SelectItem value="moderator">Moderator</SelectItem>
  </SelectContent>
</Select>;
```

#### Checkbox

```tsx
import { Checkbox, Label } from '@repo/ui';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>;
```

#### Radio Group

```tsx
import { RadioGroup, RadioGroupItem, Label } from '@repo/ui';

<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>;
```

#### Switch

```tsx
import { Switch, Label } from '@repo/ui';

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>;
```

### Button

```tsx
import { Button } from '@repo/ui';

<>
  <Button>Default</Button>
  <Button variant="destructive">Delete</Button>
  <Button variant="outline">Cancel</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button size="sm">Small</Button>
  <Button size="lg">Large</Button>
  <Button size="icon">🔍</Button>
</>;
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from '@repo/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>;
```

### Dialogs & Modals

#### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Button,
} from '@repo/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>;
```

#### Sheet (Side Panel)

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Button,
} from '@repo/ui';

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
    </SheetHeader>
  </SheetContent>
</Sheet>;
```

#### Popover

```tsx
import { Popover, PopoverTrigger, PopoverContent, Button } from '@repo/ui';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      <h4 className="font-medium">Popover Title</h4>
      <p className="text-sm">Content goes here</p>
    </div>
  </PopoverContent>
</Popover>;
```

### Data Display

#### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@repo/ui';

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>;
```

#### Badge

```tsx
import { Badge } from '@repo/ui';

<>
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="destructive">Destructive</Badge>
  <Badge variant="outline">Outline</Badge>
</>;
```

#### Table

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@repo/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui';

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings content</TabsContent>
  <TabsContent value="password">Password settings content</TabsContent>
</Tabs>;
```

### Navigation

#### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@repo/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

#### Breadcrumb

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>;
```

### Feedback

#### Toast Notifications

```tsx
import { toast } from 'sonner';
import { Button } from '@repo/ui';

<Button onClick={() => toast('Your message has been sent.')}>
  Show Toast
</Button>

// Success toast
<Button onClick={() => toast.success('Successfully saved!')}>
  Success
</Button>

// Error toast
<Button onClick={() => toast.error('Something went wrong!')}>
  Error
</Button>

// With action
<Button onClick={() => toast('Event created', {
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
})}>
  With Action
</Button>
```

#### Skeleton (Loading State)

```tsx
import { Skeleton } from '@repo/ui';

<div className="space-y-2">
  <Skeleton className="h-4 w-[250px]" />
  <Skeleton className="h-4 w-[200px]" />
  <Skeleton className="h-4 w-[150px]" />
</div>;
```

### Alerts

```tsx
import { Alert, AlertTitle, AlertDescription } from '@repo/ui';

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### Layout Components

#### Container

```tsx
import { Container } from '@repo/ui';

<Container size="lg">
  <h1>Centered content with responsive padding</h1>
</Container>;
```

#### Stack

```tsx
import { Stack } from '@repo/ui';

<Stack direction="column" spacing="md" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

<Stack direction="row" spacing="sm" justify="between">
  <div>Left</div>
  <div>Right</div>
</Stack>
```

## Form Integration with React Hook Form

Complete example with validation:

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@repo/validation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FormError,
} from '@repo/ui';

export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      // Your login logic here
      console.log(data);
    } catch (error) {
      form.setError('root', {
        message: 'Invalid email or password',
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <FormError message={form.formState.errors.root.message} />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

## Components List

### ✅ Form Components (9)

- Button
- Input
- Textarea
- Label
- Select
- Checkbox
- Radio Group
- Switch
- Form (React Hook Form integration)

### ✅ Layout Components (5)

- Card
- Container
- Stack
- Separator
- Alert

### ✅ Overlay Components (3)

- Dialog
- Sheet
- Popover

### ✅ Data Display (4)

- Avatar
- Badge
- Table
- Tabs

### ✅ Navigation (2)

- Dropdown Menu
- Breadcrumb

### ✅ Feedback (2)

- Toast (Sonner)
- Skeleton

### ✅ Custom Components (3)

- FormError
- FormSuccess
- FormFieldWrapper

**Total: 28 Components**

## Customization

### CSS Variables

Customize colors in your app's global CSS:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  /* ... more variables */
}

.dark {
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... dark mode variables */
}
```

### Component Variants

Use `class-variance-authority` for custom variants:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/ui';

const customVariants = cva('base-styles', {
  variants: {
    variant: {
      default: 'default-styles',
      special: 'special-styles',
    },
    size: {
      sm: 'small-styles',
      lg: 'large-styles',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
  },
});
```

## Dependencies

**Core:**

- `@radix-ui/react-*` (v1.x - v2.x) - Accessible component primitives
- `react-hook-form` ^7.54.2 - Form state management
- `@hookform/resolvers` ^3.9.1 - Zod integration
- `lucide-react` ^0.469.0 - Icon library
- `sonner` ^1.7.2 - Toast notifications
- `next-themes` ^0.4.6 - Dark mode support
- `class-variance-authority` ^0.7.1 - Variant styling
- `clsx` ^2.1.1 + `tailwind-merge` ^2.6.0 - Class utilities

**Peer Dependencies:**

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

## Best Practices

1. **Always import global CSS** in your app layout
2. **Add Toaster component** for toast notifications
3. **Use Form components** with React Hook Form + Zod
4. **Leverage CSS variables** for theming
5. **Use cn() utility** for conditional classes
6. **Keep components customizable** - you own the code!

## License

Private package for React Masters monorepo.
