import {NextFunction,Request,Response} from 'express'
import { logger } from '../logger'

export const DefaultErrorHandler =(err:object,req:Request,res:Response,next:NextFunction)=>{
   logger.error('Default error hander triggered; reason:',err)

   if(res.headersSent){
    logger.error('Response was already being written, delegating to built-in Express error handler.');
      return next(err)
   }
   
   res.status(500).json({
     status:"error",
     message:"Default Error handling triggered. Check Logs"
   })
}