import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        }
      });
      return {
        message: 'Users retrieved successfully',
        data: users
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
      return {
        message: 'Orders retrieved successfully',
        data: orders
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve orders');
    }
  }

  async updateOrderStatus(id: number, status: any) {
    try {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException(`Order with ID ${id} not found`);

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status }
      });

      return {
        message: 'Order status updated successfully',
        data: updatedOrder
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update order status');
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException(`User with ID ${id} not found`);

      await this.prisma.user.delete({ where: { id } });

      return {
        message: `User ${id} deleted successfully`
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
