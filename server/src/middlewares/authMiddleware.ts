import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const checkAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies['auth_token'];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    req.userId = parseInt(token);
    next();
};
