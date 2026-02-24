import { Request, Response } from "express";
import sql from "../models/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

/**
 * =========================
 * REGISTER
 * =========================
 * FRONTEND EXPECT:
 * {
 *   success:boolean,
 *   message:string,
 *   data:{ id,name,email,phoneNumber,role }
 * }
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

        const role = "user";

        // simpan user
        const newUser = await sql`
            INSERT INTO users (name, email, password, phone_number, role)
            VALUES (${name}, ${email}, ${hashedPassword}, ${phoneNumber}, ${role})
            RETURNING id, name, email, phone_number, role
        `;

        const user = newUser[0];

        // RESPONSE HARUS SESUAI FRONTEND
        res.status(201).json({
            success: true,
            message: "Register berhasil",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
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
 * FRONTEND EXPECT:
 * {
 *   token:string,
 *   user:{name,email,phoneNumber}
 * }
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

        // generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // RESPONSE HARUS SESUAI FRONTEND
        res.status(200).json({
            token,
            user: {
                name: user.name,
                email: user.email,
                phoneNumber: user.phone_number
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error"
        });
    }
};