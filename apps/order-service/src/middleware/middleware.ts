import {Request, Response, NextFunction } from 'express'
import { getAuth } from '@clerk/express'
import type { CustomJwtSessionClaims } from "@repo/types";

declare global{
    namespace Express{
        interface Request{
            userId? : string;
        }
        
    }
}

export const shouldBeUser = (req: Request, res: Response, next : NextFunction) =>{

    const {userId} = getAuth(req);
    if(!userId)
    {
        return res.status(401).json({message : "You are not logged in"})
    }
    req.userId = userId;
    return next()

}

export const shouldBeAdmin = (req: Request, res: Response, next : NextFunction) =>{
    const auth = getAuth(req);
    const {userId} = auth;
    if(!userId)
    {
        return res.status(401).json({message : "You are not logged in"})
    }
    const claims = auth.sessionClaims as CustomJwtSessionClaims
    if(claims.metadata?.role !== 'admin')
    {
     return res.status(403).json({message : "Unauthorized!"})   
    }
    req.userId = userId;
    return next()

}