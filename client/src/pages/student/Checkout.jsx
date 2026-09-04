import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader } from '../../components/common/Loader';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

export const Checkout = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Simulated card form fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Alex Portfolio Tester');

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.course);
      } catch (err) {
        console.error('Failed to load course for checkout:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Create payment intent
      const intentRes = await api.post('/payments/create-intent', { courseId });

      // 2. Simulate payment processing delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 3. Verify payment on backend & enroll student
      const verifyRes = await api.post('/payments/verify', {
        courseId,
        paymentId: intentRes.paymentIntentId || `PAY_${Date.now()}`,
        paymentMethod: 'stripe',
        amountPaid: intentRes.amount,
      });

      setPaymentSuccess(true);

      // Auto redirect to classroom after 2 seconds
      setTimeout(() => {
        navigate(`/learn/${courseId}`);
      }, 2000);
    } catch (err) {
      alert(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Loader text="Preparing secure checkout..." />;
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p>Course not found</p>
      </div>
    );
  }

  const price = course.discountPrice > 0 ? course.discountPrice : course.price;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {paymentSuccess ? (
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-emerald-200 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Payment Completed!
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You are officially enrolled in <strong className="text-slate-900">{course.title}</strong>. Redirecting you to the interactive classroom...
          </p>
          <div className="pt-2">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Payment Method Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  Secure Checkout
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  Payment Information
                </h2>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                <Lock size={12} /> 256-Bit SSL
              </div>
            </div>

            {/* Test Mode Banner */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <span className="font-bold text-indigo-950">
                  Portfolio / Test Card Mode Active
                </span>
                <p className="text-indigo-800 text-[11px] leading-relaxed">
                  Pre-filled test credentials allow instant, frictionless end-to-end checkout testing.
                </p>
              </div>
            </div>

            {/* Card details form */}
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium"
                    required
                  />
                  <CreditCard size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Security Code (CVC)
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Purchase • ${price}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} /> Encrypted Transaction
              </span>
              <span>•</span>
              <span>Instant Access</span>
              <span>•</span>
              <span>30-Day Guarantee</span>
            </div>
          </div>

          {/* Right: Order Summary Card (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl">
            <h3 className="font-bold text-base text-white border-b border-slate-800 pb-4">
              Order Summary
            </h3>

            {/* Course Summary Item */}
            <div className="flex items-start gap-4">
              <img
                src={
                  course.thumbnail ||
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'
                }
                alt={course.title}
                className="w-20 h-14 object-cover rounded-xl shrink-0"
              />
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-white line-clamp-2 leading-snug">
                  {course.title}
                </h4>
                <p className="text-[11px] text-slate-400">
                  By {course.instructor?.name || 'EduVibe Instructor'}
                </p>
              </div>
            </div>

            {/* Pricing Calculation */}
            <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <span>Original Price</span>
                <span className="font-semibold">${course.price}</span>
              </div>
              {course.discountPrice > 0 && (
                <div className="flex items-center justify-between text-emerald-400">
                  <span>Special Discount</span>
                  <span>-${(course.price - course.discountPrice).toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-400">
                <span>Platform Processing Fee</span>
                <span>$0.00 (Free)</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-white border-t border-slate-800 pt-3">
                <span>Total Due Today</span>
                <span className="text-xl text-emerald-400">${price}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
