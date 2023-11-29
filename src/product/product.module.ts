import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../shared/shared.module';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { ProductController } from './controller/product.controller';
import { CategoryController } from './controller/category.controller';
import { ProductService } from './service/product.service';
import { CategoryService } from './service/category.service';
import { ProductRepository } from './repositories/product.repository';
import { CategoryRepository } from './repositories/category.repository';

//entities
import { Product } from './entities/product.entity';
import { ProductStatus } from './entities/product.status.entity';

import { ProductAddon } from './entities/product.addon.entity';
import { ProductOption } from './entities/product.option.entity';
import { ProductOptionItem } from './entities/product.option.item.entity';
import { ProductPriceRate } from './entities/product.pricerate.entity';

import { Category } from './entities/category.entity';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      Product,
      ProductStatus,
      ProductAddon,
      ProductOption,
      ProductOptionItem,
      ProductPriceRate,
      Category,
    ]),
  ],
  controllers: [ProductController, CategoryController],
  providers: [
    ProductService,
    CategoryService,
    ProductRepository,
    CategoryRepository,
    JwtAuthStrategy,
  ],
  exports: [ProductService, CategoryService],
})
export class ProductModule {}
