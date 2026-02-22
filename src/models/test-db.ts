import sql from "./db";

async function testDB() {
    try {
        const res = await sql`SELECT NOW()`;
        console.log("DB CONNECTED:", res[0]);
    } catch (err) {
        console.error("DB ERROR:", err);
    }
}

testDB();