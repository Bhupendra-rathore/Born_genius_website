import React, { useState, useEffect } from 'react';
import { Search, ThumbsUp, CheckCircle, XCircle, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Toast } from '../../components/Toast';
import { AdminHeader } from '../../components/admin/AdminHeader';

interface CourseRequest {
  id: string;
  course_name: string;
  category: string;
  age_range: string;
  description: string;
  requester_name: string;
  requester_email: string;
  upvotes: number;
  status: string;
  admin_notes: string;
  created_at: string;
}

export const CourseRequestsList: React.FC = () => {
  const [requests, setRequests] = useState<CourseRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CourseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter]);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('course_requests')
        .select('*')
        .order('upvotes', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      setToast({ type: 'error', message: 'Failed to load course requests' });
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    if (searchTerm) {
      filtered = filtered.filter(
        (request) =>
          request.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((request) => request.status === statusFilter);
    }

    setFilteredRequests(filtered);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('course_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setToast({ type: 'success', message: `Request ${status}` });
      loadRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      setToast({ type: 'error', message: 'Failed to update status' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading course requests...</div>
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

      <AdminHeader
        title="Course Requests"
        subtitle="Manage course requests from users"
      />

      <div className="px-4 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
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
              <option value="reviewing">Reviewing</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Age Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Upvotes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No course requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{request.course_name}</div>
                          {request.description && (
                            <div className="text-xs text-gray-500">
                              {request.description.substring(0, 50)}...
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {request.category || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {request.age_range || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                          <ThumbsUp className="w-4 h-4 text-blue-600" />
                          {request.upvotes}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : request.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : request.status === 'reviewing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {request.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(request.id, 'approved')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => updateStatus(request.id, 'rejected')}
                                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:hidden space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
              No course requests found
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 mb-1">{request.course_name}</h3>
                  {request.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{request.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-1 text-gray-900">{request.category || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <span className="ml-1 text-gray-900">{request.age_range || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-900 font-medium">{request.upvotes}</span>
                    <span className="text-gray-500">upvotes</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-1 text-gray-900">{formatDate(request.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : request.status === 'reviewing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {request.status}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateStatus(request.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'rejected')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
