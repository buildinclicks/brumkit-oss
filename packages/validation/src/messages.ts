/**
 * Validation message keys for internationalization (i18n)
 *
 * Usage:
 * - Use these keys in Zod schemas
 * - Map these keys to actual translations in your i18n files
 * - Format: '{category}.{specific_error}' (without 'validation.' prefix)
 * - The 'validation.' prefix is added automatically by useValidationMessages hook
 */

export const ValidationMessages = {
  // ============================================
  // COMMON
  // ============================================
  REQUIRED: 'common.required',
  INVALID_FORMAT: 'common.invalid_format',
  TOO_SHORT: 'common.too_short',
  TOO_LONG: 'common.too_long',
  INVALID_TYPE: 'common.invalid_type',
  INVALID_VALUE: 'common.invalid_value',

  // ============================================
  // EMAIL
  // ============================================
  EMAIL_REQUIRED: 'email.required',
  EMAIL_INVALID: 'email.invalid',
  EMAIL_TOO_SHORT: 'email.too_short',
  EMAIL_TOO_LONG: 'email.too_long',

  // ============================================
  // PASSWORD
  // ============================================
  PASSWORD_REQUIRED: 'password.required',
  PASSWORD_TOO_SHORT: 'password.too_short',
  PASSWORD_TOO_LONG: 'password.too_long',
  PASSWORD_NO_UPPERCASE: 'password.no_uppercase',
  PASSWORD_NO_LOWERCASE: 'password.no_lowercase',
  PASSWORD_NO_NUMBER: 'password.no_number',
  PASSWORD_MISMATCH: 'password.mismatch',

  // ============================================
  // USERNAME
  // ============================================
  USERNAME_REQUIRED: 'username.required',
  USERNAME_INVALID: 'username.invalid_format',
  USERNAME_TOO_SHORT: 'username.too_short',
  USERNAME_TOO_LONG: 'username.too_long',

  // ============================================
  // USER
  // ============================================
  USER_NAME_REQUIRED: 'user.name_required',
  USER_NAME_TOO_LONG: 'user.name_too_long',
  USER_BIO_TOO_LONG: 'user.bio_too_long',
  USER_IMAGE_INVALID: 'user.image_invalid_url',

  // ============================================
  // ARTICLE
  // ============================================
  ARTICLE_TITLE_REQUIRED: 'article.title_required',
  ARTICLE_TITLE_TOO_LONG: 'article.title_too_long',
  ARTICLE_CONTENT_REQUIRED: 'article.content_required',
  ARTICLE_SLUG_REQUIRED: 'article.slug_required',
  ARTICLE_SLUG_INVALID: 'article.slug_invalid_format',
  ARTICLE_SLUG_TOO_LONG: 'article.slug_too_long',
  ARTICLE_EXCERPT_TOO_LONG: 'article.excerpt_too_long',
  ARTICLE_COVER_IMAGE_INVALID: 'article.cover_image_invalid_url',
  ARTICLE_META_TITLE_TOO_LONG: 'article.meta_title_too_long',
  ARTICLE_META_DESC_TOO_LONG: 'article.meta_description_too_long',
  ARTICLE_TAGS_MIN: 'article.tags_minimum',
  ARTICLE_TAGS_MAX: 'article.tags_maximum',

  // ============================================
  // TAG
  // ============================================
  TAG_NAME_REQUIRED: 'tag.name_required',
  TAG_NAME_TOO_SHORT: 'tag.name_too_short',
  TAG_NAME_TOO_LONG: 'tag.name_too_long',
  TAG_SLUG_REQUIRED: 'tag.slug_required',
  TAG_SLUG_INVALID: 'tag.slug_invalid_format',
  TAG_SLUG_TOO_LONG: 'tag.slug_too_long',
  TAG_COLOR_INVALID: 'tag.color_invalid_hex',

  // ============================================
  // COMMENT
  // ============================================
  COMMENT_CONTENT_REQUIRED: 'comment.content_required',
  COMMENT_CONTENT_TOO_SHORT: 'comment.content_too_short',
  COMMENT_CONTENT_TOO_LONG: 'comment.content_too_long',
  COMMENT_ARTICLE_ID_REQUIRED: 'comment.article_id_required',

  // ============================================
  // NOTIFICATION
  // ============================================
  NOTIFICATION_TITLE_REQUIRED: 'notification.title_required',
  NOTIFICATION_TITLE_TOO_LONG: 'notification.title_too_long',
  NOTIFICATION_MESSAGE_REQUIRED: 'notification.message_required',
  NOTIFICATION_LINK_INVALID: 'notification.link_invalid_url',
  NOTIFICATION_LINK_TOO_LONG: 'notification.link_too_long',

  // ============================================
  // FOLLOW
  // ============================================
  FOLLOW_FOLLOWER_ID_REQUIRED: 'follow.follower_id_required',
  FOLLOW_FOLLOWING_ID_REQUIRED: 'follow.following_id_required',
  FOLLOW_SELF_NOT_ALLOWED: 'follow.self_not_allowed',

  // ============================================
  // BOOKMARK
  // ============================================
  BOOKMARK_USER_ID_REQUIRED: 'bookmark.user_id_required',
  BOOKMARK_ARTICLE_ID_REQUIRED: 'bookmark.article_id_required',

  // ============================================
  // REACTION
  // ============================================
  REACTION_TYPE_REQUIRED: 'reaction.type_required',
  REACTION_TYPE_INVALID: 'reaction.type_invalid',
  REACTION_USER_ID_REQUIRED: 'reaction.user_id_required',
  REACTION_ARTICLE_ID_REQUIRED: 'reaction.article_id_required',

  // ============================================
  // SLUG
  // ============================================
  SLUG_INVALID: 'slug.invalid_format',
  SLUG_TOO_SHORT: 'slug.too_short',
  SLUG_TOO_LONG: 'slug.too_long',

  // ============================================
  // PAGINATION
  // ============================================
  PAGE_INVALID: 'pagination.page_invalid',
  PAGE_TOO_SMALL: 'pagination.page_too_small',
  LIMIT_INVALID: 'pagination.limit_invalid',
  LIMIT_TOO_SMALL: 'pagination.limit_too_small',
  LIMIT_TOO_LARGE: 'pagination.limit_too_large',

  // ============================================
  // SORT
  // ============================================
  SORT_FIELD_INVALID: 'sort.field_invalid',
  SORT_DIRECTION_INVALID: 'sort.direction_invalid',

  // ============================================
  // CUID
  // ============================================
  CUID_INVALID: 'cuid.invalid_format',
} as const;

/**
 * Type for validation message keys
 */
export type ValidationMessageKey =
  (typeof ValidationMessages)[keyof typeof ValidationMessages];
