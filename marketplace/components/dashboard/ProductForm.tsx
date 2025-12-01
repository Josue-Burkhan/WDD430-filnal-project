import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Sparkles, Save } from 'lucide-react';
import { Product, User } from '../../types';
import { generateProductDescription } from '../../services/geminiService';

interface ProductFormProps {
  initialData?: Partial<Product> | null;
  isEditing: boolean;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
  user: User;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  initialData, 
  isEditing, 
  onSave, 
  onCancel,
  user
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    category: '',
    image: '',
    description: '',
    reviews: []
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
        setFormData({
            name: '',
            price: 0,
            stock: 1,
            category: '',
            image: '', // Start empty
            description: '',
            reviews: []
        });
    }
  }, [initialData]);

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert("Please enter a name and category first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.price && formData.category) {
        const productToSave = {
            ...formData,
            id: isEditing && formData.id ? formData.id : Date.now().toString(),
            // Ensure there is a fallback image if none uploaded
            image: formData.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800',
            sellerId: user.username,
            stock: Number(formData.stock) || 0,
            reviews: formData.reviews || []
        };
        onSave(productToSave);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onCancel}
          className="p-2 hover:bg-white rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{isEditing ? 'Edit Product' : 'Create New Listing'}</h2>
          <p className="text-slate-500 text-sm">Fill in the details for your handmade item.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-w-3xl">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Product Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                placeholder="e.g. Handwoven Tapestry"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input 
                    type="number" 
                    required
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Stock Qty</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none bg-white"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Ceramics">Ceramics</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Woodwork">Woodwork</option>
                  <option value="Art">Art</option>
                  <option value="Candles">Candles</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Product Image</label>
              <div className="group relative border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-brand-500 hover:bg-brand-50/10 transition-colors">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                />
                {formData.image ? (
                  <div className="relative h-48 mx-auto rounded-lg overflow-hidden bg-slate-100">
                    <img src={formData.image} alt="Preview" className="h-full w-full object-contain" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-4 pointer-events-none">
                    <div className="p-3 bg-slate-100 rounded-full mb-3 text-slate-400">
                      <Upload size={24} />
                    </div>
                    <p className="text-slate-600 font-medium">Click to upload an image</p>
                    <p className="text-slate-400 text-sm">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Description</label>
                <button 
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="text-xs flex items-center gap-1.5 text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg hover:bg-brand-100 font-bold transition-colors disabled:opacity-50"
                >
                  <Sparkles size={14} />
                  {isGenerating ? 'Generating...' : 'Enhance with AI'}
                </button>
              </div>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none h-32 text-sm leading-relaxed"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Tell the story of how this item was made..."
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
            >
              <Save size={18} />
              {isEditing ? 'Save Changes' : 'Publish Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};