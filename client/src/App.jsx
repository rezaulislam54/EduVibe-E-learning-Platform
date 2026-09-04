import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RoleRoute } from './components/common/RoleRoute';

// Pages
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetails } from './pages/CourseDetails';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MyLearning } from './pages/student/MyLearning';
import { CoursePlayer } from './pages/student/CoursePlayer';
import { Certificates } from './pages/student/Certificates';
import { Checkout } from './pages/student/Checkout';
import { InstructorDashboard } from './pages/instructor/Dashboard';
import { CreateCourse } from './pages/instructor/CreateCourse';
import { EditCourse } from './pages/instructor/EditCourse';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

// Layout wrapper to conditionally hide Navbar/Footer in immersive learning room
const AppLayout = () => {
  const location = useLocation();
  const isLearningRoom = location.pathname.startsWith('/learn/');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {!isLearningRoom && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route
            path="/my-learning"
            element={
              <ProtectedRoute>
                <MyLearning />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn/:courseId"
            element={
              <ProtectedRoute>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/:courseId"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          {/* Instructor Protected Routes */}
          <Route
            path="/instructor/dashboard"
            element={
              <RoleRoute allowedRoles={['instructor', 'admin']}>
                <InstructorDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/instructor/create-course"
            element={
              <RoleRoute allowedRoles={['instructor', 'admin']}>
                <CreateCourse />
              </RoleRoute>
            }
          />
          <Route
            path="/instructor/edit-course/:id"
            element={
              <RoleRoute allowedRoles={['instructor', 'admin']}>
                <EditCourse />
              </RoleRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          {/* User Account */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isLearningRoom && <Footer />}
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppLayout />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
