export interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role?: string;
      email_verified_at?: string;
      created_at: string;
      updated_at: string;
    };
  };
  errors: Record<string, string>;
  flash?: {
    message?: string;
    success?: boolean;
    error?: boolean;
  };
}

export interface PaginatedData<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CategoryItem {
  id: number;
  name: string;
  icon: string;
  itemCount: number;
  bgColor: string;
  discount?: number;
  slug: string;
}

export interface ProductItem {
  id: number;
  name: string;
  price_cents: number;
  category_id: number;
  category_name: string;
  slug: string;
  image_url: string;
  discount?: number;
  stock: number;
  description: string;
}

export interface ProductCartItem {
  id: number;
  name: string;
  price_cents: number;
  category_id: number;
  category_name: string;
  slug: string;
  image_url: string;
  discount?: number;
  stock: number;
  description: string;
  quantity: number;
}

export interface ProductCart {
  items: ProductCartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface ProductCartUpdateItem {
  id: number;
  quantity: number;
}

export interface ProductCartUpdateResponse {
  cart: ProductCart;
}
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}
