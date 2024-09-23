import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Lesson } from "./lesson";

@Entity({
    name: "COURSES"
})
export class Course {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' }) 
    seqNo!: number;

    @Column() 
    title!: string;

    @Column()
    url!: string;

    @Column()
    iconUrl!: string;

    @Column()
    longDescription!: string;

    @Column()
    category!: string;

    @OneToMany(() => Lesson, lesson => lesson.course)
    lessons!: Lesson[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    lastUpdatedAt!: Date;
}
