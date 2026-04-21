import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles, User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import slugify from 'slugify';
import { USERS_REPOSITORY } from '../../constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private usersRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userSlug = await slugify(createUserDto.name);

    const existingUser = await this.usersRepository.findOne({
      where: {
        [Op.or]: [{ email: createUserDto.email }, { slug: userSlug }],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'User already exists with this name or email',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userData: Partial<User> = {
      ...createUserDto,
      slug: userSlug,
      password: hashedPassword,
    };

    const user = await this.usersRepository.create(userData as any as User);

    return user;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    role?: Roles,
    userId?: number,
  ) {
    const offset = (page - 1) * limit;

    const whereCondition = (role as Roles) ? { role } : {};

    const { rows, count } = await this.usersRepository.findAndCountAll({
      attributes: [
        'id',
        'name',
        'email',
        'role',
        'isActive',
        'rewardPoints',
        'slug',
      ],
      where: {
        role: { [Op.ne]: Roles.ADMIN },
        ...whereCondition,
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        lastPage: Math.ceil(count / limit),
      },
    };
  }

  async getMe(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'email',
        'role',
        'isActive',
        'rewardPoints',
        'slug',
      ],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({
      where: { id },
    });
  }

  async findOneEmail(email: string) {
    return await this.usersRepository.findOne({
      where: { email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = await this.usersRepository.update(updateUserDto, {
      where: { id },
    });

    return { message: 'User updated successfully' };
  }

  async remove(id: number) {
    const data = await this.usersRepository.destroy({
      where: { id },
    });

    return data;
  }

  async changeStatus(id: number, role: string, isActive: boolean) {
    const data = await this.usersRepository.update(
      { isActive },
      {
        where: { id, role },
      },
    );

    return data;
  }

  async findCustomer() {
    const customers = await this.usersRepository.findAll({
      where: { role: Roles.CUSTOMER },
      attributes: ['id', 'name'],
    });

    return customers;
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id, role: Roles.CUSTOMER },
      attributes: ['id', 'name', 'email', 'role', 'isActive', 'number', 'dob'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }
}
