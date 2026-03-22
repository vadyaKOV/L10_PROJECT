import React from 'react';
import type { IProduct } from '../types';
import { formatPrice } from '../contexts/CartContext';
import './ProductCard.css';

interface ProductCardProps {
    product: IProduct;
    onAdd: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
    return (
        <div className="product-card">
            <div className="image-wrapper">
                <img src={product.image} alt={product.title} />
                {!product.isAvailable && <span className="out-of-stock">Нет в наличии</span>}
            </div>
            
            <div className="card-body">
                <div className="card-info">
                    <span className="category">{product.category}</span>
                    <h3 data-title>{product.title}</h3>
                    <p className="description">{product.description}</p>
                    <span className="weight">{product.size}</span>
                </div>

                <div className="card-footer">
                    <span className="price" data-price>{formatPrice(product.price)}</span>
                    <button 
                        className="btn-add" 
                        onClick={() => onAdd(product.id)}
                        disabled={!product.isAvailable}
                    >
                        {product.isAvailable ? 'В корзину' : 'Нет'}
                    </button>
                </div>
            </div>
        </div>
    );
};
