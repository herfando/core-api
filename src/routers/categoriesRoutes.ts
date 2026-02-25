// src/routers/categoriesRoutes.ts
import { Router } from 'express';
import sql from '../models/db';
const router = Router();

router.get('/', async (req, res) => {
    try {
        const categories = await sql`SELECT * FROM categories`;
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;