export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string; // base64 string
  active: boolean;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  typeActionId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BannerListResponse {
  data: Banner[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface BannerFilters {
  page: number;
  limit: number;
  search: string;
  active?: boolean;
  order: 'asc' | 'desc';
  orderBy: string;
}