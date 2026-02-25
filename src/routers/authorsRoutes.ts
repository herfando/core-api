import { Router, Request, Response } from "express";
import sql from "../models/db";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Authors API
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
        res.status(500).json({ success: false, message: "Failed to fetch authors", data: { authors: [] } });
    }
});

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create new author
 *     tags: [Authors]
 */
router.post("/", async (req: Request, res: Response) => {
    const { name, bio } = req.body;
    try {
        const [author] = await sql`
      INSERT INTO authors (name, bio, created_at, updated_at)
      VALUES (${name}, ${bio}, NOW(), NOW())
      RETURNING *`;
        res.json({
            success: true,
            message: "Author created successfully",
            data: { authors: [{ id: author.id, name: author.name, bio: author.bio, createdAt: author.created_at, updatedAt: author.updated_at }] }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create author", data: { authors: [] } });
    }
});

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update author
 *     tags: [Authors]
 */
router.put("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    try {
        const [author] = await sql`
      UPDATE authors SET name = ${name}, bio = ${bio}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *`;
        if (!author) return res.status(404).json({ success: false, message: "Author not found", data: { authors: [] } });
        res.json({
            success: true,
            message: "Author updated successfully",
            data: { authors: [{ id: author.id, name: author.name, bio: author.bio, createdAt: author.created_at, updatedAt: author.updated_at }] }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update author", data: { authors: [] } });
    }
});

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete author (blocked if has books)
 *     tags: [Authors]
 */
router.delete("/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const books = await sql`SELECT id FROM books WHERE author_id = ${id} LIMIT 1`;
        if (books.length > 0) {
            return res.status(400).json({ success: false, message: "Author cannot be deleted because they have books", data: { authors: [] } });
        }
        await sql`DELETE FROM authors WHERE id = ${id}`;
        res.json({ success: true, message: "Author deleted successfully", data: { authors: [] } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete author", data: { authors: [] } });
    }
});

/**
 * @swagger
 * /authors/{id}/books:
 *   get:
 *     summary: Get books by author
 *     tags: [Authors]
 */
router.get("/:id/books", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const author = await sql`SELECT * FROM authors WHERE id = ${id}`;
        if (!author.length) return res.status(404).json({ success: false, message: "Author not found", data: { author: null, books: [] } });

        const books = await sql`SELECT * FROM books WHERE author_id = ${id}`;
        res.json({
            success: true,
            message: "Books by author fetched successfully",
            data: {
                author: {
                    id: author[0].id,
                    name: author[0].name,
                    bio: author[0].bio,
                    createdAt: author[0].created_at,
                    updatedAt: author[0].updated_at,
                },
                books: books.map(b => ({
                    id: b.id,
                    title: b.title,
                    description: b.description,
                    isbn: b.isbn,
                    publishedYear: b.published_year,
                    coverImage: b.cover_image,
                    price: b.price,
                    stock: b.stock,
                    isActive: b.is_active,
                    rating: b.rating,
                    reviewCount: b.review_count,
                    authorId: b.author_id,
                    categoryId: b.category_id,
                    createdAt: b.created_at,
                    updatedAt: b.updated_at,
                    availableCopies: b.available_copies,
                    borrowCount: b.borrow_count,
                    totalCopies: b.total_copies,
                }))
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch books", data: { author: null, books: [] } });
    }
});

export default router;