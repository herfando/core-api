import { Router, Request, Response } from "express";
import sql from "../models/db";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories API
 */

// LIST categories
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
        res.status(500).json({ success: false, message: "Failed to fetch categories", data: { categories: [] } });
    }
});

// CREATE category
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
            data: { categories: [{ id: category.id, name: category.name, createdAt: category.created_at, updatedAt: category.updated_at }] }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create category", data: { categories: [] } });
    }
});

// UPDATE category
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
            data: { categories: [{ id: category.id, name: category.name, createdAt: category.created_at, updatedAt: category.updated_at }] }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update category", data: { categories: [] } });
    }
});

// DELETE category (blocked if has books)
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