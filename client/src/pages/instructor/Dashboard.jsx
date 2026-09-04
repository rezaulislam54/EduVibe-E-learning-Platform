import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/common/Loader';
import { RatingStars } from '../../components/common/RatingStars';
import { Badge } from '../../components/common/Badge';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  DollarSign,
  Star,
  BookOpen,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchInstructorHub = async () => {
    try {
      setLoading(true);
      const res = await api.get('/courses/instructor/my-courses');
      setStats(res.stats);
      setCourses(res.courses || []);
    } catch (err) {
      console.error('Failed to load instructor courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorHub();
  }, []);

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      if (stats) {
        setStats({ ...stats, totalCourses: stats.totalCourses - 1 });
      }
    } catch (err) {
      alert(err.message || 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loader text="Loading Instructor Hub..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
        <div className="space-y-1.5">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
            Instructor Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor student enrollments, course analytics, and publish new masterclasses.
          </p>
        </div>

        <Link
          to="/instructor/create-course"
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-105 transition-all whitespace-nowrap"
        >
          <PlusCircle size={16} />
          Create New Course
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            val: `$${Number(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'text-emerald-500 bg-emerald-50',
          },
          {
            label: 'Enrolled Students',
            val: (stats?.totalStudents || 0).toLocaleString(),
            icon: Users,
            color: 'text-indigo-600 bg-indigo-50',
          },
          {
            label: 'Average Rating',
            val: `${stats?.avgRating || 4.9} ★`,
            icon: Star,
            color: 'text-amber-500 bg-amber-50',
          },
          {
            label: 'Active Courses',
            val: (stats?.totalCourses || 0).toString(),
            icon: BookOpen,
            color: 'text-purple-600 bg-purple-50',
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

      {/* Courses Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            My Courses ({courses.length})
          </h2>
          <Link
            to="/instructor/create-course"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            + Add Course
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-3.5 px-6 font-bold">Course</th>
                  <th className="py-3.5 px-6 font-bold">Category</th>
                  <th className="py-3.5 px-6 font-bold">Price</th>
                  <th className="py-3.5 px-6 font-bold">Students</th>
                  <th className="py-3.5 px-6 font-bold">Rating</th>
                  <th className="py-3.5 px-6 font-bold">Status</th>
                  <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'}
                          alt={course.title}
                          className="w-14 h-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div className="space-y-0.5 max-w-xs">
                          <Link
                            to={`/courses/${course._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 line-clamp-1"
                          >
                            {course.title}
                          </Link>
                          <p className="text-[10px] text-slate-400">
                            {course.sections?.length || 0} sections • {course.totalLessons || 0} lectures
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">
                      {course.category}
                    </td>
                    <td className="py-4 px-6">
                      {course.price === 0 ? (
                        <span className="text-emerald-600 font-bold">Free</span>
                      ) : (
                        <span className="font-bold text-slate-900">${course.discountPrice || course.price}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {(course.studentsEnrolled || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <RatingStars rating={course.rating} size={12} showNumber={true} />
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={
                          course.status === 'published'
                            ? 'success'
                            : course.status === 'pending'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="xs"
                      >
                        {course.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/courses/${course._id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Preview Course"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/instructor/edit-course/${course._id}`}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Course"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                          disabled={deletingId === course._id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Course"
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
          <div className="text-center py-16 p-6 space-y-3">
            <BookOpen size={32} className="text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No courses created yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Start building your first course syllabus and reach ambitious developers worldwide.
            </p>
            <Link
              to="/instructor/create-course"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Create Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
