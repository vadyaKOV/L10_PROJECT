import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    LUXE<span>.</span>
                </Link>

                <nav className="nav">
                    {user ? (
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <Link to="/cart" className="cart-link">
                                <svg className="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 01-8 0"/>
                                </svg>
                                Корзина
                                {user.cart.length > 0 && <span className="badge">{user.cart.reduce((a,c) => a + c.count, 0)}</span>}
                            </Link>
                            <button onClick={logout} className="logout-btn">Выйти</button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">Войти</Link>
                    )}
                </nav>
            </div>
        </header>
    );
};
