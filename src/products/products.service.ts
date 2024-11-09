import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/orders/enums/order-status.enums';
import { dataSource } from 'database/data-source';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService)) private readonly orderService: OrdersService
  ) { }

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(createProductDto.categoryId);

    const product = this.productRepository.create({
      ...createProductDto,
      category: category,
      addedBy: currentUser,
    });

    return await this.productRepository.save(product);
  }

  async findAll(query: any): Promise<{
    totalProducts: number;
    limit: number;
    products: any[]
  }> {
    let filteredTotalProducts: number;
    let limit: number

    if (!query.limit) {
      limit = 4
    } else {
      limit = query.limit
    }

    const queryBuilder = dataSource.getRepository(ProductEntity)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoin('product.reviews', 'review')
      .addSelect([
        "COUNT(review.id) as reviewCount",
        "AVG(review.rating)::numeric(10,2) as avgRating",
      ])
      .groupBy('product.id,category.id')

    const totalProducts = await queryBuilder.getCount()

    if (query.search) {
      const search = query.search
      queryBuilder.andWhere("product.title like :title", { title: `%${search}%` })
    }

    if (query.category) {
      queryBuilder.andWhere("category.id=:id", { id: query.category })
    }

    if (query.minPrice) {
      queryBuilder.andWhere("product.price>=:minPrice", { minPrice: query.minPrice })
    }

    if (query.maxPrice) {
      queryBuilder.andWhere("product.price<=:maxPrice", { maxPrice: query.maxPrice })
    }

    if (query.minRating) {
      queryBuilder.andHaving("AVG(review.rating)>=:minRating", { minRating: query.minRating });
    };

    if (query.maxRating) {
      queryBuilder.andHaving("AVG(review.rating)<=:maxRating", { maxRating: query.maxRating });
    };

    queryBuilder.limit(limit);

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    const products = await queryBuilder.getRawMany();
    return { totalProducts, limit, products };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id }, relations: { addedBy: true, category: true }, select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        },
        category: {
          id: true,
          title: true,
        }
      }
    });
    if (!product) throw new NotFoundException("Product not found")
    return product;
  }

  async update(id: string, currentUser: UserEntity, updateProductDto: Partial<UpdateProductDto>): Promise<ProductEntity> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    product.addedBy = currentUser;

    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(updateProductDto.categoryId);
      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    const order = await this.orderService.findOneByProductId(product.id);
    if (order) {
      throw new BadRequestException("Cannot delete product while it's in an order");
    }

    return await this.productRepository.remove(product);
  }

  async updateStock(id: string, stock: number, status: string) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
