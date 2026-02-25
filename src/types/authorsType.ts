// src/types.ts

export interface Author {
    id: number;
    name: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthorCreateInput {
    name: string;
    bio: string;
}

export interface AuthorsListResponse {
    success: boolean;
    message: string;
    data: {
        authors: Author[];
    };
}

export interface BookByAuthor {
    id: number;
    title: string;
    description: string;
    isbn: string;
    publishedYear: number;
    coverImage: string | null;
    price: number;
    stock: number;
    isActive: boolean;
    rating: number;
    reviewCount: number;
    authorId: number;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    availableCopies: number;
    borrowCount: number;
    totalCopies: number;
}

export interface AuthorWithBooksResponse {
    success: boolean;
    message: string;
    data: {
        author: Author;
        books: BookByAuthor[];
    };
}

export interface Category {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryCreateInput {
    name: string;
}

export interface CategoriesListResponse {
    success: boolean;
    message: string;
    data: {
        categories: Category[];
    };
}