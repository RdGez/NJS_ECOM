import { NextFunction, Response } from "express";

export const hasRole = (role: string) => {
    return (req: any, res: Response, next: NextFunction) => {
        const userRole = req.role;
    
        if (userRole !== role) {
        return res.status(401).json({
            message: "Unauthorized.",
        });
        }
        next();
    };
}
