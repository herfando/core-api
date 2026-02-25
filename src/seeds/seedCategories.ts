import sql from "../models/db";
import { categories } from "../dummy/dummyCategories";

interface CategoryListResponse {
    success: boolean;
    message: string;
    data: {
        categories: {
            id: number;
            name: string;
            createdAt: string;
            updateAt: string;
        }[];
    };
}

const seedCategories = async () => {
    try {
        const insertedCategories: CategoryListResponse["data"]["categories"] = [];

        for (const c of categories) {
            const result = await sql<{ id: number }[]>`
        INSERT INTO categories (name, created_at, update_at)
        VALUES (${c.name}, NOW(), NOW())
        RETURNING id
      `;
            insertedCategories.push({
                id: result[0].id,
                name: c.name,
                createdAt: new Date().toISOString(),
                updateAt: new Date().toISOString(),
            });
        }

        const response: CategoryListResponse = {
            success: true,
            message: "Categories seeded successfully",
            data: { categories: insertedCategories },
        };

        console.log(response);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedCategories();