import { NextFunction, Request,Response } from "express"
import * as bcrypt from 'bcryptjs';
import * as validator from 'validator';
import * as jwt from 'jsonwebtoken'
import { logger } from "../logger";
import { AppDataSource } from "../data-source";
import { User } from "../models/user";
import { CreateToken } from "../utils";

//Create User
export const CreateUser = async(req:Request,res:Response,next:NextFunction)=>{
    try {
      logger.debug('Called CreateUser()')

      const {email,password,pictureUrl, isAdmin} = req.body
    
      if(!email || !password || !pictureUrl || isAdmin===undefined){
         return res.status(400).json({message:"All fields have to be provided"})
      }
      
      const isValidEmail = validator.isEmail(email)
      if (!isValidEmail) return res.status(400).json({message:"Please provide a valid email"})

      const isStrongPassword = validator.isStrongPassword(password)
      if (!isStrongPassword) return res.status(400).json({message:"Password should include at least 8 characters, with a mix of uppercase, lowercase, numbers, and symbols."})

      const UserRepository = AppDataSource.getRepository(User)

      const user = await UserRepository.findOneBy({
        email
      })
      if(user) return res.status(409).json({message:'User with this email already exists'})

     const salt = await bcrypt.genSalt(10)
     const hash = await bcrypt.hash(password,salt)

    const newUser = UserRepository.create({
        email,
        password:hash,
        pictureUrl,
        isAdmin
     })
     await UserRepository.save(newUser)

    res.status(201).json({message:'User successfully created',user:{email,pictureUrl,isAdmin}})    
    } catch (error) {
        logger.error('Error fetching courses',error)
        next(error)
    }
}

//Login User
export const LoginUser = async(req:Request,res:Response,next:NextFunction)=>{
  try {
    logger.debug('Called LoginUser()')

    const {email,password } = req.body
  
    if(!email || !password ){
       return res.status(400).json({message:"All fields have to be provided"})
    }
    
    const UserRepository = AppDataSource.getRepository(User)

    const user = await UserRepository.findOneBy({
      email
    })
    if(!user) return res.status(404).json({message:'Email is incorrect'})

    const isValidPassword = await bcrypt.compare(password,user.password)
    if(!isValidPassword) return res.status(404).json({message:'Password is incorrect'})
    
   const {password:userpassword,lastUpdatedAt,...other} = user

   const authJwt = {
      id:user.id,
      email:user.email,
      isAdmin:user.isAdmin
   }

   CreateToken(authJwt,res)

  res.status(200).json({message:'User login successfull',user:other})    
  } catch (error) {
      logger.error('Error fetching courses',error)
      next(error)
  }
}

//Logout User
export const Logout = (req:Request,res:Response,next:NextFunction)=>{
  try {
    res.clearCookie("course")
    res.status(200).json({success:'true',message:'Logged out successfully'})
  } catch (error) {
    logger.error('Error fetching courses',error)
    next(error)
  }
}