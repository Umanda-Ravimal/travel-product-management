import type { Product } from '../types/product';

type ProductImageSource = Pick<Product, 'destination'> & {
  images?: string[];
};

const destinationImages: Record<string, string> = {
  Colombo: '/images/dest-colombo.png',
  Ella: '/images/dest-ella.png',
  Kandy: '/images/dest-kandy.png',
  Bentota: '/images/dest-bentota.png',
  Galle: '/images/dest-galle.png',
  Sigiriya: '/images/dest-sigiriya.png',
};

const galleryPool = [
  '/images/hero-sri-lanka.png',
  '/images/dest-colombo.png',
  '/images/dest-ella.png',
  '/images/dest-kandy.png',
  '/images/dest-bentota.png',
  '/images/dest-galle.png',
  '/images/dest-sigiriya.png',
  '/images/sidebar-promo.png',
];

function getDestinationImage(destination: string): string {
  const match = Object.keys(destinationImages).find((name) =>
    destination.toLowerCase().includes(name.toLowerCase()),
  );

  return match ? destinationImages[match] : '/images/hero-sri-lanka.png';
}

export function getProductImage(product: ProductImageSource): string {
  if (product.images?.[0]) {
    return product.images[0];
  }

  return getDestinationImage(product.destination);
}

export function getProductGalleryImages(product: ProductImageSource): string[] {
  if (product.images && product.images.length > 0) {
    return product.images;
  }

  const primary = getDestinationImage(product.destination);

  return [primary, ...galleryPool.filter((image) => image !== primary)];
}
