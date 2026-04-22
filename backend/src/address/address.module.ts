import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { addressProviders } from './address.providers';

@Module({
  controllers: [AddressController],
  providers: [AddressService, ...addressProviders],
  exports: [AddressService],
})
export class AddressModule {}
