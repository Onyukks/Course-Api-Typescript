import { NextFunction, Request,Response } from "express";
import { AppDataSource } from "../data-source";
import { Course } from "../models/course";
import { logger } from "../logger";
import { Lesson } from "../models/lesson";
import { isInteger } from "../utils";

//Get All Courses
export const GetAllCourses = async(req:Request,res:Response,next:NextFunction)=>{
    try {
     
      logger.debug('Called GetAllCourses()')
     
      const courses = await AppDataSource.getRepository(Course)
      .createQueryBuilder("courses")
      .leftJoinAndSelect("courses.lessons","LESSONS")
      .orderBy("courses.seqNo")
      .getMany()

      res.status(200).json(courses)
    } catch (error) {
        logger.error('Error fetching courses',error)
        next(error)
    }
}

//Get Course By Url
export const GetCourseByUrl = async(req:Request,res:Response,next:NextFunction)=>{
  try {
   
    logger.debug('Called GetCoursebyUrl()')

    const {courseUrl} = req.params

    if(!courseUrl){
       throw "Could not extract url from the request"
    }
   
    const course = await AppDataSource.getRepository(Course)
    .findOneBy({
      url:courseUrl
    })

    if(!course){
      const message = `Could not find course with url ${courseUrl}`
      logger.error(message)
      return res.status(404).json(message)
    }

    const totalLessons = await AppDataSource.getRepository(Lesson)
    .createQueryBuilder("lessons")
    .where("lessons.courseId =:courseId",{
      courseId:course.id
    })
    .getCount()

    res.status(200).json({course,totalLessons})
  } catch (error) {
      logger.error('Error fetching course',error)
      next(error)
  }
}

//Get Lessons for course
export const GetLessonsForCourse = async(req:Request,res:Response,next:NextFunction)=>{
  try {
   
    logger.debug('Called GetLessonsforCourse()')

    const {courseId} = req.params
    const query=req.query as any,
          pageNumber=query?.pageNumber ?? "0",
          pageSize=query?.pageSize ?? "3"
    
          if (!isInteger(courseId)) {
            throw `Invalid course id ${courseId}`;
        }

        if (!isInteger(pageNumber)) {
            throw `Invalid pageNumber ${pageNumber}`;
        }

        if (!isInteger(pageSize)) {
            throw `Invalid pageSize ${pageSize}`;
        }

        const lessons = await AppDataSource.getRepository(Lesson)
        .createQueryBuilder("lessons")
        .where("lessons.courseId = :courseId",{courseId})
        .orderBy("lessons.seqNo")
        .skip(pageNumber*pageSize)
        .take(pageSize)
        .getMany()

        res.status(200).json(lessons)
   
  } catch (error) {
      logger.error('Error fetching lessons',error)
      next(error)
  }
}

//Update Course
export const UpdateCourse = async(req:Request,res:Response,next:NextFunction)=>{
  try {

    logger.debug('Called UpdateCourse()')

    const {courseId} = req.params
    const updates = req.body

    await AppDataSource
          .createQueryBuilder()
          .update(Course)
          .set(updates)
          .where("id = :courseId",{courseId})
          .execute()
    res.status(200).json({message:"Course has been updated successfully"})
  } catch (error) {
    logger.error('Error Updating Course',error)
    next(error)
  }
}

//Create Course
export const CreateCourse = async(req:Request,res:Response,next:NextFunction)=>{
  try {

    logger.debug('Called CreateCourse()')

    const {lessons,...courseData} = req.body
    if(!courseData) {
      throw 'No data available to add to the database'
    }

  const course =  await AppDataSource.manager.transaction(
      "REPEATABLE READ",
      async(transactionEntityManager)=>{

        const courseRepository = transactionEntityManager.getRepository(Course)
        const lessonRepository = transactionEntityManager.getRepository(Lesson)
        
        const result = await courseRepository
          .createQueryBuilder('courses')
          .select('MAX(courses.seqNo)','max')
          .getRawOne()

       const newcourse =  courseRepository
               .create({
                  ...courseData,
                  seqNo:(result?.max ?? 0) +1
               }) 
        
      const savedCourse:any = await courseRepository.save(newcourse)

         if(lessons && Array.isArray(lessons) && lessons.length>0){
               for(let i=0;i<lessons.length;i++){
                   const lessonData = lessons[i]
                   const newLesson = lessonRepository.create({
                      ...lessonData,
                      seqNo:i+1,
                      course:savedCourse
                   })
                  await lessonRepository.save(newLesson)
               }
               
         }

        const CreatedCourse = await courseRepository.findOne({
           where:{
            id:savedCourse.id
           },
           relations:['lessons']
        })

         return CreatedCourse
      }
    )

    res.status(200).json(course)
    
  } catch (error) {
    logger.error('Error Creating Course',error)
    next(error)
  }
}

//Delete Course
export const DeleteCourse = async(req:Request,res:Response,next:NextFunction)=>{
  try {

    logger.debug('Called DeleteCourse()')

    const courseId:number = parseInt(req.params.courseId, 10);

    if (isNaN(courseId)) {
      throw new Error('Not a valid course ID');
    }

  const course =  await AppDataSource.transaction(
  
      async(transactionEntityManager)=>{
           
         await transactionEntityManager
               .createQueryBuilder()
               .delete()
               .from(Lesson)
               .where("courseId = :courseId",{courseId})
               .execute()

         await transactionEntityManager
               .createQueryBuilder()
               .delete()
               .from(Course)
               .where("id = :courseId",{courseId})
               .execute()
      }
    )
    const remainingCourses = await AppDataSource
    .createQueryBuilder()
    .select('course')
    .from(Course,'course')
    .orderBy('course.seqNo')
    .getMany()

    for (let i=0;i<remainingCourses.length;i++){
      await AppDataSource
            .createQueryBuilder()
            .update(Course)
            .set({seqNo:i+1})
            .where("id = :id ",{id:remainingCourses[i].id})
            .execute()
    }
    res.status(200).json({message:"Deleted Successfully"})

    
  } catch (error) {
    logger.error('Error Deleting Course',error)
    next(error)
  }
}
