import React from 'react';
import { DollarSign, TrendingUp, Package, BarChart3, AlertTriangle, Clock, ArrowRight, Box } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sale, SalesStat, Product, Order } from '../../types';

interface OverviewProps {
  sales: Sale[];
  salesStats: SalesStat[];
  products?: Product[];
  orders?: Order[];
}

export const Overview: React.FC<OverviewProps> = ({ sales, salesStats, products = [], orders = [] }) => {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalSales = sales.length;
  const averageOrder = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  // Specific Data Extraction
  const lowStockProducts = products.filter(p => p.stock < 5);
  const totalInventory = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending');

  return (
    <div className="space-y-8">
      
      {/* Actionable Insights Section */}
      {(lowStockProducts.length > 0 || pendingOrders.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Low Stock Detailed Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-50 text-yellow-600 p-2 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">Low Stock Inventory</h3>
                    </div>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">{lowStockProducts.length} Items</span>
                </div>
                
                <div className="space-y-3">
                    {lowStockProducts.slice(0, 3).map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img src={p.image} className="w-10 h-10 rounded-md object-cover bg-slate-200" alt="" />
                                <div>
                                    <p className="text-sm font-bold text-slate-700 line-clamp-1">{p.name}</p>
                                    <p className="text-xs text-slate-500">{p.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block text-red-600 font-bold text-sm">{p.stock} left</span>
                                <span className="text-xs text-slate-400">Reorder soon</span>
                            </div>
                        </div>
                    ))}
                    {lowStockProducts.length > 3 && (
                         <div className="text-center pt-2">
                             <span className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">+ {lowStockProducts.length - 3} more items</span>
                         </div>
                    )}
                </div>
            </div>

            {/* Pending Orders Detailed Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-50 text-red-600 p-2 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800">Orders to Fulfill</h3>
                    </div>
                    <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">{pendingOrders.length} Pending</span>
                </div>
                
                <div className="space-y-3">
                    {pendingOrders.slice(0, 3).map(o => (
                        <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border-l-2 border-slate-200 hover:border-brand-500 transition-colors cursor-pointer group">
                            <div>
                                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    #{o.id} <span className="text-slate-400">•</span> {o.customerName}
                                </p>
                                <p className="text-xs text-slate-500">{o.date}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-900">${o.total.toFixed(2)}</span>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-600" />
                            </div>
                        </div>
                    ))}
                    {pendingOrders.length === 0 && (
                        <div className="text-center py-6 text-slate-400 text-sm">
                            No pending orders. Good job!
                        </div>
                    )}
                     {pendingOrders.length > 3 && (
                         <div className="text-center pt-2">
                             <span className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">+ {pendingOrders.length - 3} more orders</span>
                         </div>
                    )}
                </div>
            </div>

        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
          <div className="text-xs text-green-600 font-medium flex items-center gap-1">
            <TrendingUp size={14} /> +12% vs last month
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-100 text-brand-600 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Sales</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalSales}</h3>
            </div>
          </div>
          <div className="text-xs text-brand-600 font-medium flex items-center gap-1">
              <TrendingUp size={14} /> +5%
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Box size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Stock</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalInventory}</h3>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-medium">
              Units across all products
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Avg. Order</p>
              <h3 className="text-2xl font-bold text-slate-900">${averageOrder.toFixed(2)}</h3>
            </div>
          </div>
           <div className="text-xs text-slate-400 font-medium">
              Last 30 days
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px]">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Sales Performance</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-500 focus:ring-0 cursor-pointer">
                <option>Last 6 months</option>
                <option>Last year</option>
            </select>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesStats}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} prefix="$" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#0d9488" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};