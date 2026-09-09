import { Body, Controller, Post } from '@nestjs/common';

import { AiService } from './ai.service';
import { GenerateProductDto } from './dto/generate-product.dto';
import { GeneratedProduct } from './dto/generated-product.dto';
import { AiSearchDto } from './dto/ai-search.dto';

@Controller('ai/products')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  generateProduct(
    @Body() dto: GenerateProductDto,
  ): Promise<GeneratedProduct> {
    return this.aiService.generateProduct(dto);
  }

  @Post('search')
  searchProducts(@Body() dto: AiSearchDto) {
    return this.aiService.searchProducts(dto);
  }
}