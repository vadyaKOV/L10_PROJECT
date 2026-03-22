import React, { useEffect, useState } from 'react';
import api from '../api';
import type { IProduct } from '../types';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import './MainPage.css';

const CATEGORIES = [
    { value: '', label: 'Все украшения' },
    { value: 'rings', label: 'Кольца' },
    { value: 'necklaces', label: 'Колье' },
    { value: 'earrings', label: 'Серьги' },
    { value: 'bracelets', label: 'Браслеты' },
    { value: 'pendants', label: 'Подвески' },
    { value: 'watches', label: 'Часы' },
];

export const MainPage: React.FC = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [sort, selectedCategory, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (sort) params.append('sort', sort);
            if (selectedCategory) params.append('category', selectedCategory);

            const { data } = await api.get('/products', { params });
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-page">
            <div className="hero-section">
                <h1>ЮВЕЛИРНЫЕ УКРАШЕНИЯ</h1>
                <p>Роскошные украшения ручной работы для особенных моментов</p>
            </div>
            
            <div className="container">
                <div className="filters-bar">
                    <div className="search-group">
                        <input 
                            className="search-input"
                            type="text" 
                            placeholder="Поиск украшений..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchProducts()}
                        />
                        <button className="btn-primary" onClick={fetchProducts}>ПОИСК</button>
                    </div>
                    
                    <div className="controls-group">
                        <div className="category-tabs">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    className={`cat-tab ${selectedCategory === cat.value ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        <select 
                            className="sort-select"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="">Сортировка</option>
                            <option value="price_asc">Сначала дешевые</option>
                            <option value="price_desc">Сначала дорогие</option>
                        </select>
                    </div>
                </div>
                
                {loading ? (
                    <div className="loading">Загрузка украшений...</div>
                ) : (
                    <>
                        {products.length === 0 ? (
                            <div className="empty-state">
                                <h3>Ничего не найдено</h3>
                                <p>Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {products.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onAdd={addToCart}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
