import { Body, Controller, Post } from '@nestjs/common';

import { AiService } from './ai.service';
import { GenerateProductDto } from './dto/generate-product.dto';
import { GeneratedProduct } from './dto/generated-product.dto';
import { AiSearchDto } from './dto/ai-search.dto';
import { AiSearchResult } from './dto/ai-search-result.dto';

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
  parseSearchQuery(
    @Body() dto: AiSearchDto,
  ): Promise<AiSearchResult> {
    return this.aiService.parseSearchQuery(dto);
  }
}