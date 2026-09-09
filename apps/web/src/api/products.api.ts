import type {
  Product,
  ProductListResponse,
} from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

export interface ProductQuery {
  search?: string;
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name';
}

export interface CreateProductPayload {
  productName: string;
  destination: string;
  category: string;
  description: string;
  price: string;
  inventoryCount: number;
  validFrom: string;
  validUntil: string;
  status: 'ACTIVE' | 'INACTIVE';
  highlights?: string[];
  inclusions?: string[];
  tags?: string[];
  images?: string[];
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductListResponse> {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search);
  }

  if (query.destination) {
    params.set('destination', query.destination);
  }

  if (query.category) {
    params.set('category', query.category);
  }

  if (query.minPrice !== undefined) {
    params.set('minPrice', String(query.minPrice));
  }

  if (query.maxPrice !== undefined) {
    params.set('maxPrice', String(query.maxPrice));
  }

  if (query.page !== undefined) {
    params.set('page', String(query.page));
  }

  if (query.limit !== undefined) {
    params.set('limit', String(query.limit));
  }

  if (query.sort) {
    params.set('sort', query.sort);
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}/products${queryString ? `?${queryString}` : ''}`,
  );

  if (!response.ok) {
    throw new Error('Failed to load products.');
  }

  return response.json();
}

export async function getProduct(
  id: string,
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/products/${id}`,
  );

  if (!response.ok) {
    throw new Error('Failed to load product.');
  }

  return response.json();
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create product.');
  }

  return response.json();
}

export async function updateProduct(
  id: string,
  payload: Partial<CreateProductPayload>,
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update product.');
  }

  return response.json();
}

export async function deleteProduct(
  id: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/products/${id}`,
    {
      method: 'DELETE',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to delete product.');
  }
}