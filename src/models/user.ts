import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name:"USERS"
})
export class User{
   @PrimaryGeneratedColumn()
   id!:number
   
   @Column({unique:true}) 
   email!:string
   
   @Column() 
   password!:string
   
   @Column() 
   pictureUrl!:string
   
   @Column() 
   isAdmin!:boolean

   @CreateDateColumn()
   createdAt!: Date;

   @UpdateDateColumn()
   lastUpdatedAt!: Date;

}