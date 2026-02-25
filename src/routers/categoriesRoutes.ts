import { Router, Request, Response } from "express";
import sql from "../models/db";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API endpoints for categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const categories = await sql`SELECT * FROM categories ORDER BY id ASC`;
        res.json({
            success: true,
            message: "Categories fetched successfully",
            data: {
                categories: categories.map(c => ({
                    id: c.id,
                    name: c.name,
                    createdAt: c.created_at,
                    updatedAt: c.updated_at,
                }))
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            data: { categories: [] }
        });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export default router;