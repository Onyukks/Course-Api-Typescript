import * as jwt from 'jsonwebtoken'
import { Response } from 'express';

export function isInteger(input:string) {
    return input?.match(/^\d+$/) ?? false;
}
export const CreateToken = (userid:object,res:Response)=>{
     const secretKey = process.env.SECRET_KEY  || ''
    const node_env = process.env.NODE_ENV || ''
    const token = jwt.sign(userid,secretKey,{expiresIn:'3d'})

    res.cookie("course",token,{
        httpOnly: true,
        sameSite : "strict",
        secure: node_env !== 'development'
    })

    return token
}
