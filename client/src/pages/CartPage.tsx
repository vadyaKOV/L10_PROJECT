import React from 'react';
import { useCart, formatPrice } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export const CartPage: React.FC = () => {
    const { cartItems, decreaseItem, addToCart, removeItem, totalPrice } = useCart();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <h3>Ваша корзина пуста</h3>
                    <p>Добавьте украшения из каталога</p>
                    <Link to="/">
                        <button className="continue-btn">ПЕРЕЙТИ К КАТАЛОГУ</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h2>КОРЗИНА</h2>
            
            <div className="cart-items">
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <div className="cart-item-image">
                            <img src={item.image} alt={item.title} />
                        </div>
                        
                        <div className="cart-item-info">
                            <h4>{item.title}</h4>
                            <span className="price">{formatPrice(item.price)}</span>
                        </div>

                        <div className="cart-item-controls">
                            <div className="quantity-control">
                                <button className="quantity-btn" onClick={() => decreaseItem(item.id)}>−</button>
                                <span className="quantity-value">{item.count}</span>
                                <button className="quantity-btn" onClick={() => addToCart(item.id)}>+</button>
                            </div>
                            <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <p className="total">Итого: <span>{totalPrice} Br</span></p>
                <Link to="/delivery">
                    <button className="checkout-btn">ОФОРМИТЬ ЗАКАЗ</button>
                </Link>
            </div>
        </div>
    );
};
