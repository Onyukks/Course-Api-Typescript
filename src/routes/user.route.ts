import { Router } from "express";
import { CreateUser, LoginUser, Logout } from "../controllers/user";

const router = Router()

router.post('/',CreateUser)
router.post('/login',LoginUser)
router.post('/logout',Logout)

export default router