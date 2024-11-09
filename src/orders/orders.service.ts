import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,
    private readonly productService: ProductsService
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity> {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippedAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippedAddress = shippingEntity;
    orderEntity.user = currentUser;

    const newOrder = await this.orderRepository.save(orderEntity);

    let orderProductEntity: {
      order: OrderEntity,
      product: ProductEntity,
      product_unit_price: number,
      product_quantity: number
    }[] = []

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const order = newOrder;
      const product = await this.productService.findOne(createOrderDto.orderedProducts[i].id);
      const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
      const product_quantity = createOrderDto.orderedProducts[i].product_quantity
      orderProductEntity.push({ order, product, product_unit_price, product_quantity })
    }

    const op = await this.opRepository.createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(orderProductEntity)
      .execute()

    return await this.findOne(newOrder.id);
  }

  async findAll(): Promise<{
    counts: number;
    data: OrderEntity[];
  }> {
    const orders = await this.orderRepository.find({
      relations: {
        shippedAddress: true,
        user: true,
        products: {
          product: true
        }
      }
    })
    return {
      counts: orders.length,
      data: orders
    }
  }

  async findOne(id: string): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippedAddress: true,
        user: true,
        products: {
          product: true
        }
      }
    })
  }



  async update(id: string, updateOrderStatusDto: UpdateOrderStatusDto, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException(`Order not found`);

    if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED) {
      throw new ForbiddenException(`Order cannot be updated as it is already ${order.status}`);
    }

    if (order.status === OrderStatus.PROCESSING && updateOrderStatusDto.status !== OrderStatus.SHIPPED) {
      throw new ForbiddenException('Delivery after shipped!!!');
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED && order.status === OrderStatus.SHIPPED) {
      return order
    }

    if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
      order.shippingAt = new Date()
    }
    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      order.deliveredAt = new Date()
    }

    order.status = updateOrderStatusDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    if (updateOrderStatusDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }
    return order
  }

  async cancelled(id: string, currentUser: UserEntity) {
    let order = await this.findOne(id);
    if (!order) throw new NotFoundException("Order not found")

    if (order.status === OrderStatus.CANCELLED) return order;

    order.status = OrderStatus.CANCELLED
    order.updatedBy = currentUser
    order = await this.orderRepository.save(order);
    await this.stockUpdate(order, OrderStatus.CANCELLED)
    return order;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async stockUpdate(order: OrderEntity, status: string) {
    for (const orderProduct of order.products) {
      await this.productService.updateStock(orderProduct.product.id, orderProduct.product_quantity, status)
    }
  }
}
