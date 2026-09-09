import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GenerateProductDto } from './dto/generate-product.dto';
import { PRODUCT_GENERATION_SYSTEM_PROMPT } from './prompts/product-generation.prompt';
import { GeneratedProduct } from './dto/generated-product.dto';
import { AiSearchDto } from './dto/ai-search.dto';
import { AiSearchResult } from './dto/ai-search-result.dto';
import { PRODUCT_SEARCH_SYSTEM_PROMPT } from './prompts/product-search.prompt';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');

    if (!apiKey) {
      throw new InternalServerErrorException(
        'OPENAI_API_KEY is not configured.',
      );
    }

    this.model =
      this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-5.6-luna';

    this.openai = new OpenAI({
      apiKey,
    });
  }

  async generateProduct(dto: GenerateProductDto): Promise<GeneratedProduct> {
    const currentDate = new Date().toISOString();

    try {
      const response = await this.openai.responses.create({
        model: this.model,

        instructions: `
            ${PRODUCT_GENERATION_SYSTEM_PROMPT}
  
            Current date and time:
            ${currentDate}
  
            Use this date when interpreting relative dates such as:
            - today
            - tomorrow
            - next week
            - this month
            - end of this month
            - next month
  
            Do not invent information that was not provided or cannot
            reasonably be derived from the user's request.
          `,

        input: dto.prompt,

        text: {
          format: {
            type: 'json_schema',
            name: 'generated_travel_product',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                productName: {
                  type: 'string',
                },
                destination: {
                  type: 'string',
                },
                category: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                highlights: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                inclusions: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                tags: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                },
                validFrom: {
                  type: ['string', 'null'],
                },
                validUntil: {
                  type: ['string', 'null'],
                },
              },
              required: [
                'productName',
                'destination',
                'category',
                'description',
                'highlights',
                'inclusions',
                'tags',
                'validFrom',
                'validUntil',
              ],
            },
          },
        },
      });

      if (!response.output_text) {
        throw new BadGatewayException('OpenAI returned an empty response.');
      }

      let generatedProduct: GeneratedProduct;

      try {
        generatedProduct = JSON.parse(response.output_text) as GeneratedProduct;
      } catch {
        throw new BadGatewayException(
          'OpenAI returned an invalid product response.',
        );
      }

      return generatedProduct;
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      console.error('AI product generation failed:', error);

      throw new BadGatewayException('Failed to generate product using AI.');
    }
  }

  async parseSearchQuery(dto: AiSearchDto): Promise<AiSearchResult> {
    try {
      const response = await this.openai.responses.create({
        model: this.model,

        instructions: PRODUCT_SEARCH_SYSTEM_PROMPT,

        input: dto.query,

        text: {
          format: {
            type: 'json_schema',
            name: 'travel_product_search',
            strict: true,
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                search: {
                  type: ['string', 'null'],
                },
                destination: {
                  type: ['string', 'null'],
                },
                category: {
                  type: ['string', 'null'],
                },
                maxPrice: {
                  type: ['number', 'null'],
                },
                minPrice: {
                  type: ['number', 'null'],
                },
              },
              required: [
                'search',
                'destination',
                'category',
                'maxPrice',
                'minPrice',
              ],
            },
          },
        },
      });

      if (!response.output_text) {
        throw new BadGatewayException(
          'OpenAI returned an empty search response.',
        );
      }

      try {
        return JSON.parse(response.output_text) as AiSearchResult;
      } catch {
        throw new BadGatewayException(
          'OpenAI returned an invalid search response.',
        );
      }
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error;
      }

      console.error('AI search parsing failed:', error);

      throw new BadGatewayException('Failed to process AI search query.');
    }
  }
}
