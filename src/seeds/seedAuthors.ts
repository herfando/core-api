import sql from "../models/db";
import { authors } from "../dummy/dummyAuthors";

interface AuthorListResponse {
    success: boolean;
    message: string;
    data: {
        authors: {
            id: number;
            name: string;
            bio: string;
            createdAt: string;
            updatedAt: string;
        }[];
    };
}

const seedAuthors = async () => {
    try {
        const insertedAuthors: AuthorListResponse["data"]["authors"] = [];

        for (const a of authors) {
            const result = await sql<{ id: number }[]>`
        INSERT INTO authors (name, bio, created_at, updated_at)
        VALUES (${a.name}, ${a.bio}, NOW(), NOW())
        RETURNING id
      `;
            insertedAuthors.push({
                id: result[0].id,
                name: a.name,
                bio: a.bio,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }

        const response: AuthorListResponse = {
            success: true,
            message: "Authors seeded successfully",
            data: { authors: insertedAuthors },
        };

        console.log(response);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAuthors();