import { Request, Response } from "express";
import sql from "../models/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * =========================
 * REGISTER
 * =========================
 */
export const register = async (req: Request, res: Response) => {
    const { name, email, password, phoneNumber } = req.body;

    try {

        // cek email
        const users = await sql`SELECT * FROM users WHERE email=${email}`;
        if (users.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email sudah terdaftar"
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const createAt = new Date();

        // ✅ INSERT HANYA KOLOM YANG ADA DI DB
        const newUser = await sql`
            INSERT INTO users (email, password, create_at)
            VALUES (${email}, ${hashedPassword}, ${createAt})
            RETURNING id, email, create_at
        `;

        const user = newUser[0];

        // ✅ RESPONSE SESUAI FRONTEND
        res.status(201).json({
            success: true,
            message: "Register berhasil",
            data: {
                id: String(user.id),
                name: name || "",
                email: user.email,
                phoneNumber: phoneNumber || "",
                role: "USER"
            }
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


/**
 * =========================
 * LOGIN
 * =========================
 */
export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        const users = await sql`SELECT * FROM users WHERE email=${email}`;

        if (users.length === 0) {
            return res.status(400).json({
                message: "Email belum terdaftar"
            });
        }

        const user = users[0];

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({
                message: "Password salah"
            });
        }

        // JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // RESPONSE SESUAI FRONTEND
        res.status(200).json({
            token,
            user: {
                name: "",
                email: user.email,
                phoneNumber: ""
            }
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
};