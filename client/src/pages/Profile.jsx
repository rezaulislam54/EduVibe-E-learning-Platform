import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import { Badge } from '../components/common/Badge';
import {
  User,
  Mail,
  Lock,
  Globe,
  Github,
  Linkedin,
  CreditCard,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security' | 'billing'

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Orders / billing history
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Status message
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setHeadline(user.headline || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      setWebsite(user.website || '');
      setGithub(user.github || '');
      setLinkedin(user.linkedin || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'billing') {
      const fetchOrders = async () => {
        try {
          setLoadingOrders(true);
          const res = await api.get('/payments/orders');
          setOrders(res.orders || []);
        } catch (err) {
          console.error('Failed to load orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await api.put('/auth/profile', {
        name,
        headline,
        bio,
        avatar,
        website,
        github,
        linkedin,
      });
      updateUser(res.user);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    setMessage('');
    setError('');

    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <img
          src={
            user?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          }
          alt={user?.name}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-50 shadow-md"
        />
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
            <Badge
              variant={
                user?.role === 'admin'
                  ? 'danger'
                  : user?.role === 'instructor'
                  ? 'secondary'
                  : 'primary'
              }
              size="xs"
            >
              {user?.role?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <p className="text-xs font-semibold text-indigo-600">
            {user?.headline || 'Tech Learner & Innovator'}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            setActiveTab('profile');
            setMessage('');
            setError('');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <User size={14} /> Profile Settings
        </button>

        <button
          onClick={() => {
            setActiveTab('security');
            setMessage('');
            setError('');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Lock size={14} /> Password & Security
        </button>

        <button
          onClick={() => {
            setActiveTab('billing');
            setMessage('');
            setError('');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'billing'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CreditCard size={14} /> Invoices & Purchase History
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} /> {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          {error}
        </div>
      )}

      {/* Tab 1: Profile Form */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleUpdateProfile}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Professional Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Bio / About Me
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Globe size={13} /> Website
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Github size={13} /> GitHub Profile
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
                <Linkedin size={13} /> LinkedIn Profile
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'security' && (
        <form
          onSubmit={handleChangePassword}
          className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-xl"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              New Password (Min. 6 chars)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      )}

      {/* Tab 3: Billing & Invoices */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">
              Purchased Invoices & Receipts
            </h3>
          </div>

          {loadingOrders ? (
            <Loader text="Loading invoice records..." />
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-6 font-bold">Transaction ID</th>
                    <th className="py-3.5 px-6 font-bold">Course</th>
                    <th className="py-3.5 px-6 font-bold">Amount</th>
                    <th className="py-3.5 px-6 font-bold">Payment Method</th>
                    <th className="py-3.5 px-6 font-bold">Date</th>
                    <th className="py-3.5 px-6 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">
                        {ord.transactionId || ord.paymentId}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {ord.course?.title || 'Course Enrollment'}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-600">
                        ${ord.amount}
                      </td>
                      <td className="py-4 px-6 uppercase font-medium text-slate-600">
                        {ord.paymentMethod}
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="success" size="xs">
                          {ord.status?.toUpperCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-slate-400">
              No purchase orders found on your account.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
