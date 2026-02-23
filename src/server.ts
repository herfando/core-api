import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/auth";
import { swaggerDocs } from "./swagger";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // penting agar Swagger bisa fetch endpoint
app.use(express.json());

// Root test
app.get("/", (req: Request, res: Response) => res.send("Core API running"));

// Routes
app.use("/auth", authRoutes);

// Swagger
swaggerDocs(app); // jangan hardcode URL/port

// Start server
const PORT = Number(process.env.PORT) || 8080; // fallback 8080 untuk dev lokal
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at /api-docs`);
});