import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const images = {
  bentota: '/images/dest-bentota.png',
  colombo: '/images/dest-colombo.png',
  ella: '/images/dest-ella.png',
  galle: '/images/dest-galle.png',
  kandy: '/images/dest-kandy.png',
  sigiriya: '/images/dest-sigiriya.png',
  hero: '/images/hero-sri-lanka.png',
  promo: '/images/sidebar-promo.png',
} as const;

const products = [
  {
    id: '83351d2b-bc6c-4c27-a397-d54c2332993d',
    productName: 'City Highlights Tour with Comfortable Transport',
    destination: 'Ella',
    category: 'Tour',
    description:
      "Explore a city's major attractions on a convenient guided tour with comfortable transportation between stops.",
    price: '25000',
    currency: 'LKR',
    inventoryCount: 2,
    validFrom: new Date('2026-09-09T00:00:00.000Z'),
    validUntil: new Date('2026-09-10T00:00:00.000Z'),
    status: 'ACTIVE' as const,
    highlights: [
      'Visit major city attractions',
      'Comfortable transportation throughout the tour',
      'Convenient sightseeing itinerary',
      'Ideal for first-time visitors',
    ],
    inclusions: [
      'City sightseeing tour',
      'Comfortable transportation',
      'Visits to major attractions',
    ],
    tags: [
      'city tour',
      'sightseeing',
      'major attractions',
      'comfortable transport',
      'guided tour',
    ],
    images: [
      images.ella,
      images.kandy,
      images.sigiriya,
      images.hero,
      images.galle,
    ],
    createdAt: new Date('2026-09-09T08:37:19.828Z'),
    updatedAt: new Date('2026-09-09T08:37:19.828Z'),
  },
  {
    id: '479eb2c8-b6e8-42da-b49a-5241bf1810ab',
    productName: 'Colombo Sunset Dinner Cruise',
    destination: 'Colombo',
    category: 'Dining',
    description:
      'Enjoy a relaxing sunset dinner cruise along the Colombo coastline.',
    price: '8500',
    currency: 'LKR',
    inventoryCount: 20,
    validFrom: new Date('2026-09-09T00:00:00.000Z'),
    validUntil: new Date('2026-12-31T00:00:00.000Z'),
    status: 'ACTIVE' as const,
    highlights: ['Sunset ocean views', 'Welcome drink', 'Cruise access'],
    inclusions: ['Dinner buffet'],
    tags: ['sunset'],
    images: [
      images.colombo,
      images.galle,
      images.bentota,
      images.promo,
      images.hero,
    ],
    createdAt: new Date('2026-09-09T07:31:55.218Z'),
    updatedAt: new Date('2026-09-09T07:31:55.218Z'),
  },
  {
    id: 'a14540ff-9e6c-4e9a-935c-d7e39142ae7a',
    productName: 'Bentota Beach Escape',
    destination: 'Bentota, Sri Lanka',
    category: 'Travel Package',
    description:
      'Relax on the beautiful Bentota coastline with a comfortable beach getaway designed for couples and leisure travelers.',
    price: '12500',
    currency: 'LKR',
    inventoryCount: 8,
    validFrom: new Date('2026-09-09T00:00:00.000Z'),
    validUntil: new Date('2026-12-15T23:59:59.000Z'),
    status: 'ACTIVE' as const,
    highlights: [
      'Beautiful beach destination',
      'Relaxing coastal experience',
      'Ideal for couples',
      'Leisure activities',
    ],
    inclusions: [
      'Beach accommodation',
      'Breakfast',
      'Beach access',
      'Local transportation',
    ],
    tags: ['bentota', 'beach', 'couples', 'holiday', 'travel package'],
    images: [
      images.bentota,
      images.galle,
      images.colombo,
      images.hero,
      images.promo,
    ],
    createdAt: new Date('2026-09-09T05:05:51.609Z'),
    updatedAt: new Date('2026-09-09T05:05:51.609Z'),
  },
  {
    id: '5b575575-3233-4274-8424-4965743a7442',
    productName: 'Kandy Cultural Heritage Tour',
    destination: 'Kandy, Sri Lanka',
    category: 'Tour',
    description:
      'Explore the cultural heritage of Kandy with visits to historic landmarks, temples and important cultural attractions.',
    price: '9500',
    currency: 'LKR',
    inventoryCount: 12,
    validFrom: new Date('2026-09-09T00:00:00.000Z'),
    validUntil: new Date('2026-11-30T23:59:59.000Z'),
    status: 'ACTIVE' as const,
    highlights: [
      'Kandy cultural attractions',
      'Historic landmarks',
      'Temple visits',
      'Local cultural experience',
    ],
    inclusions: [
      'Kandy sightseeing',
      'Cultural guide',
      'Temple visits',
      'Local transportation',
    ],
    tags: ['kandy', 'culture', 'heritage', 'temple', 'sightseeing'],
    images: [
      images.kandy,
      images.sigiriya,
      images.ella,
      images.hero,
      images.colombo,
    ],
    createdAt: new Date('2026-09-09T05:05:43.212Z'),
    updatedAt: new Date('2026-09-09T05:05:43.212Z'),
  },
  {
    id: '81161243-7c5b-46b3-8acb-0b59a486a534',
    productName: 'Colombo Airport Transfer',
    destination: 'Colombo, Sri Lanka',
    category: 'Airport Transfer',
    description:
      'Reliable private airport transfer service between Bandaranaike International Airport and Colombo.',
    price: '4500',
    currency: 'LKR',
    inventoryCount: 20,
    validFrom: new Date('2026-09-09T00:00:00.000Z'),
    validUntil: new Date('2026-12-31T23:59:59.000Z'),
    status: 'ACTIVE' as const,
    highlights: [
      'Private airport transfer',
      'Airport pickup and drop-off',
      'Professional driver',
      'Convenient Colombo transfers',
    ],
    inclusions: [
      'Airport pickup',
      'Airport drop-off',
      'Private vehicle',
      'Professional driver',
    ],
    tags: [
      'airport transfer',
      'colombo',
      'airport pickup',
      'transport',
      'private transfer',
    ],
    images: [images.colombo, images.galle, images.hero, images.bentota],
    createdAt: new Date('2026-09-09T05:05:35.658Z'),
    updatedAt: new Date('2026-09-09T05:05:35.658Z'),
  },
  {
    id: '3cae6168-8ef7-4875-97c7-563f2db93379',
    productName: 'Ella Family Adventure',
    destination: 'Ella, Sri Lanka',
    category: 'Travel Package',
    description:
      'A family-friendly adventure in Ella combining scenic sightseeing, nature experiences and enjoyable outdoor activities.',
    price: '18000',
    currency: 'LKR',
    inventoryCount: 15,
    validFrom: new Date('2026-09-09T00:00:00.000Z'),
    validUntil: new Date('2026-12-31T23:59:59.000Z'),
    status: 'ACTIVE' as const,
    highlights: [
      'Family-friendly activities',
      'Scenic Ella landscapes',
      'Nature sightseeing',
      'Outdoor adventure',
    ],
    inclusions: [
      'Ella sightseeing',
      'Nature activities',
      'Family adventure activities',
      'Local transportation',
    ],
    tags: ['ella', 'family', 'adventure', 'sightseeing', 'travel package'],
    images: [
      images.ella,
      images.kandy,
      images.sigiriya,
      images.galle,
      images.hero,
    ],
    createdAt: new Date('2026-09-09T05:05:27.876Z'),
    updatedAt: new Date('2026-09-09T05:05:27.876Z'),
  },
  {
    id: 'a47fb34a-341d-4d27-8a9c-175aaaf29766',
    productName: 'Colombo Dinner Buffet',
    destination: 'Colombo, Sri Lanka',
    category: 'Dining',
    description:
      'Enjoy a premium international dinner buffet featuring Sri Lankan, Asian and Western cuisine in Colombo.',
    price: '7500',
    currency: 'LKR',
    inventoryCount: 25,
    validFrom: new Date('2026-09-09T00:00:00.000Z'),
    validUntil: new Date('2026-12-31T23:59:59.000Z'),
    status: 'ACTIVE' as const,
    highlights: [
      'Premium international buffet',
      'Sri Lankan cuisine',
      'Asian specialties',
      'Western dishes',
    ],
    inclusions: [
      'Dinner buffet access',
      'Sri Lankan dishes',
      'Asian dishes',
      'Western dishes',
    ],
    tags: ['dinner', 'buffet', 'colombo', 'dining', 'international cuisine'],
    images: [images.colombo, images.promo, images.galle, images.hero],
    createdAt: new Date('2026-09-09T05:05:16.825Z'),
    updatedAt: new Date('2026-09-09T05:05:16.825Z'),
  },
  {
    id: '8f50c386-173f-4974-9a87-d3bb7b1e6c34',
    productName: 'Dinner Buffet - Cinnamon Grand Colombo',
    destination: 'Colombo',
    category: 'Dining',
    description:
      'Premium international dinner buffet experience at Cinnamon Grand Colombo.',
    price: '7500',
    currency: 'LKR',
    inventoryCount: 50,
    validFrom: new Date('2026-09-01T00:00:00.000Z'),
    validUntil: new Date('2026-09-30T23:59:59.000Z'),
    status: 'ACTIVE' as const,
    highlights: [
      'International cuisine',
      'Live cooking stations',
      'Premium dining experience',
    ],
    inclusions: ['Dinner buffet', 'Dessert selection', 'Non-alcoholic beverages'],
    tags: ['dinner', 'buffet', 'colombo'],
    images: [
      images.colombo,
      images.promo,
      images.galle,
      images.bentota,
      images.hero,
    ],
    createdAt: new Date('2026-09-08T18:04:35.843Z'),
    updatedAt: new Date('2026-09-08T18:04:35.843Z'),
  },
];

async function main() {
  for (const product of products) {
    const { id, ...data } = product;

    await prisma.product.upsert({
      where: { id },
      create: product,
      update: data,
    });
  }

  console.log(`Seeded ${products.length} travel products.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
