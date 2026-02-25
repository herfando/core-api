import sql from "../models/db";
import { books } from "../dummyBooks50";

const seed = async () => {
    try {

        for (const b of books) {

            await sql`
        INSERT INTO books
        (title, description, isbn, published_year, cover_image, price, ratings, review_count, total_copies, borrow_count, author_id, category_id)
        VALUES
        (
          ${b.title},
          ${b.description},
          ${b.isbn},
          ${b.published_year},
          ${b.cover_image},
          ${b.price},
          ${b.ratings},
          ${b.review_count},
          ${b.total_copies},
          ${b.borrow_count},
          ${b.author_id},
          ${b.category_id}
        )
      `;

        }

        console.log("✅ 50 books inserted");
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();