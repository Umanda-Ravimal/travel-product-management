import type { Product } from '../types/product';

export function formatPrice(product: Product): string {
  const amount = Number(product.price);

  return `${product.currency} ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function getDisplayStatus(product: Product) {
  const now = Date.now();
  const until = new Date(product.validUntil).getTime();

  if (until < now) {
    return 'EXPIRED' as const;
  }

  const thirtyDays = 30 * 24 * 60 * 60 * 1000;

  if (product.status === 'ACTIVE' && until - now <= thirtyDays) {
    return 'EXPIRING' as const;
  }

  return product.status;
}
