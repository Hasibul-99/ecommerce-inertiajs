export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  role?: string;
}

export interface Address {
  id: number;
  user_id: number;
  name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_cents: number;
  sale_price_cents?: number;
  vendor_id?: number;
  category_id: number;
  status: string;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  sku: string;
  price_cents: number;
  sale_price_cents?: number;
  stock_quantity: number;
  weight_grams?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id: number;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price_cents: number;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  product_snapshot?: any;
  created_at: string;
  updated_at: string;
  product?: Product;
  productVariant?: ProductVariant;
}

export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  shipping_address_id: number;
  billing_address_id: number;
  payment_method: string;
  payment_status: string;
  subtotal_cents: number;
  tax_cents: number;
  shipping_cents: number;
  discount_cents?: number;
  total_cents: number;
  status: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user?: User;
  items?: OrderItem[];
  shippingAddress?: Address;
  billingAddress?: Address;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  parent?: Category;
}

export interface Vendor {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  status: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  user?: User;
}