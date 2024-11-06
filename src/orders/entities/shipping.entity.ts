import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({ name: "shippings" })
export class ShippingEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({default: " "}) 
    name: string;

    @Column() 
    address: string;

    @Column() 
    city: string;

    @Column() 
    postCode: string;

    @Column() 
    state: string;

    @Column() 
    country: string;
    @OneToOne(()=>OrderEntity, (ord)=> ord.shippedAddress)
    order: OrderEntity;
}
