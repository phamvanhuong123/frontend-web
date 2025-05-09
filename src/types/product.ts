interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  categoryName: string;
  manufacturerName: string;
  discountName: string;
  quantity: number;
  storeName: string;
  images: {
    id: string;
    productId: string;
    url: string;
  }[];
}

export interface ProductQueryParameters {
  pageIndex: number;
  pageSize: number;
  searchTerm?: string | null;
  categoryId?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  isActive?: boolean | null;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc" | null;
}

export interface PaginationResponse<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export interface CreateAProduct {
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryId: string;
  manufacturerId: string;
  discountId?: string;
  quantity: number;
  storeId: string;
  images?: {
    id: string;
    productId: string;
    url: string;
  }[];
}

export interface DetailAProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  isActive: boolean;
  categoryName: string;
  manufacturerName: string;
  discountName: string;
  images: {
    id: string;
    productId: string;
    url: string;
  }[];
}

export interface UpdateAProduct {
  quantity: number;
}

export default Product;
