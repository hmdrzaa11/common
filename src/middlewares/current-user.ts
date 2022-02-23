import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      currentUser?: JwtPayload;
    }
  }
}

interface JwtPayload {
  id: string;
  email: string;
  iat: number;
}

export let currentUser = (req: Request, res: Response, next: NextFunction) => {
  //check for jwt in the session
  if (!req.session?.jwt) return next(); //let it go we can not extract any user in here

  try {
    //decode the jwt
    let user = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as JwtPayload;
    req.currentUser = user;
  } catch (err) {}

  next();
};
