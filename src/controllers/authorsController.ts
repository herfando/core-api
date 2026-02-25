// src/controllers/authorsController.ts
import { Request, Response } from "express";
import sql from "../models/db";

export const listAuthors = async (req: Request, res: Response) => {
    try {
        const authors = await sql`SELECT * FROM authors ORDER BY name`;
        res.json({ success: true, data: authors });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};