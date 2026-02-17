import { z } from 'zod';
import { slugSchema } from '../rules/slug.rules';
import { ValidationMessages } from '../messages';

// ============================================
// CREATE ARTICLE
// ============================================

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, ValidationMessages.ARTICLE_TITLE_REQUIRED)
    .max(255, ValidationMessages.ARTICLE_TITLE_TOO_LONG),
  slug: slugSchema,
  content: z.any(), // TipTap JSON - validated by TipTap itself
  excerpt: z
    .string()
    .max(500, ValidationMessages.ARTICLE_EXCERPT_TOO_LONG)
    .optional(),
  coverImage: z
    .string()
    .url(ValidationMessages.ARTICLE_COVER_IMAGE_INVALID)
    .optional(),
  metaTitle: z
    .string()
    .max(60, ValidationMessages.ARTICLE_META_TITLE_TOO_LONG)
    .optional(),
  metaDescription: z
    .string()
    .max(160, ValidationMessages.ARTICLE_META_DESC_TOO_LONG)
    .optional(),
  tagIds: z
    .array(z.string().cuid(ValidationMessages.CUID_INVALID))
    .min(1, ValidationMessages.ARTICLE_TAGS_MIN)
    .max(10, ValidationMessages.ARTICLE_TAGS_MAX),
  published: z.boolean().default(false),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;

// ============================================
// UPDATE ARTICLE
// ============================================

export const updateArticleSchema = z.object({
  title: z
    .string()
    .min(1, ValidationMessages.ARTICLE_TITLE_REQUIRED)
    .max(255, ValidationMessages.ARTICLE_TITLE_TOO_LONG)
    .optional(),
  slug: slugSchema.optional(),
  content: z.any().optional(),
  excerpt: z
    .string()
    .max(500, ValidationMessages.ARTICLE_EXCERPT_TOO_LONG)
    .optional(),
  coverImage: z
    .string()
    .url(ValidationMessages.ARTICLE_COVER_IMAGE_INVALID)
    .optional()
    .nullable(),
  metaTitle: z
    .string()
    .max(60, ValidationMessages.ARTICLE_META_TITLE_TOO_LONG)
    .optional(),
  metaDescription: z
    .string()
    .max(160, ValidationMessages.ARTICLE_META_DESC_TOO_LONG)
    .optional(),
  tagIds: z
    .array(z.string().cuid(ValidationMessages.CUID_INVALID))
    .min(1, ValidationMessages.ARTICLE_TAGS_MIN)
    .max(10, ValidationMessages.ARTICLE_TAGS_MAX)
    .optional(),
  published: z.boolean().optional(),
});

export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

// ============================================
// PUBLISH/UNPUBLISH ARTICLE
// ============================================

export const publishArticleSchema = z.object({
  published: z.boolean(),
});

export type PublishArticleInput = z.infer<typeof publishArticleSchema>;

// ============================================
// DELETE ARTICLE
// ============================================

export const deleteArticleSchema = z.object({
  id: z.string().cuid(ValidationMessages.CUID_INVALID),
});

export type DeleteArticleInput = z.infer<typeof deleteArticleSchema>;
