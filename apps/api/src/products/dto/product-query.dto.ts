import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ProductStatus } from './create-product.dto';
  
  export class ProductQueryDto {
    @IsOptional()
    @IsString()
    search?: string;
  
    @IsOptional()
    @IsString()
    destination?: string;
  
    @IsOptional()
    @IsString()
    category?: string;
  
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;
  
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 10;
  }