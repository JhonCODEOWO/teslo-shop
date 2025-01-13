import { Product } from "src/products/entities";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true,
    })
    email: string;

    @Column({
        type: 'text',
        select: false
    })
    password: string;

    @Column({
        type: 'text',
        default: 'Usuario'
    })
    fullname: string;

    @Column({
        type: 'bool',
        default: true
    })
    isActive: boolean; //Se desactiva un usuario en vez de eliminarlos

    @Column({
        type: 'text',
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Product,
        (product) => product.user,
    )
    products: Product[]
}
