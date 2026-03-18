export interface ApiResponse<T = any> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }
}