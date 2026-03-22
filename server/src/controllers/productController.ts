import { Request, Response } from 'express';
import { readJson } from '../models/fileModel';
import { IProduct } from '../types';

const PRODUCTS_FILE = 'products.json';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        let products = await readJson<IProduct>(PRODUCTS_FILE);

        const { search, category, sort } = req.query;

        // 1. Поиск по названию
        if (search && typeof search === 'string') {
            const lowerSearch = search.toLowerCase();
            products = products.filter(p => p.title.toLowerCase().includes(lowerSearch));
        }

        // 2. Фильтрация по категории
        if (category && typeof category === 'string') {
            products = products.filter(p => p.category === category);
        }

        // 3. Сортировка по цене
        if (sort === 'price_asc') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price_desc') {
            products.sort((a, b) => b.price - a.price);
        }

        res.json(products);
    } catch (e) {
        res.status(500).json({ message: 'Error fetching products' });
    }
};