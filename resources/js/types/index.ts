export interface PageProps {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role?: string;
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