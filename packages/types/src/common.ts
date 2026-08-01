export type ID = string;

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

export type SortOrder = 'asc' | 'desc';

export interface SortParams {
  field: string;
  order: SortOrder;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}
