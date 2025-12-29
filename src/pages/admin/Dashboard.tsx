import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ShoppingCart, MessageSquare, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchAllCourses } from '../../services/coursesService';
import { supabase } from '../../lib/supabase';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { InfoBanner } from '../../components/admin/InfoBanner';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    failedOrders: 0,
    totalEnquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        courses,
        { count: usersCount },
        { data: orders },
        { count: enquiriesCount },
      ] = await Promise.all([
        fetchAllCourses(),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('payment_status'),
        supabase.from('course_enquiries').select('*', { count: 'exact', head: true }),
      ]);

      const pendingOrders = orders?.filter(o => o.payment_status === 'pending').length || 0;
      const completedOrders = orders?.filter(o => o.payment_status === 'completed').length || 0;
      const failedOrders = orders?.filter(o => o.payment_status === 'failed').length || 0;

      setStats({
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.status === 'published').length,
        totalUsers: usersCount || 0,
        totalOrders: orders?.length || 0,
        pendingOrders,
        completedOrders,
        failedOrders,
        totalEnquiries: enquiriesCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Dashboard"
        subtitle="Overview of your courses and performance"
        action={
          <Link
            to="/admin/courses/new"
            className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Add Course</span>
            <span className="md:hidden">Add</span>
          </Link>
        }
      />

      <div className="px-4 lg:px-8 py-6">
        {showBanner && (
          <InfoBanner
            type="info"
            message="Pending orders that haven't been processed yet will automatically be added to your next report in the same currency as the orders."
            onDismiss={() => setShowBanner(false)}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              <p className="text-xs text-gray-500 mt-1">orders</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Approved</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              <p className="text-xs text-gray-500 mt-1">orders</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Declined</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.failedOrders}</p>
              <p className="text-xs text-gray-500 mt-1">orders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <Link
            to="/admin/courses"
            className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs uppercase font-medium text-gray-500 mb-1">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs uppercase font-medium text-gray-500 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs uppercase font-medium text-gray-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </Link>

          <Link
            to="/admin/enquiries"
            className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs uppercase font-medium text-gray-500 mb-1">Enquiries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalEnquiries}</p>
          </Link>
        </div>

        <Link
          to="/admin/courses/new"
          className="sm:hidden fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-20"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};
