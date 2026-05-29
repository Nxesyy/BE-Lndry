import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, phone } = createUserDto;

      const existingUser = await this.prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new ConflictException("Email already exists/in use");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone
        }
      });

      return {
        message: 'User created successfully',
        data: user
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message || 'Something went wrong while creating user');
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany();
      return {
        message: 'Users retrieved successfully',
        data: users
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return {
        message: 'User retrieved successfully',
        data: user
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const { password, ...otherData } = updateUserDto;
      
      const userExists = await this.prisma.user.findUnique({
        where: { id }
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (otherData.email) {
        const emailExists = await this.prisma.user.findUnique({
          where: { email: otherData.email }
        });
        if (emailExists && emailExists.id !== id) {
          throw new ConflictException('Email is already in use by another user');
        }
      }

      const dataToUpdate: any = { ...otherData };
      if (password) {
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate
      });

      return {
        message: 'User updated successfully',
        data: updatedUser
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { id }
      });

      if (!userExists) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.prisma.user.delete({
        where: { id }
      });

      return {
        message: 'User deleted successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
