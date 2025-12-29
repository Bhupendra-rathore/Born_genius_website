import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Toast } from '../../components/Toast';
import { AdminHeader } from '../../components/admin/AdminHeader';

interface Order {
  id: string;
  course_title: string;
  course_category: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  final_price: number;
  currency: string;
  payment_status: string;
  order_status: string;
  created_at: string;
}

export const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setToast({ type: 'error', message: 'Failed to load orders' });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.course_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.payment_status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPrice = (price: number, currency: string) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <AdminHeader title="Orders" subtitle="Manage all course orders" />

      <div className="px-4 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`${showFilters ? 'block' : 'hidden'} sm:block px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">

                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      {orders.length === 0 ? '2 records' : 'No orders found'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {order.course_title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatPrice(order.final_price, order.currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.course_category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              order.payment_status === 'completed'
                                ? 'bg-green-500'
                                : order.payment_status === 'failed'
                                ? 'bg-red-500'
                                : 'bg-blue-500'
                            }`}
                          />
                          <span className="text-sm text-gray-900 capitalize">{order.payment_status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <span>{filteredOrders.length} records</span>
            <div className="flex items-center gap-2">
              <span>Rows</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
              No orders found
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{order.course_title}</h3>
                    <p className="text-sm text-gray-500">{order.course_category}</p>
                  </div>
                  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Customer</span>
                    <span className="text-gray-900 font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount</span>
                    <span className="text-gray-900 font-medium">{formatPrice(order.final_price, order.currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900">{formatDate(order.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      order.payment_status === 'completed'
                        ? 'bg-green-500'
                        : order.payment_status === 'failed'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <span className="text-sm text-gray-900 capitalize">{order.payment_status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
