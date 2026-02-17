/**
 * Common Types
 *
 * Shared types used across the entire application.
 */

/**
 * Brand a primitive type to create a nominal type
 * @example
 * type UserId = Brand<string, "UserId">;
 * const userId: UserId = "123" as UserId;
 */
export type Brand<T, TBrand extends string> = T & { __brand: TBrand };

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make all properties required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/**
 * Make specific keys optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific keys required
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Extract keys of a specific type
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Nullable type (value or null)
 */
export type Nullable<T> = T | null;

/**
 * Maybe type (value or null or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * JSON-serializable types
 */
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

/**
 * JSON object type
 */
export type JSONObject = { [key: string]: JSONValue };

/**
 * Prettify complex types (show expanded type in IDE)
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Common ID types
 */
export type ID = Brand<string, 'ID'>;
export type UserId = Brand<string, 'UserId'>;
export type ArticleId = Brand<string, 'ArticleId'>;
export type CommentId = Brand<string, 'CommentId'>;
export type TagId = Brand<string, 'TagId'>;

/**
 * Timestamp types
 */
export type Timestamp = Brand<Date, 'Timestamp'>;
export type ISODateString = Brand<string, 'ISODateString'>;

/**
 * Email type
 */
export type Email = Brand<string, 'Email'>;

/**
 * URL type
 */
export type URL = Brand<string, 'URL'>;

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort options
 */
export interface SortOptions<T> {
  field: keyof T;
  direction: SortDirection;
}

/**
 * Filter operator
 */
export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'notIn'
  | 'contains'
  | 'startsWith'
  | 'endsWith';

/**
 * Filter condition
 */
export interface FilterCondition<T> {
  field: keyof T;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Query options for lists
 */
export interface QueryOptions<T> {
  page?: number;
  pageSize?: number;
  sort?: SortOptions<T>;
  filters?: FilterCondition<T>[];
  search?: string;
}

/**
 * Common entity fields
 */
export interface BaseEntity {
  id: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Soft deletable entity
 */
export interface SoftDeletableEntity extends BaseEntity {
  deletedAt: Nullable<Timestamp>;
}

/**
 * Entity with audit trail
 */
export interface AuditableEntity extends BaseEntity {
  createdBy: UserId;
  updatedBy: UserId;
}
