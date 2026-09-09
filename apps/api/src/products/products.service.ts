import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private getAvailableProductFilter() {
    const now = new Date();

    return {
      status: 'ACTIVE' as const,

      inventoryCount: {
        gt: 0,
      },

      validFrom: {
        lte: now,
      },

      validUntil: {
        gte: now,
      },
    };
  }

  async create(createProductDto: CreateProductDto) {
    const from = new Date(createProductDto.validFrom);
    const until = new Date(createProductDto.validUntil);

    if (until <= from) {
      throw new BadRequestException(
        'Valid until date must be later than valid from date.',
      );
    }
    const {
      productName,
      destination,
      category,
      description,
      price,
      inventoryCount,
      validFrom,
      validUntil,
      status,
      highlights = [],
      inclusions = [],
      tags = [],
      images = [],
    } = createProductDto;

    return this.prisma.product.create({
      data: {
        productName,
        destination,
        category,
        description,
        price,
        inventoryCount,
        validFrom: from,
        validUntil: until,
        status,
        highlights,
        inclusions,
        tags,
        images,
      },
    });
  }

  async findAll(query: ProductQueryDto) {
    const {
      search,
      destination,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort = 'newest',
    } = query;

    const skip = (page - 1) * limit;

    const orderBy =
      sort === 'oldest'
        ? { createdAt: 'asc' as const }
        : sort === 'price_asc'
          ? { price: 'asc' as const }
          : sort === 'price_desc'
            ? { price: 'desc' as const }
            : sort === 'name'
              ? { productName: 'asc' as const }
              : { createdAt: 'desc' as const };

    const where = {
      ...this.getAvailableProductFilter(),

      ...(destination && {
        destination: {
          contains: destination,
          mode: 'insensitive' as const,
        },
      }),

      ...(category && {
        category: {
          contains: category,
          mode: 'insensitive' as const,
        },
      }),

      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && {
                gte: minPrice,
              }),
              ...(maxPrice !== undefined && {
                lte: maxPrice,
              }),
            },
          }
        : {}),

      ...(search && {
        OR: [
          {
            productName: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            destination: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            category: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
        ],
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.validFrom && updateProductDto.validUntil) {
      const from = new Date(updateProductDto.validFrom);
      const until = new Date(updateProductDto.validUntil);

      if (until <= from) {
        throw new BadRequestException(
          'Valid until date must be later than valid from date.',
        );
      }
    }

    const data = {
      ...updateProductDto,
      ...(updateProductDto.validFrom && {
        validFrom: new Date(updateProductDto.validFrom),
      }),
      ...(updateProductDto.validUntil && {
        validUntil: new Date(updateProductDto.validUntil),
      }),
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Product deleted successfully.',
    };
  }
}
