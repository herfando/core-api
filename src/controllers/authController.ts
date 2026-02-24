import { Request, Response } from "express";
import sql from "../models/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * REGISTER
 */
export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // cek email
        const users = await sql`SELECT * FROM users WHERE email=${email}`;
        if (users.length > 0)
            return res.status(400).json({ message: "Email sudah terdaftar" });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // waktu sekarang untuk create_at
        const createAt = new Date();

        // simpan user
        const newUser = await sql`
            INSERT INTO users (email, password, create_at)
            VALUES (${email}, ${hashedPassword}, ${createAt})
            RETURNING id, email, create_at
        `;

        // generate token JWT
        const token = jwt.sign(
            { id: newUser[0].id, email: newUser[0].email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // kembalikan user + token
        res.status(201).json({
            user: newUser[0],
            token,
            message: "User berhasil dibuat dan token dikirim"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * LOGIN
 */
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const users = await sql`SELECT * FROM users WHERE email=${email}`;
        if (users.length === 0)
            return res.status(400).json({ message: "Email belum terdaftar" });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Password salah" });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            user: { id: user.id, email: user.email, create_at: user.create_at },
            token,
            message: "Login berhasil"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};