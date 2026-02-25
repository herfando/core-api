import { Router, Request, Response } from "express";
import sql from "../models/db";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories API
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
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
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string
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
                })),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch categories", data: { categories: [] } });
    }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category created successfully
 */
router.post("/", async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const [category] = await sql`
      INSERT INTO categories (name, created_at, updated_at)
      VALUES (${name}, NOW(), NOW())
      RETURNING *`;
        res.json({
            success: true,
            message: "Category created successfully",
            data: {
                categories: [{ id: category.id, name: category.name, createdAt: category.created_at, updatedAt: category.updated_at }],
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create category", data: { categories: [] } });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const [category] = await sql`
      UPDATE categories SET name = ${name}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *`;
        if (!category) return res.status(404).json({ success: false, message: "Category not found", data: { categories: [] } });
        res.json({
            success: true,
            message: "Category updated successfully",
            data: { categories: [{ id: category.id, name: category.name, createdAt: category.created_at, updatedAt: category.updated_at }] },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update category", data: { categories: [] } });
    }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const books = await sql`SELECT id FROM books WHERE category_id = ${id} LIMIT 1`;
        if (books.length > 0) return res.status(400).json({ success: false, message: "Category cannot be deleted because it has books", data: { categories: [] } });
        await sql`DELETE FROM categories WHERE id = ${id}`;
        res.json({ success: true, message: "Category deleted successfully", data: { categories: [] } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete category", data: { categories: [] } });
    }
});

export default router;