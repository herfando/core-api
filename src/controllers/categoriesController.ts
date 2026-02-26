// src/controllers/categoriesController.ts
import { Request, Response } from "express";
import sql from "../models/db";

// === Helper: Map DB book row ke format frontend ===
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

// === GET ALL CATEGORIES + BOOKS PER CATEGORY ===
export const listCategories = async (req: Request, res: Response) => {
    try {
        // 1. Ambil semua kategori
        const categoriesData = await sql`SELECT * FROM categories ORDER BY id ASC`;

        // 2. Ambil semua buku sekaligus supaya bisa di-map ke kategori
        const booksData = await sql`
      SELECT b.*, a.name AS author_name, c.name AS category_name
      FROM books b
      JOIN authors a ON b.author_id = a.id
      JOIN categories c ON b.category_id = c.id
    `;

        // Map buku ke frontend format
        const books = booksData.map(mapBook);

        // 3. Gabungkan buku ke kategori masing-masing
        const categories = categoriesData.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            createdAt: cat.created_at,
            updatedAt: cat.updated_at,
            books: books.filter((b) => b.categoryId === cat.id),
        }));

        res.json({
            success: true,
            message: "Categories with books fetched successfully",
            data: { categories },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            data: { categories: [] },
        });
    }
};

// === CREATE CATEGORY ===
export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const [category] = await sql`
      INSERT INTO categories (name, created_at, updated_at)
      VALUES (${name}, NOW(), NOW())
      RETURNING *
    `;
        res.json({
            success: true,
            message: "Category created successfully",
            data: {
                categories: [
                    {
                        id: category.id,
                        name: category.name,
                        createdAt: category.created_at,
                        updatedAt: category.updated_at,
                        books: [],
                    },
                ],
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to create category",
            data: { categories: [] },
        });
    }
};

// === UPDATE CATEGORY ===
export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const [category] = await sql`
      UPDATE categories SET name = ${name}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
        if (!category)
            return res.status(404).json({
                success: false,
                message: "Category not found",
                data: { categories: [] },
            });

        res.json({
            success: true,
            message: "Category updated successfully",
            data: {
                categories: [
                    {
                        id: category.id,
                        name: category.name,
                        createdAt: category.created_at,
                        updatedAt: category.updated_at,
                        books: [],
                    },
                ],
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to update category",
            data: { categories: [] },
        });
    }
};

// === DELETE CATEGORY ===
export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const books = await sql`SELECT id FROM books WHERE category_id = ${id} LIMIT 1`;
        if (books.length > 0)
            return res.status(400).json({
                success: false,
                message: "Category cannot be deleted because it has books",
                data: { categories: [] },
            });

        await sql`DELETE FROM categories WHERE id = ${id}`;
        res.json({
            success: true,
            message: "Category deleted successfully",
            data: { categories: [] },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            data: { categories: [] },
        });
    }
};