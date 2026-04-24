import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { promoProviders } from './promo.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [PromoController],
  providers: [PromoService, ...promoProviders],
  exports: [PromoService, ...promoProviders],
})
export class PromoModule {}
