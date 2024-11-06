import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "src/products/entities/product.entity";

@Entity({ name: "orders_products" })
export class OrdersProductsEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    product_unit_price: number

    @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
    product_quantity: number

    @ManyToOne(() => OrderEntity, (ord) => ord.products)
    order: OrderEntity

    @ManyToOne(() => ProductEntity, (product) => product.products, { cascade: true })
    product: ProductEntity
}
