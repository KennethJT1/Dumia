import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,

    @InjectRepository(OrdersProductsEntity)
    private opRepository: Repository<OrdersProductsEntity>,
  ) { }

  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippedAddress);

    const orderEntity = new OrderEntity();
    orderEntity.shippedAddress = shippingEntity;
    orderEntity.user = currentUser;

    const order = await this.orderRepository.save(orderEntity);

    let orderProductEntity: {
      orderId: string,
      productId: string,
      product_unit_price: number,
      product_quantity: number
    }[] = []

    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      const orderId = order.id;
      const productId = createOrderDto.orderedProducts[i].id;
      const product_unit_price = createOrderDto.orderedProducts[i].product_unit_price;
      const product_quantity = createOrderDto.orderedProducts[i].product_quantity
      orderProductEntity.push({ orderId, productId, product_unit_price, product_quantity })
    }

    const op = await this.opRepository.createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(orderProductEntity)
      .execute()

    return await this.findOne(order.id);
  }


  findAll() {
    return `This action returns all orders`;
  }

  async findOne(id: string) {
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



  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
