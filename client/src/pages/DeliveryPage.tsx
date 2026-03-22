import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './DeliveryPage.css';

export const DeliveryPage: React.FC = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/');
        }
    }, [cartItems, navigate]);

    const [formData, setFormData] = useState({
        address: '',
        phone: '',
        email: '',
        payment: 'card'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.address || !formData.phone) {
            alert('Заполните все поля!');
            return;
        }

        try {
            await clearCart(); 
            alert(`Заказ оформлен! Сумма: ${totalPrice} Br\nАдрес доставки: ${formData.address}`);
            navigate('/');
        } catch (error) {
            alert('Ошибка при оформлении заказа');
        }
    };

    return (
        <div className="delivery-page">
            <div className="delivery-container">
                <h2>ОФОРМЛЕНИЕ ЗАКАЗА</h2>
                
                <div className="order-summary">
                    <p>Товаров в заказе: <span>{cartItems.length} шт.</span></p>
                    <p className="total">К оплате: <span>{totalPrice} Br</span></p>
                </div>

                <form className="delivery-form" onSubmit={handleSubmit} data-delivery>
                    <div className="form-group">
                        <label>Адрес доставки</label>
                        <input 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            placeholder="Ул. Пушкина, д. Колотушкина, кв. 1" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Телефон</label>
                        <input 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            placeholder="+375 (29) 000-00-00" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            name="email" 
                            type="email"
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="example@mail.com" 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Способ оплаты</label>
                        <select 
                            name="payment" 
                            value={formData.payment} 
                            onChange={handleChange}
                        >
                            <option value="card">Картой онлайн</option>
                            <option value="cash">Наличными курьеру</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn">
                        ПОДТВЕРДИТЬ ЗАКАЗ
                    </button>
                </form>
            </div>
        </div>
    );
};
