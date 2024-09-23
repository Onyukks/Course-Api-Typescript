import { Router } from "express";
import { CreateCourse, DeleteCourse, GetAllCourses, GetCourseByUrl, GetLessonsForCourse, UpdateCourse } from "../controllers/courses.controller";


const router = Router()

router.get('/',GetAllCourses)
router.get('/:courseUrl',GetCourseByUrl)
router.get('/:courseId/lessons',GetLessonsForCourse)
router.patch('/:courseId',UpdateCourse)
router.post('/',CreateCourse)
router.delete('/:courseId',DeleteCourse)

export default router