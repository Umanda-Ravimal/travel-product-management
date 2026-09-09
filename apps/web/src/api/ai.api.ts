import type { Product } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL;

export interface GeneratedProduct {
  productName: string;
  destination: string;
  category: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  tags: string[];
  validFrom: string | null;
  validUntil: string | null;
}

export interface AiSearchFilters {
  search: string | null;
  destination: string | null;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export interface AiSearchResponse {
  query: string;
  filters: AiSearchFilters;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function generateProduct(
  prompt: string,
): Promise<GeneratedProduct> {
  const response = await fetch(`${API_URL}/ai/products/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || 'Failed to generate product',
    );
  }

  return response.json();
}

export async function searchProductsWithAi(
  query: string,
): Promise<AiSearchResponse> {
  const response = await fetch(`${API_URL}/ai/products/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || 'Failed to search products with AI',
    );
  }

  return response.json();
}