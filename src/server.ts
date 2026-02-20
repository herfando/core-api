import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import routes
import authRoutes from "./routers/auth";

dotenv.config();

const app = express();


// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());


// ===== TEST ROOT =====
app.get("/", (req, res) => {
    res.send("Core API is running with TypeScript!");
});


// ===== ROUTES =====
app.use("/auth", authRoutes);


// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});