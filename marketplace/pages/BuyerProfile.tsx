
import React, { useState } from 'react';
import { Upload, Mail, Calendar, ArrowLeft, Package, Truck, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { BuyerProfile, Address, Order } from '../types';

interface BuyerProfileProps {
  buyerProfile: BuyerProfile;
  orders: Order[];
  onUpdateProfile: (profile: BuyerProfile) => void;
  onBack: () => void;
}

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Package size={12}/> Pending</span>;
        case 'Shipped': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={12}/> Shipped</span>;
        case 'Delivered': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12}/> Delivered</span>;
        default: return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300">
        {/* Header - Always Visible */}
        <div 
            className="p-5 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <div>
                        <p className="text-slate-500 font-medium text-xs">Date</p>
                        <p className="text-slate-900 font-bold">{order.date}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 font-medium text-xs">Total</p>
                        <p className="text-slate-900 font-bold">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="hidden xs:block">
                        <p className="text-slate-500 font-medium text-xs">Order #</p>
                        <p className="text-slate-900 font-bold uppercase">{order.id}</p>
                    </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4">
                    {getStatusBadge(order.status)}
                    <button className="text-slate-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>
        </div>
        
        {/* Expanded Content */}
        {isExpanded && (
            <div className="p-5 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                <div className="space-y-4 mb-6">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-start sm:items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate">{item.productName}</h4>
                                <p className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                            </div>
                            <span className="font-bold text-slate-900 text-sm sm:text-base">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-100 gap-4">
                    <p className="text-sm text-slate-500">
                        {order.status === 'Pending' ? 'Expected Delivery: 5-7 business days' : 
                            order.status === 'Shipped' ? 'Expected Delivery: 2-3 business days' : 
                            'Delivered on ' + order.date} 
                    </p>
                    <button className="w-full sm:w-auto text-brand-600 font-bold text-sm hover:text-brand-700 transition-colors border border-brand-200 rounded-lg px-4 py-2 hover:bg-brand-50">
                        Track Package
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export const BuyerProfilePage: React.FC<BuyerProfileProps> = ({ buyerProfile, orders, onUpdateProfile, onBack }) => {
  const [formData, setFormData] = useState<BuyerProfile>(buyerProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Filter orders for this specific buyer
  const myOrders = orders.filter(o => o.buyerUsername === buyerProfile.username);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData(prev => ({
        ...prev,
        shippingAddress: {
            ...prev.shippingAddress || { fullName: '', addressLine: '', city: '', zipCode: '', country: '' },
            [field]: value
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-4 sm:pt-8">
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 mb-6 group">
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Profile</h1>
                    <p className="text-slate-500 text-sm sm:text-base">Manage your personal information and view your orders.</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-700 transition-colors w-full sm:w-auto shadow-lg shadow-brand-500/20"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12">
                <div className="p-6 sm:p-8 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                        <div className="relative group flex-shrink-0">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 shadow-inner">
                                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-brand-600 text-white p-2 rounded-full cursor-pointer hover:bg-brand-700 transition-colors shadow-md">
                                    <Upload size={16} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload}/>
                                </label>
                            )}
                        </div>
                        
                        <div className="flex-1 text-center md:text-left space-y-2 w-full">
                             {isEditing ? (
                                <div className="max-w-xs mx-auto md:mx-0">
                                    <label className="block text-xs font-bold text-slate-400 mb-1 text-left">Username</label>
                                    <input 
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        className="text-xl sm:text-2xl font-bold text-slate-900 border-b border-slate-200 outline-none w-full py-1 focus:border-brand-500 transition-colors"
                                        placeholder="Username"
                                    />
                                </div>
                             ) : (
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{formData.username}</h2>
                             )}
                             <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 text-sm">
                                <Calendar size={14} /> Member since {formData.joinDate}
                             </p>
                        </div>
                    </div>
                </div>

                {/* Profile Fields (Hidden when viewing orders to save space unless editing) */}
                {(isEditing || !isEditing) && (
                    <div className={`p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 ${!isEditing ? 'bg-slate-50/30' : ''}`}>
                        <div className="space-y-6">
                            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">Personal Info</h3>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
                                {isEditing ? (
                                    <textarea 
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500/20 h-24 transition-shadow"
                                        value={formData.bio}
                                        onChange={e => setFormData({...formData, bio: e.target.value})}
                                    />
                                ) : (
                                    <p className="text-slate-600 leading-relaxed bg-white p-4 rounded-xl border border-slate-100 text-sm">
                                        {formData.bio || "No bio added yet."}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="email"
                                        readOnly={!isEditing}
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl border ${isEditing ? 'border-slate-200 focus:ring-2 focus:ring-brand-500/20' : 'border-transparent bg-white text-slate-500'} outline-none transition-all`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-2">Default Shipping Address</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                                    <input 
                                        type="text"
                                        readOnly={!isEditing}
                                        value={formData.shippingAddress?.fullName || ''}
                                        onChange={e => handleAddressChange('fullName', e.target.value)}
                                        className={`w-full px-4 py-2 rounded-xl border ${isEditing ? 'border-slate-200 focus:ring-2 focus:ring-brand-500/20' : 'border-transparent bg-white text-slate-500'} outline-none transition-all`}
                                    />
                                </div>
                                 <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Address</label>
                                    <input 
                                        type="text"
                                        readOnly={!isEditing}
                                        value={formData.shippingAddress?.addressLine || ''}
                                        onChange={e => handleAddressChange('addressLine', e.target.value)}
                                        className={`w-full px-4 py-2 rounded-xl border ${isEditing ? 'border-slate-200 focus:ring-2 focus:ring-brand-500/20' : 'border-transparent bg-white text-slate-500'} outline-none transition-all`}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">City</label>
                                        <input 
                                            type="text"
                                            readOnly={!isEditing}
                                            value={formData.shippingAddress?.city || ''}
                                            onChange={e => handleAddressChange('city', e.target.value)}
                                            className={`w-full px-4 py-2 rounded-xl border ${isEditing ? 'border-slate-200 focus:ring-2 focus:ring-brand-500/20' : 'border-transparent bg-white text-slate-500'} outline-none transition-all`}
                                        />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Country</label>
                                        <input 
                                            type="text"
                                            readOnly={!isEditing}
                                            value={formData.shippingAddress?.country || ''}
                                            onChange={e => handleAddressChange('country', e.target.value)}
                                            className={`w-full px-4 py-2 rounded-xl border ${isEditing ? 'border-slate-200 focus:ring-2 focus:ring-brand-500/20' : 'border-transparent bg-white text-slate-500'} outline-none transition-all`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="p-6 sm:p-8 bg-slate-50 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100">
                        <button 
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="text-slate-500 font-bold hover:text-slate-700 px-6 py-2 order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="bg-brand-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 order-1 sm:order-2"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </form>

            {/* Order History Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order History</h2>
                
                {myOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
                        <p className="text-slate-500">When you purchase unique finds, they will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {myOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};
