// src/routers/bookRoutes.ts
import { Router } from 'express';
import {
    listBooks,
    createBook,
    bookDetail,
    updateBook,
    deleteBook,
    recommendBooks
} from '../controllers/bookController';
import { verifyAdmin } from '../middlewares/verifyAdmin';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Endpoint untuk CRUD dan list/recommend books
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: List semua buku (pagination)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 50
 *     responses:
 *       200:
 *         description: Daftar buku berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: List books fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     books:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: number
 *                         limit:
 *                           type: number
 *                         total:
 *                           type: number
 *                         totalPages:
 *                           type: number
 */
router.get('/', listBooks);

/**
 * @swagger
 * /books/recommend:
 *   get:
 *     summary: Rekomendasi buku
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           example: 10
 *     responses:
 *       200:
 *         description: Buku rekomendasi berhasil diambil
 */
router.get('/recommend', recommendBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Tambah buku baru (Admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - authorId
 *               - categoryId
 *               - totalCopies
 *               - availableCopies
 *             properties:
 *               title:
 *                 type: string
 *                 example: Harry Potter
 *               description:
 *                 type: string
 *                 example: Buku fantasi populer
 *               isbn:
 *                 type: string
 *                 example: 978-3-16-148410-0
 *               publishedYear:
 *                 type: number
 *                 example: 2000
 *               coverImage:
 *                 type: string
 *                 example: /images/harry.jpg
 *               authorId:
 *                 type: number
 *                 example: 1
 *               categoryId:
 *                 type: number
 *                 example: 2
 *               totalCopies:
 *                 type: number
 *                 example: 10
 *               availableCopies:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Buku berhasil dibuat
 */
router.post('/', verifyAdmin, createBook);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Detail buku
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *     responses:
 *       200:
 *         description: Detail buku berhasil diambil
 */
router.get('/:id', bookDetail);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update buku (Admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publishedYear:
 *                 type: number
 *               coverImage:
 *                 type: string
 *               authorId:
 *                 type: number
 *               categoryId:
 *                 type: number
 *               totalCopies:
 *                 type: number
 *               availableCopies:
 *                 type: number
 *     responses:
 *       200:
 *         description: Buku berhasil diupdate
 */
router.put('/:id', verifyAdmin, updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Hapus buku (Admin)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         example: 1
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus
 */
router.delete('/:id', verifyAdmin, deleteBook);

export default router;