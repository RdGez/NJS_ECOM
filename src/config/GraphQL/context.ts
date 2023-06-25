import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../../shared/interfaces/jwt.interface';

export interface IContext {
  id: string;
  [key: string]: any;
}

export const context = async ({ req }: IContext) => {
  const token = req.headers.token || '';
  if (!token) return { user: null };

  try { 
    const { id } = jwt.verify(token, `${process.env.JWT_SECRET}`) as IJwtPayload;
    return {
      ...context,
      id,
    };
  } catch (error) {
    console.error(error);
    return { user: null };
  }
};
