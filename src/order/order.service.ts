import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const { userId, weight, serviceType, pricePerKg, estimatedFinish } = createOrderDto;
      
      const totalPrice = weight * pricePerKg;
      
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const invoiceCode = `INV-${dateStr}-${randomStr}`;

      const order = await this.prisma.order.create({
        data: {
          invoiceCode,
          userId,
          weight,
          serviceType,
          pricePerKg,
          totalPrice,
          estimatedFinish: new Date(estimatedFinish),
          status: 'DIPROSES',
        }
      });

      return {
        message: 'Order created successfully',
        data: order
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async findAll() {
    try {
      const orders = await this.prisma.order.findMany({
        include: { user: { select: { id: true, name: true, email: true } } }
      });
      return {
        message: 'Orders retrieved successfully',
        data: orders
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve orders');
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true } } }
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return {
        message: 'Order retrieved successfully',
        data: order
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to retrieve order');
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const orderExists = await this.prisma.order.findUnique({ where: { id } });
      if (!orderExists) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      const dataToUpdate: any = { ...updateOrderDto };
      if (updateOrderDto.estimatedFinish) {
        dataToUpdate.estimatedFinish = new Date(updateOrderDto.estimatedFinish);
      }
      
      if (updateOrderDto.weight || updateOrderDto.pricePerKg) {
        const newWeight = updateOrderDto.weight ?? orderExists.weight;
        const newPricePerKg = updateOrderDto.pricePerKg ?? orderExists.pricePerKg;
        dataToUpdate.totalPrice = newWeight * newPricePerKg;
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: dataToUpdate
      });

      return {
        message: 'Order updated successfully',
        data: updatedOrder
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update order');
    }
  }

  async remove(id: number) {
    try {
      const orderExists = await this.prisma.order.findUnique({ where: { id } });
      if (!orderExists) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await this.prisma.order.delete({ where: { id } });

      return {
        message: 'Order deleted successfully'
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete order');
    }
  }
}
