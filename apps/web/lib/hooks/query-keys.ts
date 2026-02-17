import type { QueryClient } from '@tanstack/react-query';

/**
 * Centralized query key factory for type-safe and consistent cache management
 *
 * Benefits:
 * - Type-safe query keys
 * - Consistent naming
 * - Easy invalidation
 * - Hierarchical structure
 *
 * Usage:
 * - useQuery({ queryKey: queryKeys.user.current() })
 * - queryClient.invalidateQueries({ queryKey: queryKeys.user.all })
 */

export const queryKeys = {
  /**
   * User-related query keys
   */
  user: {
    all: ['user'] as const,
    current: () => [...queryKeys.user.all, 'current'] as const,
    byId: (id: string) => [...queryKeys.user.all, id] as const,
    profile: (id: string) => [...queryKeys.user.byId(id), 'profile'] as const,
  },

  /**
   * Article-related query keys
   */
  articles: {
    all: ['articles'] as const,
    lists: () => [...queryKeys.articles.all, 'list'] as const,
    list: (filters?: {
      page?: number;
      limit?: number;
      tag?: string;
      author?: string;
      search?: string;
    }) => [...queryKeys.articles.lists(), filters] as const,
    details: () => [...queryKeys.articles.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.articles.details(), id] as const,
    byAuthor: (authorId: string) =>
      [...queryKeys.articles.all, 'author', authorId] as const,
    byTag: (tag: string) => [...queryKeys.articles.all, 'tag', tag] as const,
  },

  /**
   * Comment-related query keys
   */
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    byArticle: (articleId: string) =>
      [...queryKeys.comments.lists(), 'article', articleId] as const,
    byUser: (userId: string) =>
      [...queryKeys.comments.lists(), 'user', userId] as const,
    detail: (id: string) => [...queryKeys.comments.all, id] as const,
  },

  /**
   * Tag-related query keys
   */
  tags: {
    all: ['tags'] as const,
    lists: () => [...queryKeys.tags.all, 'list'] as const,
    list: (filters?: { search?: string; limit?: number }) =>
      [...queryKeys.tags.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.tags.all, id] as const,
    popular: () => [...queryKeys.tags.all, 'popular'] as const,
  },

  /**
   * Notification-related query keys
   */
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters?: { read?: boolean; limit?: number }) =>
      [...queryKeys.notifications.lists(), filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unreadCount'] as const,
  },

  /**
   * Follow-related query keys
   */
  follows: {
    all: ['follows'] as const,
    followers: (userId: string) =>
      [...queryKeys.follows.all, 'followers', userId] as const,
    following: (userId: string) =>
      [...queryKeys.follows.all, 'following', userId] as const,
    isFollowing: (userId: string, targetId: string) =>
      [...queryKeys.follows.all, 'isFollowing', userId, targetId] as const,
  },

  /**
   * Bookmark-related query keys
   */
  bookmarks: {
    all: ['bookmarks'] as const,
    lists: () => [...queryKeys.bookmarks.all, 'list'] as const,
    list: (userId: string, filters?: { page?: number; limit?: number }) =>
      [...queryKeys.bookmarks.lists(), userId, filters] as const,
    isBookmarked: (userId: string, articleId: string) =>
      [...queryKeys.bookmarks.all, 'isBookmarked', userId, articleId] as const,
  },
} as const;

/**
 * Helper to invalidate all related queries for a resource
 */
export const invalidateQueries = {
  user: (queryClient: QueryClient, userId?: string) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.byId(userId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    }
  },
  article: (queryClient: QueryClient, articleId?: string) => {
    if (articleId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.articles.detail(articleId),
      });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.articles.lists() });
  },
  articles: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
  },
};
