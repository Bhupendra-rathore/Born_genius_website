import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MoreVertical, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Toast } from '../../components/Toast';
import { AdminHeader } from '../../components/admin/AdminHeader';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  country_code: string;
  child_age: number | null;
  source: string;
  status: string;
  created_at: string;
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, statusFilter]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setToast({ type: 'error', message: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading users...</div>
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

      <AdminHeader title="Users" subtitle="Manage all registered users" />

      <div className="px-4 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Child Age
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">

                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{user.name || 'N/A'}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.phone ? `${user.country_code} ${user.phone}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {user.child_age ? `${user.child_age} years` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.source}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(user.created_at)}
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
        </div>

        <div className="lg:hidden space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
              No users found
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{user.name || 'N/A'}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </p>
                  </div>
                  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  {user.phone && (
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Phone className="w-3 h-3 text-gray-500" />
                      {user.country_code} {user.phone}
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Child Age</span>
                    <span className="text-gray-900">{user.child_age ? `${user.child_age} years` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Source</span>
                    <span className="text-gray-900">{user.source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Joined</span>
                    <span className="text-gray-900">{formatDate(user.created_at)}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
