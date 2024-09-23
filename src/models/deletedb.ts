import * as dotenv from 'dotenv'
dotenv.config()
import 'reflect-metadata'
import { AppDataSource } from '../data-source'
import { Course } from './course'
import { Lesson } from './lesson'
import { User } from './user'


async function DeleteFromDB() {
    await AppDataSource.initialize() 

    const CourseRepisotory = AppDataSource.getRepository(Course)
    const LessonRepisotory = AppDataSource.getRepository(Lesson)
    const UserRepisotory = AppDataSource.getRepository(User)

   await LessonRepisotory.delete({})
    await CourseRepisotory.delete({})
    await UserRepisotory.delete({})

}

DeleteFromDB()
.then(()=>{
    console.log(`Finished deleting all records from database, exiting!`);
    process.exit(0); 
})
.catch((err)=>{
    console.error(`Error deleting all records from database.`, err);
})