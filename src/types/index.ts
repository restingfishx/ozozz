// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  status: 'active' | 'inactive';
  specs: ProductSpec[];
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpec {
  name: string;
  values: string[];
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'sales' | 'newest';
  search?: string;
  page?: number;
}

// API response types
export type ProductsResponse = PaginatedResponse<Product>;

export interface CategoriesResponse {
  data: string[];
}

// Cart types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  specs: Record<string, string>;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string | null;
  items: CartItem[];
  totalAmount: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  specs: Record<string, string>;
}
