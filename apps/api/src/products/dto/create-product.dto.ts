import {
    IsArray,
    IsDateString,
    IsDecimal,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
    MinLength,
  } from 'class-validator';
  
  export enum ProductStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
  }
  
  export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    productName: string;
  
    @IsString()
    @IsNotEmpty()
    destination: string;
  
    @IsString()
    @IsNotEmpty()
    category: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string;
  
    @IsDecimal()
    price: string;
  
    @IsInt()
    @Min(0)
    inventoryCount: number;
  
    @IsDateString()
    validFrom: string;
  
    @IsDateString()
    validUntil: string;
  
    @IsEnum(ProductStatus)
    status: ProductStatus;
  
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    highlights?: string[];
  
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    inclusions?: string[];
  
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
  }