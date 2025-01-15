//product.entity.ts

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/users.entity";
import { ApiProperty } from "@nestjs/swagger";

//Representación de una tabla
@Entity({
    name: 'products'
})
export class Product {
    
    @ApiProperty({
        example: 'f4a072a7-7758-4bc2-8619-3ed2bf0b5915',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid') //Configurar clave primaria como un uuid
    id: string;

    @ApiProperty({
        example: 'T Shirt',
        description: 'Product title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    }) //Se especifica que esta es una columna el tipo de dato y las opciones
    title: string;

    @ApiProperty({
        default: 0,
        example: '54.80',
        description: 'Product price'
    })
    @Column('float', {
        default: 0,
        nullable: false
    })
    price: number;

    @ApiProperty({
        example: 'Laboris in do magna ex consequat sit consectetur ad nulla sint culpa cupidatat exercitation ullamco.',
        description: 'Product description'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt',
        description: 'Product slug - FOR SEO',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
        nullable: false
    })
    slug: string;

    @ApiProperty({
        default:0,
        example: 10,
        description: 'Product stock'
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'XL', 'XXL'],
        description: 'Product sizes'
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender',
    })
    @Column('text')
    gender: string;

    // Tags definidos como un arreglo de strings
    @ApiProperty({
        default: [],
        example: ['shirts', 'sweater'],
        description: 'Product gender',
    })
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    //Images
    @OneToMany(
        ()=> ProductImage, //Definimos hacia que entidad aplicará la relación one to many
        (productImage) => productImage.product, //Definimos el dato que esperamos recibir de manera inversa
        {cascade: true, eager: true} //Definimos si habrá eliminación en cascada
    )
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        (user) => user.products,
        {eager: true}
    )
    user: User


    @BeforeInsert()
    checkSlugInsert(){
        //Si no viene el slug....
        if(!this.slug) this.slug = this.title;

        //Aplicamos las reglas de formato siempre al slug.
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate(){
        //El slug siempre va a venir en un producto previamente guardado si no se incluye en el body...

        //Aplicamos las reglas de formato siempre al slug.
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }
}
