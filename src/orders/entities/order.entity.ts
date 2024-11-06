import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { OrderStatus } from "../enums/order-status.enums";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductsEntity } from "./orders-products.entity";

@Entity({ name: "orders" })
export class OrderEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    orderAt: Timestamp;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
    status: string;

    @Column({ nullable: true })
    shipped: Date;

    @Column({ nullable: true })
    delivered: Date

    @ManyToOne(() => UserEntity, (user) => user.orderUpdatedBy)
    updatedBy: UserEntity

    @OneToOne(() => ShippingEntity, (shp) => shp.order, { cascade: true })
    @JoinColumn()
    shippedAddress: ShippingEntity

    @OneToMany(() => OrdersProductsEntity, (ordProd) => ordProd.order, { cascade: true })
    products: OrdersProductsEntity[]
}
