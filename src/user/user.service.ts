import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Partial<User> | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      omit: {
        password: true,
      },
    });
  }

  async userWithPassword(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Partial<User>[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      omit: {
        password: true,
      },
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<Partial<User>> {
    return this.prisma.user.create({
      data,
      omit: {
        password: true,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<Partial<User>> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
      omit: {
        password: true,
      },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<Partial<User>> {
    return this.prisma.user.delete({
      where,
      omit: {
        password: true,
      },
    });
  }
}
