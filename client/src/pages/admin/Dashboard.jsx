import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/common/Loader';
import { Badge } from '../../components/common/Badge';
import { RatingStars } from '../../components/common/RatingStars';
import {
  ShieldCheck,
  Users,
  BookOpen,
  DollarSign,
  CheckCircle,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Layers,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Key,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  AlertTriangle,
  UserPlus,
  RefreshCw,
  Clock,
  Award,
  ChevronRight,
  TrendingUp,
  X,
  Save,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState('courses'); 
  // 'courses' | 'users' | 'enrollments' | 'transactions' | 'reviews' | 'analytics' | 'tools'

  // Search & Filters
  const [courseSearch, setCourseSearch] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState('all');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('all');

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Modals state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(null); // user object
  const [showEditUserModal, setShowEditUserModal] = useState(null); // user object
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    headline: '',
  });
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        coursesRes,
        usersRes,
        enrollmentsRes,
        transactionsRes,
        reviewsRes,
      ] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/courses'),
        api.get('/admin/users'),
        api.get('/admin/enrollments'),
        api.get('/admin/transactions'),
        api.get('/admin/reviews'),
      ]);

      setStats(statsRes.stats);
      setCourses(coursesRes.courses || []);
      setUsersList(usersRes.users || []);
      setEnrollments(enrollmentsRes.enrollments || []);
      setTransactions(transactionsRes.transactions || []);
      setReviewsList(reviewsRes.reviews || []);
    } catch (err) {
      console.error('Failed to load admin management data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const flashMessage = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // --- Course Handlers ---
  const handleUpdateCourseStatus = async (courseId, newStatus) => {
    try {
      await api.put(`/admin/courses/${courseId}/status`, { status: newStatus });
      setCourses((prev) =>
        prev.map((c) => (c._id === courseId ? { ...c, status: newStatus } : c))
      );
      flashMessage(`Course status changed to ${newStatus.toUpperCase()}`);
    } catch (err) {
      alert(err.message || 'Failed to update course status');
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"?`)) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      flashMessage(`Course "${title}" permanently removed`);
    } catch (err) {
      alert(err.message || 'Failed to delete course');
    }
  };

  // --- User Handlers ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      alert('Please fill in required fields');
      return;
    }
    try {
      setActionLoading(true);
      const res = await api.post('/admin/users', newUserData);
      setUsersList((prev) => [res.user, ...prev]);
      setShowAddUserModal(false);
      setNewUserData({ name: '', email: '', password: '', role: 'student', headline: '' });
      flashMessage(res.message || 'User created successfully');
    } catch (err) {
      alert(err.message || 'Failed to create user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
      flashMessage(`User role updated to ${newRole.toUpperCase()}`);
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPasswordInput || resetPasswordInput.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    try {
      setActionLoading(true);
      await api.put(`/admin/users/${showResetPasswordModal._id}/reset-password`, {
        newPassword: resetPasswordInput,
      });
      setShowResetPasswordModal(null);
      setResetPasswordInput('');
      flashMessage('Password reset successfully');
    } catch (err) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user account "${userName}"?`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsersList((prev) => prev.filter((u) => u._id !== userId));
      flashMessage(`User "${userName}" removed from system`);
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  // --- Enrollment Handlers ---
  const handleRevokeEnrollment = async (enrollmentId) => {
    if (!window.confirm('Revoke course access for this student?')) return;
    try {
      await api.delete(`/admin/enrollments/${enrollmentId}`);
      setEnrollments((prev) => prev.filter((e) => e._id !== enrollmentId));
      flashMessage('Enrollment access revoked');
    } catch (err) {
      alert(err.message || 'Failed to revoke enrollment');
    }
  };

  // --- Transaction Handlers ---
  const handleToggleRefund = async (orderId) => {
    try {
      const res = await api.put(`/admin/transactions/${orderId}/refund`);
      setTransactions((prev) =>
        prev.map((t) => (t._id === orderId ? res.order : t))
      );
      flashMessage(res.message || 'Transaction status updated');
    } catch (err) {
      alert(err.message || 'Failed to update transaction');
    }
  };

  // --- Review Moderation Handlers ---
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${reviewId}`);
      setReviewsList((prev) => prev.filter((r) => r._id !== reviewId));
      flashMessage('Review removed');
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  // --- Reseed Database ---
  const handleReseed = async () => {
    if (
      !window.confirm(
        'Warning: This will reset and reload all sample demo courses, instructors, reviews and enrollments. Continue?'
      )
    ) {
      return;
    }
    try {
      setActionLoading(true);
      const res = await api.post('/admin/reseed');
      await fetchAdminData();
      flashMessage(res.message || 'Database successfully refreshed!');
    } catch (err) {
      alert(err.message || 'Failed to reset database');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter computations
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.instructor?.name?.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.category?.toLowerCase().includes(courseSearch.toLowerCase());

    const matchesStatus =
      courseStatusFilter === 'all' || c.status === courseStatusFilter;
    const matchesCategory =
      courseCategoryFilter === 'all' || c.category === courseCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <Loader text="Loading Master Admin Management Console..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Fast Control Toolbar */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-wider border border-indigo-400/30">
              <ShieldCheck size={14} /> Master Administrator Console
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            EduVibe Enterprise Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Full administrative control: Manage courses, register users, inspect live student progress, audit payment revenues, and maintain platform integrity.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          <Link
            to="/instructor/create-course"
            className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <PlusCircle size={16} />
            <span>+ Create Course</span>
          </Link>

          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <UserPlus size={15} className="text-indigo-400" />
            <span>+ Add User</span>
          </button>

          <button
            onClick={handleReseed}
            disabled={actionLoading}
            className="px-4 py-3 bg-slate-800 hover:bg-rose-900/50 text-rose-300 border border-slate-700 hover:border-rose-500/40 font-bold text-xs rounded-2xl flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Reset Database to Clean Sample State"
          >
            <RefreshCw size={15} className={actionLoading ? 'animate-spin' : ''} />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Floating Status Notification Toast */}
      {statusMessage && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage('')} className="text-emerald-600 hover:text-emerald-900">
            <X size={15} />
          </button>
        </div>
      )}

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Platform Revenue',
            val: `$${Number(stats?.financials?.totalRevenue || 0).toLocaleString()}`,
            sub: `${stats?.financials?.totalOrders || 0} Paid Orders`,
            icon: DollarSign,
            color: 'text-emerald-500 bg-emerald-50',
          },
          {
            label: 'Total Registered Users',
            val: (stats?.users?.total || usersList.length || 0).toLocaleString(),
            sub: `${stats?.users?.students || 0} Students • ${stats?.users?.instructors || 0} Instructors`,
            icon: Users,
            color: 'text-indigo-600 bg-indigo-50',
          },
          {
            label: 'Total Courses Available',
            val: (stats?.courses?.total || courses.length || 0).toString(),
            sub: `${stats?.courses?.published || 0} Published • ${stats?.courses?.pending || 0} Pending`,
            icon: BookOpen,
            color: 'text-purple-600 bg-purple-50',
          },
          {
            label: 'Active Enrollments',
            val: (stats?.enrollments?.total || enrollments.length || 0).toLocaleString(),
            sub: `${stats?.enrollments?.completed || 0} Graduated (${stats?.enrollments?.completionRate || 0}%)`,
            icon: Award,
            color: 'text-amber-500 bg-amber-50',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">{item.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon size={18} />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 block leading-tight">
                  {item.val}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Module Navigation Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Module Tab Selector Bar */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/70 p-2 gap-1.5">
          {[
            { id: 'courses', label: 'Course Management', count: courses.length, icon: BookOpen },
            { id: 'users', label: 'User Directory', count: usersList.length, icon: Users },
            { id: 'enrollments', label: 'Student Progress', count: enrollments.length, icon: Award },
            { id: 'transactions', label: 'Invoices & Orders', count: transactions.length, icon: CreditCard },
            { id: 'reviews', label: 'Reviews & Ratings', count: reviewsList.length, icon: MessageSquare },
            { id: 'analytics', label: 'Platform Analytics', count: null, icon: BarChart3 },
            { id: 'tools', label: 'Maintenance Tools', count: null, icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ----------------- TAB 1: COURSES MANAGEMENT ----------------- */}
        {activeTab === 'courses' && (
          <div className="space-y-4 p-6">
            
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search courses by title, category, instructor..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                />
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <select
                    value={courseStatusFilter}
                    onChange={(e) => setCourseStatusFilter(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="pending">Pending</option>
                    <option value="draft">Draft</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Category:</span>
                  <select
                    value={courseCategoryFilter}
                    onChange={(e) => setCourseCategoryFilter(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
                  >
                    <option value="all">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="Design & UI/UX">Design & UI/UX</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Mobile Development">Mobile Development</option>
                  </select>
                </div>

                <Link
                  to="/instructor/create-course"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <PlusCircle size={14} /> Add Course
                </Link>
              </div>
            </div>

            {/* Courses Table */}
            {filteredCourses.length > 0 ? (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="py-3.5 px-6 font-bold">Course</th>
                      <th className="py-3.5 px-6 font-bold">Instructor</th>
                      <th className="py-3.5 px-6 font-bold">Category</th>
                      <th className="py-3.5 px-6 font-bold">Price</th>
                      <th className="py-3.5 px-6 font-bold">Students</th>
                      <th className="py-3.5 px-6 font-bold">Status Switcher</th>
                      <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCourses.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'}
                              alt={c.title}
                              className="w-12 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                            />
                            <div className="space-y-0.5 max-w-xs">
                              <Link
                                to={`/courses/${c._id}`}
                                className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                              >
                                {c.title}
                              </Link>
                              <p className="text-[10px] text-slate-400">
                                {c.sections?.length || 0} sections • {c.totalLessons || 0} lectures
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700">
                          {c.instructor?.name || 'Instructor'}
                        </td>
                        <td className="py-4 px-6 text-slate-600 font-medium">{c.category}</td>
                        <td className="py-4 px-6 font-bold">
                          {c.price === 0 ? (
                            <span className="text-emerald-600">Free</span>
                          ) : (
                            <span className="text-slate-900">${c.discountPrice || c.price}</span>
                          )}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700">
                          {(c.studentsEnrolled || 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={c.status}
                            onChange={(e) => handleUpdateCourseStatus(c._id, e.target.value)}
                            className={`text-xs font-extrabold rounded-lg px-2.5 py-1 border transition-colors ${
                              c.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : c.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : c.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <option value="published">PUBLISHED</option>
                            <option value="pending">PENDING</option>
                            <option value="draft">DRAFT</option>
                            <option value="rejected">REJECTED</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              to={`/courses/${c._id}`}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                              title="Preview Public Page"
                            >
                              <Eye size={15} />
                            </Link>
                            <Link
                              to={`/instructor/edit-course/${c._id}`}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                              title="Edit Course & Curriculum"
                            >
                              <Edit size={15} />
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(c._id, c.title)}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Delete Course Permanently"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <BookOpen size={30} className="text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No courses match the criteria</p>
                <Link
                  to="/instructor/create-course"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                >
                  + Add New Course
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 2: USER MANAGEMENT ----------------- */}
        {activeTab === 'users' && (
          <div className="space-y-4 p-6">
            
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20"
                />
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Filter Role:</span>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Students</option>
                    <option value="instructor">Instructors</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus size={14} /> + New User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-6 font-bold">User</th>
                    <th className="py-3.5 px-6 font-bold">Email</th>
                    <th className="py-3.5 px-6 font-bold">Role</th>
                    <th className="py-3.5 px-6 font-bold">Headline</th>
                    <th className="py-3.5 px-6 font-bold">Joined</th>
                    <th className="py-3.5 px-6 font-bold text-right">User Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <span className="truncate max-w-[150px]">{u.name}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{u.email}</td>
                      <td className="py-4 px-6">
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2 py-0.5 border ${
                            u.role === 'admin'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : u.role === 'instructor'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          <option value="student">STUDENT</option>
                          <option value="instructor">INSTRUCTOR</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-slate-500 max-w-[180px] truncate">
                        {u.headline || 'Learner'}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setShowResetPasswordModal(u)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset User Password"
                          >
                            <Key size={15} />
                          </button>
                          {u._id !== user._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id, u.name)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete User Account"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: STUDENT ENROLLMENTS & PROGRESS ----------------- */}
        {activeTab === 'enrollments' && (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  All Student Enrollments & Course Progress ({enrollments.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Monitor completion status and generated verifiable diplomas
                </p>
              </div>
            </div>

            {enrollments.length > 0 ? (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="py-3.5 px-6 font-bold">Student</th>
                      <th className="py-3.5 px-6 font-bold">Course Title</th>
                      <th className="py-3.5 px-6 font-bold">Progress (%)</th>
                      <th className="py-3.5 px-6 font-bold">Completion Status</th>
                      <th className="py-3.5 px-6 font-bold">Certificate ID</th>
                      <th className="py-3.5 px-6 font-bold text-right">Revoke Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {enrollments.map((enr) => (
                      <tr key={enr._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <img
                              src={enr.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt={enr.user?.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div>
                              <p>{enr.user?.name || 'Student'}</p>
                              <p className="text-[10px] text-slate-400 font-normal">{enr.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-800 max-w-xs truncate">
                          {enr.course?.title || 'Enrolled Course'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  enr.progressPercentage === 100
                                    ? 'bg-emerald-500'
                                    : 'bg-indigo-600'
                                }`}
                                style={{ width: `${enr.progressPercentage || 0}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-slate-700">
                              {enr.progressPercentage || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {enr.isCompleted || enr.progressPercentage === 100 ? (
                            <Badge variant="success" size="xs">
                              GRADUATED (100%)
                            </Badge>
                          ) : (
                            <Badge variant="neutral" size="xs">
                              IN PROGRESS
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-indigo-600">
                          {enr.certificateId || '—'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleRevokeEnrollment(enr._id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-bold"
                            title="Revoke Student Access"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-8 text-center bg-slate-50 rounded-2xl">
                No active enrollments in the system.
              </p>
            )}
          </div>
        )}

        {/* ----------------- TAB 4: TRANSACTIONS & INVOICES ----------------- */}
        {activeTab === 'transactions' && (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Platform Payment Transactions & Invoices ({transactions.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Track all incoming Stripe and simulated checkout orders
                </p>
              </div>
            </div>

            {transactions.length > 0 ? (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                      <th className="py-3.5 px-6 font-bold">Transaction ID</th>
                      <th className="py-3.5 px-6 font-bold">Payer</th>
                      <th className="py-3.5 px-6 font-bold">Course Purchased</th>
                      <th className="py-3.5 px-6 font-bold">Amount</th>
                      <th className="py-3.5 px-6 font-bold">Payment Method</th>
                      <th className="py-3.5 px-6 font-bold">Date</th>
                      <th className="py-3.5 px-6 font-bold">Status</th>
                      <th className="py-3.5 px-6 font-bold text-right">Refund Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((t) => (
                      <tr key={t._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-slate-800">
                          {t.transactionId || t.paymentId}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900">
                          {t.user?.name || 'Customer'}
                        </td>
                        <td className="py-4 px-6 text-slate-700 max-w-xs truncate">
                          {t.course?.title || 'Course'}
                        </td>
                        <td className="py-4 px-6 font-black text-emerald-600">
                          ${t.amount}
                        </td>
                        <td className="py-4 px-6 uppercase font-bold text-slate-600">
                          {t.paymentMethod}
                        </td>
                        <td className="py-4 px-6 text-slate-400">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <Badge
                            variant={t.status === 'completed' ? 'success' : 'danger'}
                            size="xs"
                          >
                            {t.status?.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleToggleRefund(t._id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              t.status === 'completed'
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {t.status === 'completed' ? 'Issue Refund' : 'Reactivate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-8 text-center bg-slate-50 rounded-2xl">
                No transactions recorded yet.
              </p>
            )}
          </div>
        )}

        {/* ----------------- TAB 5: REVIEWS MODERATION ----------------- */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Reviews & Feedback Moderation ({reviewsList.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Review student ratings and remove inappropriate comments
                </p>
              </div>
            </div>

            {reviewsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewsList.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={rev.user?.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-xs text-slate-900">{rev.user?.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Course: {rev.course?.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <RatingStars rating={rev.rating} size={13} showNumber={true} />
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Delete Spam Review"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 p-8 text-center bg-slate-50 rounded-2xl">
                No reviews submitted yet.
              </p>
            )}
          </div>
        )}

        {/* ----------------- TAB 6: PLATFORM ANALYTICS ----------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 p-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Platform Intelligence & Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of course categories and learning metrics
              </p>
            </div>

            {/* Category distribution */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Courses by Technology Domain
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats?.categoryStats?.map((cat) => (
                  <div
                    key={cat._id}
                    className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-sm text-slate-900">{cat._id}</p>
                      <p className="text-xs text-slate-500">Active Curriculum</p>
                    </div>
                    <span className="text-2xl font-black text-indigo-600">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4">
              <h4 className="font-bold text-sm text-indigo-400">
                Financial Performance Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-xs text-slate-400">Total Net Inflow</span>
                  <p className="text-2xl font-black text-emerald-400">${stats?.financials?.totalRevenue}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Average Order Value</span>
                  <p className="text-2xl font-black text-white">${stats?.financials?.avgOrderValue}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400">Completed Orders</span>
                  <p className="text-2xl font-black text-white">{stats?.financials?.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 7: SYSTEM & DATABASE TOOLS ----------------- */}
        {activeTab === 'tools' && (
          <div className="space-y-6 p-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Platform Maintenance & Database Utilities
              </h3>
              <p className="text-xs text-slate-500">
                Perform zero-downtime database resets and seed generation
              </p>
            </div>

            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <AlertTriangle size={18} className="text-amber-600" />
                <span>1-Click Portfolio Demo Reset</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                If you or recruiters are testing course creation and deletions, you can instantly refresh the database back to clean, rich demo courses and verified sample users with a single click.
              </p>
              <button
                onClick={handleReseed}
                disabled={actionLoading}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                <RefreshCw size={14} className={actionLoading ? 'animate-spin' : ''} />
                <span>{actionLoading ? 'Resetting Data...' : 'Reset & Re-Seed Database'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- MODAL: ADD NEW USER ----------------- */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <UserPlus size={18} className="text-indigo-600" />
                Create New User Account
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="e.g. David Miller"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Initial Password (Min. 6 chars) *
                </label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Role Assignment *
                </label>
                <select
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="student">Student (Learner)</option>
                  <option value="instructor">Instructor (Course Author)</option>
                  <option value="admin">Administrator (Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: RESET PASSWORD ----------------- */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Key size={18} className="text-amber-500" />
                Reset User Password
              </h3>
              <button
                onClick={() => setShowResetPasswordModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Setting new password for: <strong className="text-slate-900">{showResetPasswordModal.name}</strong> ({showResetPasswordModal.email})
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  New Password (Min. 6 chars)
                </label>
                <input
                  type="password"
                  value={resetPasswordInput}
                  onChange={(e) => setResetPasswordInput(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(null)}
                  className="px-4 py-2.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Set New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
