import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Tenants } from "./Tenants";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column()
    role: string;

    //many user will belong to one tenant | there can be multiple tenant ids but each user will belong to specific tenant
    @ManyToOne(() => Tenants)
    tenant: Tenants;
}
