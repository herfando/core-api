import sql from "../models/db";
import { categories } from "../dummy/dummyCategories";

const seedCategories = async () => {
    try {
        for (const c of categories) {
            await sql`
        INSERT INTO categories
          (name, created_at, update_at)
        VALUES
          (${c.name}, NOW(), NOW())
      `;
        }
        console.log("✅ 50 categories inserted");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCategories();