

import React from 'react';
import { Edit, Trash2, ExternalLink, MoreVertical } from 'lucide-react';
import { Product, User } from '../../types';

interface InventoryProps {
  products: Product[];
  user: User;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewProduct?: (product: Product) => void;
  onToggleStatus?: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, user, onEdit, onDelete, onViewProduct, onToggleStatus }) => {
  // If user is admin, show all products. If seller, show only theirs.
  // Note: products passed prop might already be filtered by the parent Dashboard component, 
  // but we add this check here for robustness if a full list is passed.
  const displayProducts = user.role === 'admin' ? products : products.filter(p => p.sellerId === user.username);

  return (
    <div className="space-y-6">
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayProducts.map((product) => (
                <tr key={product.id} className="bg-white border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => onViewProduct && onViewProduct(product)}
                    >
                        <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <span className="group-hover:text-brand-600 transition-colors flex items-center gap-2">
                            {product.name}
                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-semibold">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        product.stock < 5 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {onToggleStatus && (
                         <button 
                            onClick={() => onToggleStatus(product.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.isActive ? 'bg-green-500' : 'bg-slate-200'}`}
                         >
                            <span 
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-6' : 'translate-x-1'}`} 
                            />
                         </button>
                    )}
                    <span className="block text-xs mt-1 text-slate-400 font-medium">
                        {product.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(product); }}
                        className="text-slate-400 hover:text-brand-600 transition-colors p-2 hover:bg-brand-50 rounded-lg"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}
                        className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {displayProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    {user.role === 'admin' ? "No products found in the system." : "You don't have any products on sale yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {displayProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex gap-4">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                        onClick={() => onViewProduct && onViewProduct(product)}
                    />
                    <div className="flex-1 min-w-0">
                         <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">{product.name}</h3>
                         <p className="text-slate-500 text-xs mb-2">{product.category}</p>
                         <p className="font-bold text-lg text-slate-900">${product.price.toFixed(2)}</p>
                    </div>
                    {onToggleStatus && (
                         <div className="flex flex-col items-center">
                            <button 
                                onClick={() => onToggleStatus(product.id)}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${product.isActive ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                            </button>
                            <span className="text-[10px] mt-1 text-slate-400 font-bold uppercase">
                                {product.isActive ? 'Live' : 'Hidden'}
                            </span>
                         </div>
                    )}
                </div>
                
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                     <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        Stock: {product.stock}
                     </span>
                     
                     <div className="flex gap-2">
                        <button 
                            onClick={() => onEdit(product)}
                            className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <Edit size={16} />
                        </button>
                        <button 
                            onClick={() => onDelete(product.id)}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                     </div>
                </div>
            </div>
        ))}
         {displayProducts.length === 0 && (
             <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                {user.role === 'admin' ? "No products found." : "You don't have any products on sale yet."}
             </div>
         )}
      </div>

    </div>
  );
};