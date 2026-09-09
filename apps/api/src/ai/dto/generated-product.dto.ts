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