//product.entity.ts

import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";

//Representación de una tabla
@Entity({
    name: 'products'
})
export class Product {
    
    @PrimaryGeneratedColumn('uuid') //Configurar clave primaria como un uuid
    id: string;

    @Column('text', {
        unique: true
    }) //Se especifica que esta es una columna el tipo de dato y las opciones
    title: string;

    @Column('float', {
        default: 0,
        nullable: false
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    // Tags definidos como un arreglo de strings
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
