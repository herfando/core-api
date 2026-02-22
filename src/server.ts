import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routers/auth";
import { swaggerDocs } from "./swagger";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Root
app.get("/", (req: Request, res: Response) => res.send("Core API running"));

// Routes
app.use("/auth", authRoutes);

// Swagger
const PORT = Number(process.env.PORT) || 5000;
swaggerDocs(app, PORT);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));