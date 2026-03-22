import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '', password: '', name: '', phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login({ email: formData.email, password: formData.password });
            } else {
                await register(formData);
            }
            navigate('/');
        } catch (error) {
            alert('Ошибка! Проверьте данные.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>{isLogin ? 'ДОБРО ПОЖАЛОВАТЬ' : 'РЕГИСТРАЦИЯ'}</h2>
                <p className="login-subtitle">
                    {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
                </p>
                
                <form className="login-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input 
                                name="name" 
                                placeholder="Ваше имя" 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                name="phone" 
                                placeholder="Телефон" 
                                onChange={handleChange} 
                                required 
                            />
                        </>
                    )}
                    
                    <input 
                        name="email" 
                        type="email"
                        placeholder="Email" 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Пароль" 
                        onChange={handleChange} 
                        required 
                    />
                    
                    <button type="submit">
                        {isLogin ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
                    </button>
                </form>

                <p className="toggle-text">
                    {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
                    <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Регистрация' : 'Войти'}
                    </button>
                </p>
            </div>
        </div>
    );
};
