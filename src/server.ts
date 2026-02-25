// src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/authRoutes";
import { swaggerDocs } from "./swagger";
import bookRoutes from "./routers/bookRoutes";
import categoriesRoutes from './routers/categoriesRoutes';
import authorsRoutes from './routers/authorsRoutes';

dotenv.config();

const app = express();

// Middleware CORS
app.use(cors({
    origin: [
        "https://core-api-production-7554.up.railway.app", // Swagger live
        "http://localhost:8080",
        "http://localhost:5173",   // React dev
        "http://localhost:3000",   // Next.js dev                              // Dev lokal
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// JSON middleware
app.use(express.json());

// Root test
app.get("/", (req: Request, res: Response) => res.send("Core API running"));

// Routes
app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/categories", categoriesRoutes);
app.use("/authors", authorsRoutes);


// Swagger docs
swaggerDocs(app);

// Start server
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📄 Swagger local (dev): http://localhost:${PORT}/api-docs`);
    console.log(`🌐 Swagger Railway live: https://core-api-production-7554.up.railway.app/api-docs`);
    console.log(`🔗 Swagger Try it Out (Auth/Register): https://core-api-production-7554.up.railway.app/api-docs/#/Auth/post_auth_register`);
});