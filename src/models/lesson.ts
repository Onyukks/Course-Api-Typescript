import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Course } from "./course";

@Entity({
    name: "LESSONS"
})
export class Lesson {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' }) 
    seqNo!: number;

    @Column() 
    title!: string;

    @Column()
    duration!: string;

    @ManyToOne(() => Course, course => course.lessons)
    @JoinColumn({ name: "courseId" })
    course!: Course;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    lastUpdatedAt!: Date;
}
