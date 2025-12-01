import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onClick }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
      <div 
        className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-full text-slate-700 shadow-sm">
                {product.category}
            </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 
                className="font-bold text-lg text-slate-800 line-clamp-1 cursor-pointer hover:text-brand-600 transition-colors"
                onClick={() => onClick(product)}
            >
                {product.name}
            </h3>
            <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg text-sm whitespace-nowrap">
                ${product.price.toFixed(2)}
            </span>
        </div>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white py-2.5 px-4 rounded-xl transition-colors font-medium text-sm active:scale-95 transform"
        >
          <Plus size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};