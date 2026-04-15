import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { wishlistProviders } from './wishlist.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WishlistController],
  providers: [WishlistService, ...wishlistProviders],
  exports: [WishlistService],
})
export class WishlistModule {}
