import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/auth";
import { swaggerDocs } from "./swagger";

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== TEST ROOT =====
app.get("/", (req: Request, res: Response) => {
    res.send("Core API is running with TypeScript!");
});

// ===== ROUTES =====
app.use("/auth", authRoutes);

// ===== SWAGGER DOCS =====
const PORT = Number(process.env.PORT) || 5000;
swaggerDocs(app, PORT);

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});