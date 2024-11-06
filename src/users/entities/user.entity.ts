import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { Roles } from "src/utilities/common/user-role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: "enum", enum: Roles, array: true, default: [Roles.USER] })
    role: Roles[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToMany(() => CategoryEntity, (category) => category.addedBy)
    categories: CategoryEntity[]

    @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
    products: ProductEntity[]

    @OneToMany(() => ReviewEntity, (rev) => rev.user)
    reviews: ReviewEntity[]

    @OneToMany(() => OrderEntity, (ord) => ord.updatedBy)
    orderUpdatedBy: OrderEntity[]
}
