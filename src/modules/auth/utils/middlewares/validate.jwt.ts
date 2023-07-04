import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { IJwtPayload } from "../../../../shared/interfaces/jwt.interface";

export default (req: any, res: Response, next: NextFunction) => {
  const token = req.header("token");

  if (!token) {
    return res.status(401).json({
      message: 'Token has not provided.',
    })
  }

  try {
    const { id, role } = jwt.verify(token, `${process.env.JWT_SECRET}`) as IJwtPayload
    req.id = id
    req.role = role
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: 'User is not authenticated.',
    })
  }

  return next()
};
