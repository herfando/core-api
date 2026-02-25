import { Router, Request, Response } from "express";
import sql from "../models/db"; // postgres client
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: API endpoints for authors
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Authors list
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
 *                     authors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Author'
 */
router.get("/", async (req: Request, res: Response) => {
    try {
        const authors = await sql`SELECT * FROM authors ORDER BY id ASC`;
        res.json({
            success: true,
            message: "Authors fetched successfully",
            data: {
                authors: authors.map(a => ({
                    id: a.id,
                    name: a.name,
                    bio: a.bio,
                    createdAt: a.created_at,
                    updatedAt: a.updated_at,
                }))
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch authors",
            data: { authors: [] }
        });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export default router;