// src/controllers/bookController.ts
import { Request, Response } from 'express';
import sql from '../models/db';

// === 1. List Books (pagination + optional filter) ===
export const listBooks = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const books = await sql`
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN categories c ON b.category_id = c.id
      ORDER BY b.created_at DESC
      LIMIT ${Number(limit)} OFFSET ${offset}
    `;

        res.json({
            success: true,
            message: 'List books fetched',
            data: {
                books,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: books.length,
                    totalPages: Math.ceil(books.length / Number(limit)),
                },
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === 2. Create Book (Admin) ===
export const createBook = async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            isbn,
            publishedYear,
            coverImage,
            authorId,
            categoryId,
            totalCopies,
            availableCopies,
        } = req.body;

        const newBook = await sql`
      INSERT INTO books
        (title, description, isbn, published_year, cover_image, author_id, category_id, total_copies, available_copies)
      VALUES
        (${title}, ${description}, ${isbn}, ${publishedYear}, ${coverImage}, ${authorId}, ${categoryId}, ${totalCopies}, ${availableCopies})
      RETURNING *
    `;

        res.status(201).json({ success: true, message: 'Book created', data: newBook[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === 3. Book Detail ===
export const bookDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const book = await sql`
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN categories c ON b.category_id = c.id
      WHERE b.id = ${id}
    `;

        if (!book.length) return res.status(404).json({ success: false, message: 'Book not found' });

        res.json({ success: true, message: 'Book detail fetched', data: book[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === 4. Update Book ===
export const updateBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            isbn,
            publishedYear,
            coverImage,
            authorId,
            categoryId,
            totalCopies,
            availableCopies,
        } = req.body;

        const updated = await sql`
      UPDATE books
      SET
        title=${title},
        description=${description},
        isbn=${isbn},
        published_year=${publishedYear},
        cover_image=${coverImage},
        author_id=${authorId},
        category_id=${categoryId},
        total_copies=${totalCopies},
        available_copies=${availableCopies},
        updated_at=NOW()
      WHERE id=${id}
      RETURNING *
    `;

        if (!updated.length) return res.status(404).json({ success: false, message: 'Book not found' });

        res.json({ success: true, message: 'Book updated', data: updated[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === 5. Delete Book ===
export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await sql`
      DELETE FROM books
      WHERE id=${id}
      RETURNING *
    `;

        if (!deleted.length) return res.status(404).json({ success: false, message: 'Book not found or cannot delete' });

        res.json({ success: true, message: 'Book deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === 6. Recommend Books === (random simple example)
export const recommendBooks = async (req: Request, res: Response) => {
    try {
        const { limit = 10 } = req.query;

        const books = await sql`
      SELECT * FROM books
      ORDER BY RANDOM()
      LIMIT ${Number(limit)}
    `;

        res.json({ success: true, message: 'Recommended books', data: { mode: 'random', books } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};