import { Inject, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ADDRESS_REPOSITORY } from '../../constants';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @Inject(ADDRESS_REPOSITORY)
    private readonly addressRepository: typeof Address,
  ) {}

  async create(createAddressDto: CreateAddressDto, user: { id: number }) {
    const data = await this.addressRepository.create({
      address: createAddressDto.address,
      city: createAddressDto.city,
      state: createAddressDto.state,
      userId: user.id,
    } as any as Address);

    return { message: 'Address created successfully', data };
  }

  async findAll(user: { id: number }) {
    return await this.addressRepository.findAll({
      where: { userId: user.id, isActive: true },
    });
  }

  async findOne(id: number) {
    return await this.addressRepository.findOne({
      where: { id, isActive: true },
    });
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({
      where: { id, isActive: true },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return await address.update(updateAddressDto);
  }

  async remove(id: number) {
    const address = await this.addressRepository.findOne({
      where: { id, isActive: true },
    });

    if (!address) {
      throw new Error('Address not found');
    }

    return await address.update({ isActive: false });
  }
}
