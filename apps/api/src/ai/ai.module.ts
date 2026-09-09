import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from '../products/products.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    ConfigModule,
    ProductsModule,
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}