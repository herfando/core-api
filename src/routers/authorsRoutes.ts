// src/routers/authorsRoutes.ts
import { Router } from 'express';
import sql from '../models/db';
const router = Router();

router.get('/', async (req, res) => {
    try {
        const authors = await sql`SELECT * FROM authors`;
        res.json({ success: true, data: authors });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;