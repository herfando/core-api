// src/middleware/verifyAdmin.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import sql from '../models/db';

interface JwtPayload {
    userId: number;
    role: string;
}

// Middleware verify admin
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'secret';

        const decoded = jwt.verify(token, secret) as JwtPayload;

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Cek role dari DB
        const userRes = await sql<{ role: string }[]>`
      SELECT role
      FROM users
      WHERE id = ${decoded.userId}
    `;

        if (!userRes || userRes.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userRes[0].role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        // Lanjut ke controller
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};