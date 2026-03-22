import { Request, Response } from 'express';
import { readJson, writeJson } from '../models/fileModel';
import { IUser, IProduct, ICartItem } from '../types';

const USERS_FILE = 'users.json';
const PRODUCTS_FILE = 'products.json';

// Получить корзину (с полной инфой о товарах)
export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await readJson<IUser>(USERS_FILE);
        const products = await readJson<IProduct>(PRODUCTS_FILE);
        
        const user = users.find(u => u.id === req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Собираем полный объект для фронта
        const fullCart = user.cart.map(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            return {
                ...product,     // title, price, image...
                count: cartItem.count // + количество
            };
        }).filter(item => item.id); // Убираем товары, если они были удалены из базы

        res.json(fullCart);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

// Добавить товар (или увеличить кол-во)
export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.body;
        const users = await readJson<IUser>(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const user = users[userIndex];
        const itemIndex = user.cart.findIndex(i => i.productId === productId);

        if (itemIndex > -1) {
            user.cart[itemIndex].count += 1;
        } else {
            user.cart.push({ productId, count: 1 });
        }

        users[userIndex] = user;
        await writeJson(USERS_FILE, users);

        res.json(user.cart);
    } catch (e) {
        res.status(500).json({ message: 'Error adding to cart' });
    }
};

// Уменьшить кол-во или удалить
export const decreaseItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.body; // Используем body, хотя можно и params
        const users = await readJson<IUser>(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) return;

        const user = users[userIndex];
        const itemIndex = user.cart.findIndex(i => i.productId === productId);

        if (itemIndex > -1) {
            if (user.cart[itemIndex].count > 1) {
                user.cart[itemIndex].count -= 1;
            } else {
                // Если был 1, удаляем совсем
                user.cart.splice(itemIndex, 1);
            }
        }

        users[userIndex] = user;
        await writeJson(USERS_FILE, users);

        res.json(user.cart);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};

// Полностью удалить товар
export const removeItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = Number(req.params.id);
        const users = await readJson<IUser>(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) return;

        users[userIndex].cart = users[userIndex].cart.filter(i => i.productId !== productId);
        
        await writeJson(USERS_FILE, users);
        res.json(users[userIndex].cart);
    } catch (e) {
        res.status(500).json({ message: 'Error' });
    }
};
// Оформление заказа (Очистка корзины)
export const checkout = async (req: Request, res: Response): Promise<void> => {
    try {
        // В реальном проекте тут мы бы сохраняли заказ в orders.json
        // Но по ТЗ главное - очистить корзину
        const users = await readJson<IUser>(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === req.userId);

        if (userIndex === -1) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Очищаем массив корзины
        users[userIndex].cart = [];
        
        await writeJson(USERS_FILE, users);
        res.json({ message: 'Order placed successfully', cart: [] });
    } catch (e) {
        res.status(500).json({ message: 'Error checkout' });
    }
};