import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Games } from './pages/Games';
import { Marketplace } from './pages/Marketplace';
import { Account } from './pages/Account';
import { CourseDetail } from './pages/CourseDetail';
import { Checkout } from './pages/Checkout';
import { Updates } from './pages/Updates';
import { ArticleDetail } from './pages/ArticleDetail';
import { BottomNav } from './components/BottomNav';
import { DesktopNav } from './components/DesktopNav';
import { MobileHeader } from './components/MobileHeader';

import { CourseList } from './pages/admin/CourseList';
import { CourseEditor } from './pages/admin/CourseEditor';
import { OrdersList } from './pages/admin/OrdersList';
import { UsersList } from './pages/admin/UsersList';
import { EnquiriesList } from './pages/admin/EnquiriesList';
import { CourseRequestsList } from './pages/admin/CourseRequestsList';

// ✅ ADD: Import InstallButton
import { InstallButton } from './components/InstallButton';

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin" element={<Checkout/>}>
          <Route index element={<CourseDetail />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/new" element={<CourseEditor />} />
          <Route path="courses/:id/edit" element={<CourseEditor />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="enquiries" element={<EnquiriesList />} />
          <Route path="course-requests" element={<CourseRequestsList />} />
        </Route>

        <Route path="*" element={
          <div className="min-h-screen bg-gray-50">
            <DesktopNav />
            <MobileHeader />
            <div className="max-w-[420px] md:max-w-none mx-auto bg-white md:bg-transparent min-h-screen md:min-h-0 shadow-xl md:shadow-none">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<Games />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/updates" element={<Updates />} />
                <Route path="/updates/:slug" element={<ArticleDetail />} />
                <Route path="/account" element={<Account />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/checkout/:id" element={<Checkout />} />
              </Routes>
              <BottomNav />
            </div>
          </div>
        } />
      </Routes>
      
      {/* ✅ ADD: Install Button (shows on all pages except admin) */}
      <InstallButton />
    </>
  );
}

export default App;
