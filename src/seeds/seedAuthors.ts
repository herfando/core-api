import sql from "../models/db";
import { authors } from "../dummy/dummyAuthors";

const seedAuthors = async () => {
    try {
        for (const a of authors) {
            await sql`
        INSERT INTO authors
          (name, bio, created_at, updated_at)
        VALUES
          (${a.name}, ${a.bio}, NOW(), NOW())
      `;
        }
        console.log("✅ 50 authors inserted");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAuthors();