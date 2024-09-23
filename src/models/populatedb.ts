import * as dotenv from 'dotenv'
dotenv.config()
import 'reflect-metadata'
import { AppDataSource } from '../data-source'
import { COURSES, USERS } from './data';
import { DeepPartial } from 'typeorm'
import { Course } from './course'
import { Lesson } from './lesson';
import { User } from './user'
import * as bcrypt from 'bcryptjs';

async function PopulateDatabase() {
          await AppDataSource.initialize()

        const courses = Object.values(COURSES) as DeepPartial<Course>[]
        
       const CourseRepisotory = AppDataSource.getRepository(Course)
       const LessonRepisotory = AppDataSource.getRepository(Lesson)
     
        for(let courseData of courses){
           console.log(`Adding ${courseData.title}`)

           const course = CourseRepisotory.create(courseData)

           await CourseRepisotory.save(course)

            for (let lessonData of courseData.lessons || []){
                console.log(`Adding ${lessonData.title}`)

                const lesson = LessonRepisotory.create(lessonData)

                lesson.course = course

                await LessonRepisotory.save(lesson)
            }
        }

        const totalCourses  = await CourseRepisotory
         .createQueryBuilder()
         .getCount()

         const totalLessons  = await LessonRepisotory
         .createQueryBuilder()
         .getCount()

         console.log(`Data inserted. Total number of courses:${totalCourses}. Total number of lessons:${totalLessons}`)

         const UserRepository = AppDataSource.getRepository(User)
         const users =  Object.values(USERS) as any[]

         for(let userData of users){
            console.log('Inserting user')
        const {email,plainTextPassword,pictureUrl, isAdmin} = userData
        
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(plainTextPassword,salt)

        const newUser = UserRepository.create({
            email,
            password:hash,
            pictureUrl,
            isAdmin
        })

        await UserRepository.save(newUser)

         }
}
PopulateDatabase()
.then(()=>{
    console.log(`Finished populating database, exiting!`);
    process.exit(0); 
})
.catch((err)=>{
    console.error(`Error populating database.`, err);
})