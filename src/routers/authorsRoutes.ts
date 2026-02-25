// src/routes/authorsRoutes.ts
import { Router, Request, Response } from "express";
import sql from "../models/db"; // pastikan ini koneksi postgres-mu
import { Author, AuthorCreateInput, AuthorsListResponse, AuthorWithBooksResponse, BookByAuthor } from "../types/authorsType";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Author management
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: List of authors
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
        const authors: Author[] = await sql<Author[]>`SELECT * FROM authors ORDER BY id`;
        const response: AuthorsListResponse = {
            success: true,
            message: "Authors fetched successfully",
            data: { authors },
        };
        res.json(response);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching authors" });
    }
});

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Create a new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorCreateInput'
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorsListResponse'
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const { name, bio }: AuthorCreateInput = req.body;
        const [author]: Author[] = await sql<Author[]>`
      INSERT INTO authors (name, bio, created_at, updated_at)
      VALUES (${name}, ${bio}, NOW(), NOW())
      RETURNING *`;
        const response: AuthorsListResponse = {
            success: true,
            message: "Author created successfully",
            data: { authors: [author] },
        };
        res.status(201).json(response);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error creating author" });
    }
});

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorCreateInput'
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorsListResponse'
 */
router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, bio }: AuthorCreateInput = req.body;
        const [author]: Author[] = await sql<Author[]>`
      UPDATE authors
      SET name = ${name}, bio = ${bio}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *`;
        if (!author) return res.status(404).json({ success: false, message: "Author not found" });
        const response: AuthorsListResponse = {
            success: true,
            message: "Author updated successfully",
            data: { authors: [author] },
        };
        res.json(response);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error updating author" });
    }
});

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author (blocked if has books)
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthorsListResponse'
 */
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const books = await sql<BookByAuthor[]>`SELECT * FROM books WHERE author_id = ${id}`;
        if (books.length > 0)
            return res.status(400).json({ success: false, message: "Cannot delete author with books" });
        await sql`DELETE FROM authors WHERE id = ${id}`;
        res.json({ success: true, message: "Author deleted successfully", data: { authors: [] } });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error deleting author" });
    }
});

/**
 * @swagger
 * /authors/{id}/books:
 *   get:
 *     summary: Get all books by an author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Books by author
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
 *                     author:
 *                       $ref: '#/components/schemas/Author'
 *                     books:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BookByAuthor'
 */
router.get("/:id/books", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [author] = await sql<Author[]>`SELECT * FROM authors WHERE id = ${id}`;
        if (!author) return res.status(404).json({ success: false, message: "Author not found" });

        const books = await sql<BookByAuthor[]>`SELECT * FROM books WHERE author_id = ${id}`;
        const response: AuthorWithBooksResponse = {
            success: true,
            message: "Books fetched successfully",
            data: { author, books },
        };
        res.json(response);
    } catch (err) {
        res.status(500).json({ success: false, message: "Error fetching books" });
    }
});

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *     AuthorCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - bio
 *       properties:
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *     BookByAuthor:
 *       type: object
 *       properties:
 *         id: { type: number }
 *         title: { type: string }
 *         description: { type: string }
 *         isbn: { type: string }
 *         publishedYear: { type: number }
 *         coverImage: { type: string, nullable: true }
 *         price: { type: number }
 *         stock: { type: number }
 *         isActive: { type: boolean }
 *         rating: { type: number }
 *         reviewCount: { type: number }
 *         authorId: { type: number }
 *         categoryId: { type: number }
 *         createdAt: { type: string }
 *         updatedAt: { type: string }
 *         availableCopies: { type: number }
 *         borrowCount: { type: number }
 *         totalCopies: { type: number }
 *     AuthorsListResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean }
 *         message: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             authors:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *     AuthorWithBooksResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean }
 *         message: { type: string }
 *         data:
 *           type: object
 *           properties:
 *             author:
 *               $ref: '#/components/schemas/Author'
 *             books:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookByAuthor'
 */