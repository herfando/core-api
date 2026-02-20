import { Request, Response } from "express";
import { pool } from "../models/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * REGISTER
 */
export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // cek email udah ada belum
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // simpan user
        const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at",
            [email, hashedPassword]
        );

        // kirim response user info + message
        res.status(201).json({ user: newUser.rows[0], message: "User berhasil dibuat" });
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
        // cek email ada di DB
        const userQuery = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: "Email belum terdaftar" });
        }

        const user = userQuery.rows[0];

        // compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Password salah" });
        }

        // generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email }, // payload
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // kirim response lengkap: user info + token + message
        res.status(200).json({
            user: { id: user.id, email: user.email },
            token,
            message: "Login berhasil"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};