import { Request,Response,NextFunction } from "express"
import * as jwt from 'jsonwebtoken'

export const protectedRoute = (req:Request | any,res:Response,next:NextFunction)=>{
    try {
        const token = req.cookies['course']

        if(!token){
            return res.status(401).json({success:false,message:"Unauthorized - No token provided"})
        }
    
        const secretKey = process.env.SECRET_KEY  || ''
      
        const user = jwt.verify(token,secretKey)
        if(!user){
            return res.status(401).json({success:false,message:"Unauthorized - Invalid token"})
        }

        console.log(req.user)
        next()

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}