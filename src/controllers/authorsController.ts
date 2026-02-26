// src/controllers/authorsController.ts
import { Request, Response } from "express";
import sql from "../models/db";

export const listAuthors = async (req: Request, res: Response) => {
    try {
        // Ambil semua authors + jumlah buku per author
        const authors = await sql`
      SELECT 
        a.id, 
        a.name, 
        a.bio, 
        a.created_at, 
        a.updated_at,
        COUNT(b.id) AS count_by_author
      FROM authors a
      LEFT JOIN books b ON b.author_id = a.id
      GROUP BY a.id
      ORDER BY count_by_author DESC
    `;

        // Pastikan count_by_author dikonversi ke number (Postgres kadang string)
        const authorsMapped = authors.map((a: any) => ({
            id: a.id,
            name: a.name,
            bio: a.bio,
            created_at: a.created_at,
            updated_at: a.updated_at,
            countByAuthor: Number(a.count_by_author),
        }));

        res.json({
            success: true,
            message: "Authors fetched successfully",
            data: { authors: authorsMapped },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};