// src/controllers/bookController.ts
import { Request, Response } from 'express';
import sql from '../models/db';

// === Helper: Map snake_case DB ke camelCase frontend ===
const mapBook = (b: any) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    isbn: b.isbn,
    publishedYear: b.published_year,
    coverImage: b.cover_image,
    price: b.price,
    rating: b.ratings ? Number(b.ratings) : null,
    reviewCount: b.review_count,
    totalCopies: b.total_copies,
    borrowCount: b.borrow_count,
    authorId: b.author_id,
    authorName: b.author_name,
    categoryId: b.category_id,
    categoryName: b.category_name,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
});

// === 1. List Books (pagination + optional filter) ===
export const listBooks = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const booksData = await sql`
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN categories c ON b.category_id = c.id
      ORDER BY b.created_at DESC
      LIMIT ${Number(limit)} OFFSET ${offset}
    `;

        const books = booksData.map(mapBook);

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
            price,
            rating,
            reviewCount,
        } = req.body;

        const newBookData = await sql`
      INSERT INTO books
        (title, description, isbn, published_year, cover_image, author_id, category_id, total_copies, available_copies, price, rating, review_count)
      VALUES
        (${title}, ${description}, ${isbn}, ${publishedYear}, ${coverImage}, ${authorId}, ${categoryId}, ${totalCopies}, ${availableCopies}, ${price}, ${rating}, ${reviewCount})
      RETURNING *
    `;

        const newBook = mapBook(newBookData[0]);

        res.status(201).json({ success: true, message: 'Book created', data: newBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === 3. Book Detail ===
export const bookDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const bookData = await sql`
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN categories c ON b.category_id = c.id
      WHERE b.id = ${id}
    `;

        if (!bookData.length)
            return res.status(404).json({ success: false, message: 'Book not found' });

        const book = mapBook(bookData[0]);
        res.json({ success: true, message: 'Book detail fetched', data: book });
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
            price,
            rating,
            reviewCount,
        } = req.body;

        const updatedData = await sql`
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
        price=${price},
        rating=${rating},
        review_count=${reviewCount},
        updated_at=NOW()
      WHERE id=${id}
      RETURNING *
    `;

        if (!updatedData.length)
            return res.status(404).json({ success: false, message: 'Book not found' });

        const updatedBook = mapBook(updatedData[0]);
        res.json({ success: true, message: 'Book updated', data: updatedBook });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// === 5. Delete Book ===
export const deleteBook = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedData = await sql`
      DELETE FROM books
      WHERE id=${id}
      RETURNING *
    `;

        if (!deletedData.length)
            return res.status(404).json({ success: false, message: 'Book not found or cannot delete' });

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

        const booksData = await sql`
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN categories c ON b.category_id = c.id
      ORDER BY RANDOM()
      LIMIT ${Number(limit)}
    `;

        const books = booksData.map(mapBook);

        res.json({ success: true, message: 'Recommended books', data: { mode: 'random', books } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};