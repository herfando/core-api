// src/routes/categoriesRoutes.ts
import { Router } from "express";
import {
    listCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/categoriesController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categories API
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories including books
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories with books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                           updatedAt:
 *                             type: string
 *                           books:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                 title:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                                 coverImage:
 *                                   type: string
 *                                 rating:
 *                                   type: number
 *                                 categoryId:
 *                                   type: integer
 */
router.get("/", listCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category created successfully
 */
router.post("/", createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/:id", updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete("/:id", deleteCategory);

export default router;