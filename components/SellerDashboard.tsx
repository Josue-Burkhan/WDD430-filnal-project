
import React, { useState, useEffect } from 'react';
import { Plus, Package, Trash2, X, LayoutDashboard, ShoppingCart, Settings, LogOut, User as UserIcon, Save, DollarSign, Box, Store, ExternalLink } from 'lucide-react';
import { Product, User, ViewState } from '../types';
import { ApiService } from '../services/api';

interface SellerDashboardProps {
  user: User;
  onLogout?: () => void;
  onNavigate?: (view: ViewState) => void;
}

type Tab = 'OVERVIEW' | 'PRODUCTS' | 'ORDERS' | 'PROFILE';

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ user, onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('OVERVIEW');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Profile State
  const [profileData, setProfileData] = useState({ bio: user.bio || '', profile_picture: user.profile_picture || '' });
  
  // Product Form State
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', stock: '1', image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadProducts();
      setProfileData({ bio: user.bio || '', profile_picture: user.profile_picture || '' });
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await ApiService.getAllProducts();
      // Filter products belonging to current user
      const sellerProducts = allProducts.filter(p => Number(p.user_id) === Number(user.id));
      setProducts(sellerProducts);
    } catch (error) {
      console.error("Failed loading products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ApiService.createProduct(formData);
      
      // Success
      setIsModalOpen(false);
      setFormData({ name: '', description: '', price: '', category: '', stock: '1', image_url: '' });
      await loadProducts();
      alert('Product created successfully!');
    } catch (error: any) {
      console.error(error);
      const msg = error.message || "Unknown error";
      if (msg.includes("Not authenticated")) {
         alert("Session expired or invalid. Please Log Out and Log In again.");
      } else {
         alert(`Error creating product: ${msg}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await ApiService.deleteProduct(id);
      await loadProducts();
    } catch (error) {
      alert('Failed to delete product.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await ApiService.updateUserProfile(token, profileData);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculated Stats
  const totalRevenue = products.reduce((acc, p) => acc + (Number(p.price) * p.stock), 0);
  const totalStock = products.reduce((acc, p) => acc + Number(p.stock), 0);

  // --- COMPONENTS ---

  const SidebarItem = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' 
          : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
      }`}
    >
      <Icon size={20} /> {label}
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100">
      
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-stone-900 text-white flex-shrink-0 p-6 flex flex-col h-auto md:h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <div>
            <h2 className="font-black text-xl tracking-tight">Seller<span className="text-brand-500">Hub</span></h2>
            <p className="text-xs text-stone-500">Control Center</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <SidebarItem tab="OVERVIEW" icon={LayoutDashboard} label="Overview" />
          <SidebarItem tab="PRODUCTS" icon={Package} label="Products" />
          <SidebarItem tab="ORDERS" icon={ShoppingCart} label="Orders" />
          <SidebarItem tab="PROFILE" icon={Settings} label="Store Profile" />
          
          <div className="pt-4">
            <button 
              onClick={() => onNavigate && onNavigate('HOME')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-brand-400 hover:bg-stone-800 transition-all duration-200"
            >
              <Store size={20} /> Back to Store
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-800 mt-auto">
           <div className="flex items-center gap-3 p-3 bg-stone-800 rounded-xl mb-4">
             {user.profile_picture ? (
               <img src={user.profile_picture} className="w-10 h-10 rounded-full object-cover border-2 border-brand-500" />
             ) : (
               <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-brand-500 font-bold">
                 {user.username.charAt(0).toUpperCase()}
               </div>
             )}
             <div className="overflow-hidden">
               <p className="font-bold text-sm truncate">{user.username}</p>
               <p className="text-xs text-stone-500 truncate">{user.email}</p>
             </div>
           </div>
           {onLogout && (
             <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-red-400 hover:bg-stone-800 py-2 rounded-lg transition-colors text-sm font-bold">
               <LogOut size={16} /> Log Out
             </button>
           )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-stone-900">Dashboard</h1>
                <p className="text-stone-500">Welcome back, here's what's happening today.</p>
              </div>
              <button onClick={() => setActiveTab('PRODUCTS')} className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-500 transition-colors">
                Manage Inventory
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign /></div>
                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">+12%</span>
                </div>
                <h3 className="text-stone-500 font-bold text-sm uppercase tracking-wider">Est. Revenue</h3>
                <p className="text-3xl font-black text-stone-900 mt-1">${totalRevenue.toFixed(2)}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Box /></div>
                </div>
                <h3 className="text-stone-500 font-bold text-sm uppercase tracking-wider">Products Active</h3>
                <p className="text-3xl font-black text-stone-900 mt-1">{products.length}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-brand-100 text-brand-600 rounded-xl"><ShoppingCart /></div>
                </div>
                <h3 className="text-stone-500 font-bold text-sm uppercase tracking-wider">Total Stock</h3>
                <p className="text-3xl font-black text-stone-900 mt-1">{totalStock}</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
               <h3 className="font-bold text-lg mb-6">Sales Performance</h3>
               <div className="flex items-end justify-between h-40 gap-2">
                 {[40, 65, 35, 85, 50, 70, 90].map((h, i) => (
                   <div key={i} className="w-full bg-brand-100 rounded-t-xl relative group overflow-hidden" style={{height: `${h}%`}}>
                     <div className="absolute bottom-0 left-0 w-full bg-brand-500 transition-all duration-500 h-0 group-hover:h-full opacity-80"></div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
               <div>
                 <h2 className="text-2xl font-bold text-stone-900">Inventory</h2>
                 <p className="text-stone-400 text-sm">Manage your {products.length} items</p>
               </div>
               <button onClick={() => setIsModalOpen(true)} className="bg-stone-900 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors">
                 <Plus size={18} /> Add New
               </button>
             </div>

             <div className="grid grid-cols-1 gap-4">
               {products.map(product => (
                 <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-300 transition-all">
                    <div className="w-full md:w-24 h-24 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={product.image_url || `https://source.unsplash.com/random/200x200/?${product.category}`} 
                        className="w-full h-full object-cover mix-blend-multiply" 
                        onError={(e) => (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=No+Image'}
                        alt="" 
                      />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <span className="text-[10px] font-bold uppercase text-brand-600 tracking-wider">{product.category}</span>
                      <h3 className="font-bold text-stone-900 text-lg">{product.name}</h3>
                      <p className="text-stone-500 text-sm line-clamp-1">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-8 px-4 border-t md:border-t-0 md:border-l border-stone-100 pt-4 md:pt-0 w-full md:w-auto justify-between md:justify-start">
                       <div className="text-center">
                         <p className="text-xs text-stone-400 font-bold uppercase">Price</p>
                         <p className="font-black text-stone-900">${Number(product.price).toFixed(2)}</p>
                       </div>
                       <div className="text-center">
                         <p className="text-xs text-stone-400 font-bold uppercase">Stock</p>
                         <p className="font-black text-stone-900">{product.stock}</p>
                       </div>
                       <button 
                         onClick={() => handleDeleteProduct(product.id)}
                         className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                       >
                         <Trash2 size={18} />
                       </button>
                    </div>
                 </div>
               ))}
               {products.length === 0 && (
                 <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-300">
                   <Package className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                   <p className="text-stone-500 font-medium">No products found.</p>
                   <button onClick={() => setIsModalOpen(true)} className="text-brand-600 font-bold mt-2 hover:underline">Add your first product</button>
                 </div>
               )}
             </div>
          </div>
        )}

        {activeTab === 'ORDERS' && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-2xl font-bold text-stone-900">Recent Orders</h2>
             <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
               <table className="w-full text-left">
                 <thead className="bg-stone-50 text-stone-500 text-xs uppercase font-bold">
                   <tr>
                     <th className="px-6 py-4">Order ID</th>
                     <th className="px-6 py-4">Customer ID</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Total</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-stone-100">
                   <tr>
                     <td className="px-6 py-4 font-mono text-sm">#1024</td>
                     <td className="px-6 py-4">User #5</td>
                     <td className="px-6 py-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-xs font-bold">Pending</span></td>
                     <td className="px-6 py-4 font-bold">$45.00</td>
                   </tr>
                 </tbody>
               </table>
             </div>
           </div>
        )}

        {activeTab === 'PROFILE' && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Store Profile</h2>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
               <form onSubmit={handleUpdateProfile} className="space-y-6">
                 <div>
                   <label className="block text-sm font-bold text-stone-700 mb-2">Store/User Name</label>
                   <input disabled value={user.username} className="w-full bg-stone-100 p-3 rounded-xl border-none text-stone-500 cursor-not-allowed" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-stone-700 mb-2">Email</label>
                   <input disabled value={user.email} className="w-full bg-stone-100 p-3 rounded-xl border-none text-stone-500 cursor-not-allowed" />
                 </div>
                 
                 <div className="border-t border-stone-100 my-6"></div>
                 
                 <div>
                   <label className="block text-sm font-bold text-stone-700 mb-2">Profile Picture URL</label>
                   <div className="flex gap-4">
                      <div className="w-16 h-16 bg-stone-200 rounded-full flex-shrink-0 overflow-hidden border-2 border-stone-300">
                        {profileData.profile_picture && <img src={profileData.profile_picture} className="w-full h-full object-cover" />}
                      </div>
                      <input 
                        value={profileData.profile_picture} 
                        onChange={e => setProfileData({...profileData, profile_picture: e.target.value})}
                        placeholder="https://example.com/avatar.jpg" 
                        className="flex-1 p-3 rounded-xl border border-stone-200 focus:border-brand-500 outline-none" 
                      />
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-bold text-stone-700 mb-2">Bio / Store Description</label>
                   <textarea 
                      value={profileData.bio}
                      onChange={e => setProfileData({...profileData, bio: e.target.value})}
                      rows={4} 
                      placeholder="Tell customers about your craft..." 
                      className="w-full p-3 rounded-xl border border-stone-200 focus:border-brand-500 outline-none resize-none"
                   />
                 </div>

                 <button disabled={submitting} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                   <Save size={18} /> Save Profile Changes
                 </button>
               </form>
            </div>
          </div>
        )}
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-6 items-center">
              <h2 className="text-2xl font-black text-stone-900">New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-stone-500 uppercase ml-1">Product Name</label>
                 <input required className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-500 outline-none font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-stone-500 uppercase ml-1">Price</label>
                   <input required type="number" step="0.01" className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-500 outline-none font-bold" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-stone-500 uppercase ml-1">Stock</label>
                   <input required type="number" className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-500 outline-none font-bold" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                 </div>
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-stone-500 uppercase ml-1">Category</label>
                 <input required placeholder="e.g. Pottery" className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-500 outline-none font-medium" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-stone-500 uppercase ml-1">Image URL (Optional)</label>
                 <input placeholder="https://..." className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-500 outline-none font-medium" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-stone-500 uppercase ml-1">Description</label>
                 <textarea required rows={3} className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-brand-500 outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-500 shadow-lg shadow-brand-500/25 transition-all mt-4">
                {submitting ? 'Creating...' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
