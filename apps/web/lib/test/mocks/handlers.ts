/**
 * MSW (Mock Service Worker) Handlers for API Mocking
 *
 * Defines mock API handlers for testing components that make API calls.
 * Uses MSW to intercept network requests and return mock responses.
 *
 * Usage:
 * ```tsx
 * import { server } from '@/lib/test/mocks/server';
 * import { http, HttpResponse } from 'msw';
 *
 * // Override handler in a test
 * server.use(
 *   http.get('/api/user/profile', () => {
 *     return HttpResponse.json({ user: { name: 'Test User' } });
 *   })
 * );
 * ```
 */

import { http, HttpResponse } from 'msw';

/**
 * Base URL for API calls (same as your API routes)
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Mock user data
 */
export const mockUser = {
  id: 'user_123',
  name: 'Test User',
  email: 'test@example.com',
  username: 'testuser',
  role: 'USER',
  image: 'https://avatar.vercel.sh/test',
  bio: 'Test user bio',
  emailVerified: new Date('2024-01-01'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

/**
 * Mock article data
 */
export const mockArticle = {
  id: 'article_123',
  title: 'Test Article',
  slug: 'test-article',
  description: 'Test article description',
  content: 'Test article content',
  published: true,
  authorId: mockUser.id,
  author: mockUser,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

/**
 * Mock tag data
 */
export const mockTag = {
  id: 'tag_123',
  name: 'Test Tag',
  slug: 'test-tag',
  description: 'Test tag description',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

/**
 * Default MSW handlers
 */
export const handlers = [
  // Auth endpoints
  http.post(`${API_BASE_URL}/api/auth/register`, async ({ request }) => {
    const body = (await request.json()) as any;

    // Simulate email already exists error
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        {
          success: false,
          error: 'Registration failed',
          fieldErrors: {
            email: 'email.already_exists',
          },
        },
        { status: 400 }
      );
    }

    // Successful registration
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUser,
      },
    });
  }),

  http.post(
    `${API_BASE_URL}/api/auth/callback/credentials`,
    async ({ request }) => {
      const body = (await request.json()) as any;

      // Simulate invalid credentials
      if (body.email === 'invalid@example.com') {
        return HttpResponse.json(
          {
            error: 'Invalid email or password',
          },
          { status: 401 }
        );
      }

      // Successful login
      return HttpResponse.json({
        user: mockUser,
        session: {
          user: mockUser,
          expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      });
    }
  ),

  // User profile endpoints
  http.get(`${API_BASE_URL}/api/user/profile`, () => {
    return HttpResponse.json({
      success: true,
      data: mockUser,
    });
  }),

  http.put(`${API_BASE_URL}/api/user/profile`, async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json({
      success: true,
      data: {
        ...mockUser,
        ...body,
        updatedAt: new Date(),
      },
    });
  }),

  // Article endpoints
  http.get(`${API_BASE_URL}/api/articles`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    return HttpResponse.json({
      success: true,
      data: {
        articles: Array.from({ length: limit }, (_, i) => ({
          ...mockArticle,
          id: `article_${page}_${i}`,
          title: `Test Article ${page * limit + i}`,
          slug: `test-article-${page}-${i}`,
        })),
        pagination: {
          page,
          limit,
          total: 100,
          totalPages: Math.ceil(100 / limit),
        },
      },
    });
  }),

  http.get(`${API_BASE_URL}/api/articles/:slug`, ({ params }) => {
    const { slug } = params;

    if (slug === 'not-found') {
      return HttpResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        ...mockArticle,
        slug,
      },
    });
  }),

  http.post(`${API_BASE_URL}/api/articles`, async ({ request }) => {
    const body = (await request.json()) as any;

    return HttpResponse.json({
      success: true,
      data: {
        ...mockArticle,
        ...body,
        id: `article_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }),

  // Tag endpoints
  http.get(`${API_BASE_URL}/api/tags`, () => {
    return HttpResponse.json({
      success: true,
      data: Array.from({ length: 10 }, (_, i) => ({
        ...mockTag,
        id: `tag_${i}`,
        name: `Tag ${i}`,
        slug: `tag-${i}`,
      })),
    });
  }),
];
