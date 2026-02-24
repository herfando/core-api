import { Router } from 'express';
import { listBooks, createBook, bookDetail, updateBook, deleteBook, recommendBooks } from '../controllers/bookController';
import { verifyAdmin } from '../middlewares/verifyAdmin';

const router = Router();

router.get('/books', listBooks);
router.get('/books/recommend', recommendBooks);
router.get('/books/:id', bookDetail);
router.post('/books', verifyAdmin, createBook);
router.put('/books/:id', verifyAdmin, updateBook);
router.delete('/books/:id', verifyAdmin, deleteBook);

export default router;