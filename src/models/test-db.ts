import { pool } from "./db";

async function testDB() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("DB CONNECTED:", res.rows[0]);
    } catch (err) {
        console.error("DB ERROR:", err);
    }
}

testDB();