import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { getProducts } from '../controllers/productController';
import { getCart, addToCart, decreaseItem, removeItem, checkout } from '../controllers/cartController';
import { checkAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', getMe);

router.get('/products', getProducts);

router.get('/cart', checkAuth, getCart);
router.post('/cart/add', checkAuth, addToCart);
router.post('/cart/decrease', checkAuth, decreaseItem);
router.delete('/cart/:id', checkAuth, removeItem);
router.post('/cart/checkout', checkAuth, checkout);

export default router;
