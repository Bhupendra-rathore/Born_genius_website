import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MoreVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Toast } from '../../components/Toast';
import { AdminHeader } from '../../components/admin/AdminHeader';

interface Enquiry {
  id: string;
  course_id: string;
  name: string;
  email: string;
  phone_number: string;
  country_code: string;
  preferred_timing: string;
  major_objection: string | null;
  other_objection_details: string | null;
  source: string;
  created_at: string;
}

export const EnquiriesList: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [enquiries, searchTerm]);

  const loadEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from('course_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error loading enquiries:', error);
      setToast({ type: 'error', message: 'Failed to load enquiries' });
    } finally {
      setLoading(false);
    }
  };

  const filterEnquiries = () => {
    let filtered = [...enquiries];

    if (searchTerm) {
      filtered = filtered.filter(
        (enquiry) =>
          enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.phone_number.includes(searchTerm)
      );
    }

    setFilteredEnquiries(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading enquiries...</div>
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
        title="Course Enquiries"
        subtitle="Manage all course enquiries from customers"
      />

      <div className="px-4 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Preferred Timing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Objection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">

                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-sm text-gray-900">{enquiry.name}</div>
                          <div className="text-xs text-gray-500">{enquiry.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enquiry.country_code} {enquiry.phone_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enquiry.preferred_timing}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {enquiry.major_objection || 'None'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{enquiry.source}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(enquiry.created_at)}
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
          {filteredEnquiries.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
              No enquiries found
            </div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{enquiry.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {enquiry.email}
                    </p>
                  </div>
                  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Phone className="w-3 h-3 text-gray-500" />
                    {enquiry.country_code} {enquiry.phone_number}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Preferred Timing</span>
                    <span className="text-gray-900">{enquiry.preferred_timing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Objection</span>
                    <span className="text-gray-900">{enquiry.major_objection || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Source</span>
                    <span className="text-gray-900">{enquiry.source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="text-gray-900">{formatDate(enquiry.created_at)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
