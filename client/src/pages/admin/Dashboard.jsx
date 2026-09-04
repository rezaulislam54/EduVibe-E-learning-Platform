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
  Video,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'users' | 'guide'

  // Search & Filter state for course table
  const [courseSearch, setCourseSearch] = useState('');
  const [courseStatusFilter, setCourseStatusFilter] = useState('all');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [showGuide, setShowGuide] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/courses'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.stats);
      setCourses(coursesRes.courses || []);
      setUsersList(usersRes.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateCourseStatus = async (courseId, newStatus) => {
    try {
      await api.put(`/admin/courses/${courseId}/status`, {
        status: newStatus,
      });
      setCourses(
        courses.map((c) => (c._id === courseId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      alert(err.message || 'Failed to update course status');
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete the course "${title}"? This will also remove all associated enrollments and reviews.`
      )
    ) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      if (stats) {
        setStats((prev) => ({
          ...prev,
          courses: {
            ...prev.courses,
            total: prev.courses.total - 1,
          },
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, {
        role: newRole,
      });
      setUsersList(
        usersList.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      (c.instructor?.name &&
        c.instructor.name.toLowerCase().includes(courseSearch.toLowerCase())) ||
      c.category.toLowerCase().includes(courseSearch.toLowerCase());

    const matchesStatus =
      courseStatusFilter === 'all' || c.status === courseStatusFilter;

    const matchesCategory =
      courseCategoryFilter === 'all' || c.category === courseCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return <Loader text="Loading Admin Management Console..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Banner with Direct Action Buttons */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-wider border border-indigo-400/30">
            <ShieldCheck size={14} /> Master Admin & Course Control Center
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            EduVibe System & Course Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Create new courses, manage existing curricula, moderate instructor submissions, and oversee platform users.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link
            to="/instructor/create-course"
            className="px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-105 transition-all"
          >
            <PlusCircle size={17} />
            <span>+ Create New Course</span>
          </Link>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5"
          >
            <HelpCircle size={15} className="text-indigo-400" />
            <span>{showGuide ? 'Hide Guide' : 'How to Add Courses'}</span>
          </button>
        </div>
      </div>

      {/* Visual Step-by-Step Guide Card (গাইড) */}
      {showGuide && (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/60 border-2 border-indigo-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-base">
                  How to Add & Manage Courses (কোর্স যুক্ত ও ম্যানেজ করার গাইড)
                </h2>
                <p className="text-xs text-slate-500">
                  Follow these 3 easy steps to create and publish full masterclasses
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                1. Click "+ Create New Course"
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                উপরের <strong className="text-indigo-600">+ Create New Course</strong> বাটনে চাপুন। কোর্সের Title, Subtitle, Category, Level, Price এবং Thumbnail ও Trailer Video লিংক দিন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                2. Build Curriculum & Lectures
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Curriculum & Videos</strong> ট্যাবে গিয়ে সেকশন বানান (e.g. Section 1: Intro) এবং প্রতি সেকশনে একাধিক লেকচার ভিডিও স্ট্রিমিং লিংক ও সময়সীমা যোগ করুন।
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-3 relative">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-slate-900">
                3. Publish & Manage Anytime
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Publish Course</strong> বাটনে চাপলেই লাইভ হয়ে যাবে। নিচের টেবিল থেকে যেকোনো সময় ✏️ <strong>Edit</strong>, 🗑️ <strong>Delete</strong> বা Status (Published/Draft/Pending) পরিবর্তন করতে পারবেন।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Platform Revenue',
            val: `$${Number(stats?.financials?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-500 bg-emerald-50',
          },
          {
            label: 'Total Registered Users',
            val: (stats?.users?.total || 0).toLocaleString(),
            icon: Users,
            color: 'text-indigo-600 bg-indigo-50',
          },
          {
            label: 'Total Courses Available',
            val: (stats?.courses?.total || courses.length || 0).toString(),
            icon: BookOpen,
            color: 'text-purple-600 bg-purple-50',
          },
          {
            label: 'Total Student Enrollments',
            val: (stats?.enrollments?.total || 0).toLocaleString(),
            icon: CheckCircle,
            color: 'text-amber-500 bg-amber-50',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block leading-tight">
                  {item.val}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Management Section with Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/70 p-3 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('courses')}
              className={`py-2.5 px-5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'courses'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen size={15} />
              <span>All Courses & Management ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`py-2.5 px-5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={15} />
              <span>User Accounts ({usersList.length})</span>
            </button>
          </div>

          {activeTab === 'courses' && (
            <Link
              to="/instructor/create-course"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <PlusCircle size={14} />
              <span>+ Add Course</span>
            </Link>
          )}
        </div>

        {/* Tab 1: Comprehensive Course Management Table */}
        {activeTab === 'courses' && (
          <div className="space-y-4 p-6">
            
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by course title, instructor, category..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              </div>

              {/* Status & Category Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <select
                    value={courseStatusFilter}
                    onChange={(e) => setCourseStatusFilter(e.target.value)}
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20"
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
                    className="text-xs font-bold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500/20"
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
                      <th className="py-3.5 px-6 font-bold">Status</th>
                      <th className="py-3.5 px-6 font-bold text-right">Manage & Actions</th>
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
                        <td className="py-4 px-6 text-slate-600 font-medium">
                          {c.category}
                        </td>
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
                            {/* View / Preview */}
                            <Link
                              to={`/courses/${c._id}`}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                              title="View Course Page"
                            >
                              <Eye size={15} />
                            </Link>

                            {/* Edit Course & Curriculum */}
                            <Link
                              to={`/instructor/edit-course/${c._id}`}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                              title="Edit Course & Curriculum"
                            >
                              <Edit size={15} />
                            </Link>

                            {/* Delete Course */}
                            <button
                              onClick={() => handleDeleteCourse(c._id, c.title)}
                              disabled={deletingId === c._id}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
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
                <p className="text-xs font-bold text-slate-700">No courses match your filter</p>
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

        {/* Tab 2: User Role Management */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto p-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-6 font-bold">User</th>
                  <th className="py-3.5 px-6 font-bold">Email</th>
                  <th className="py-3.5 px-6 font-bold">Current Role</th>
                  <th className="py-3.5 px-6 font-bold">Member Since</th>
                  <th className="py-3.5 px-6 font-bold text-right">Assign Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{u.email}</td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          u.role === 'admin'
                            ? 'danger'
                            : u.role === 'instructor'
                            ? 'secondary'
                            : 'primary'
                        }
                        size="xs"
                      >
                        {u.role?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                        className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-indigo-500/20"
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
