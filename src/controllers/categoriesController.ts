// src/controllers/categoriesController.ts
import { Request, Response } from "express";
import sql from "../models/db";

export const listCategories = async (req: Request, res: Response) => {
    try {
        const categories = await sql`SELECT * FROM categories ORDER BY name`;
        res.json({ success: true, data: categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};