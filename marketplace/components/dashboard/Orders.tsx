
import React, { useState } from 'react';
import { Calendar, Eye, X, MapPin, ChevronRight } from 'lucide-react';
import { Order } from '../../types';

interface OrdersProps {
  orders: Order[];
}

export const Orders: React.FC<OrdersProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Delivered': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6 relative">
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.id} className="bg-white border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400"/> {order.date}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-brand-600 hover:text-brand-800 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                    >
                        <Eye size={16} /> Details
                    </button>
                  </td>
                </tr>
              ))}
              {sortedOrders.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                          No orders found.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
          {sortedOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 active:scale-[0.99] transition-transform"
                onClick={() => setSelectedOrder(order)}
              >
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">#{order.id}</p>
                          <p className="font-bold text-slate-900 text-lg">{order.customerName}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                          {order.status}
                      </span>
                  </div>

                  <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                      <div>
                          <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                          <p className="font-extrabold text-slate-900 text-xl">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-1 text-brand-600 font-bold text-sm">
                          View Details <ChevronRight size={16} />
                      </div>
                  </div>
              </div>
          ))}
          {sortedOrders.length === 0 && (
              <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
                  No orders found.
              </div>
          )}
      </div>


      {/* Order Details Modal (Responsive) */}
      {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
              <div className="bg-white w-full sm:rounded-2xl sm:max-w-2xl overflow-hidden rounded-t-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
                        <span className="text-slate-400 text-sm">#{selectedOrder.id}</span>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div>
                              <h3 className="font-bold text-slate-700 mb-2">Customer & Shipping</h3>
                              <p className="font-medium text-slate-900">{selectedOrder.customerName}</p>
                              {selectedOrder.shippingAddress && (
                                <div className="text-sm text-slate-500 mt-1 flex items-start gap-2">
                                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p>{selectedOrder.shippingAddress.addressLine}</p>
                                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.zipCode}</p>
                                        <p className="font-bold">{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                </div>
                              )}
                          </div>
                          <div>
                               <h3 className="font-bold text-slate-700 mb-2">Order Status</h3>
                               <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(selectedOrder.status)}`}>
                                   {selectedOrder.status}
                               </span>
                               <p className="text-sm text-slate-500 mt-2">Ordered on {selectedOrder.date}</p>
                          </div>
                      </div>

                      <h3 className="font-bold text-slate-700 mb-4">Items Ordered</h3>
                      <div className="space-y-4 mb-6">
                          {selectedOrder.items && selectedOrder.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                                  <img src={item.productImage} className="w-12 h-12 rounded-lg object-cover bg-slate-200" alt="" />
                                  <div className="flex-1">
                                      <p className="font-bold text-slate-900 text-sm line-clamp-1">{item.productName}</p>
                                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                  </div>
                                  <span className="font-medium text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                          ))}
                      </div>

                      <div className="border-t border-slate-100 pt-4 space-y-2">
                          <div className="flex justify-between text-slate-600 text-sm">
                              <span>Subtotal</span>
                              <span>${selectedOrder.subtotal?.toFixed(2) || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-slate-600 text-sm">
                              <span>Tax</span>
                              <span>${selectedOrder.tax?.toFixed(2) || 'N/A'}</span>
                          </div>
                           <div className="flex justify-between text-slate-600 text-sm">
                              <span>Shipping</span>
                              <span>${selectedOrder.shippingCost?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between font-bold text-slate-900 text-lg pt-2">
                              <span>Total</span>
                              <span>${selectedOrder.total.toFixed(2)}</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
