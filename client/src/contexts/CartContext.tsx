import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';
import type { IProduct } from '../types';

export interface ICartProduct extends IProduct {
    count: number;
}

const EXCHANGE_RATE = 0.03;

export const formatPrice = (price: number): string => {
    const converted = Math.round(price * EXCHANGE_RATE);
    return converted.toLocaleString('ru-RU') + ' Br';
};

interface CartContextType {
    cartItems: ICartProduct[];
    addToCart: (productId: number) => Promise<void>;
    decreaseItem: (productId: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    totalPrice: number;
    formatPrice: (price: number) => string;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<ICartProduct[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await api.get('/cart');
            setCartItems(data);
        } catch (error) {
            console.error('Failed to fetch cart');
        }
    };

    const addToCart = async (productId: number) => {
        if (!user) {
            alert('Сначала войдите в систему!');
            return;
        }
        await api.post('/cart/add', { productId });
        await fetchCart();
    };

    const decreaseItem = async (productId: number) => {
        await api.post('/cart/decrease', { productId });
        await fetchCart();
    };

    const removeItem = async (productId: number) => {
        await api.delete(`/cart/${productId}`);
        await fetchCart();
    };

    const clearCart = async () => {
        try {
            await api.post('/cart/checkout');
            setCartItems([]);
        } catch (error) {
            console.error('Checkout failed', error);
            throw error;
        }
    };

    const totalPrice = Math.round(
        cartItems.reduce((acc, item) => acc + item.price * item.count, 0) * EXCHANGE_RATE
    );

    return (
        <CartContext.Provider value={{ cartItems, addToCart, decreaseItem, removeItem, clearCart, totalPrice, formatPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
