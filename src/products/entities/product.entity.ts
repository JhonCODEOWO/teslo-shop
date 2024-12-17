//product.entity.ts

import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Representación de una tabla
@Entity()
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

    @BeforeInsert()
    checkSlugInsert(){
        //Si no viene el slug....
        if(!this.slug) this.slug = this.title;

        //Aplicamos las reglas de formato siempre al slug.
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
    }

    //@BeforeUpdate()
    // Tags
    //Images
}