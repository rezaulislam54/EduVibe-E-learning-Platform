import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  LifeBuoy,
  FileText
} from 'lucide-react';

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Technical & Platform Support',
    priority: 'Normal',
    subject: '',
    message: ''
  });

  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomTicketId = `TK-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket({
      id: randomTicketId,
      ...formData,
      timestamp: new Date().toLocaleString()
    });
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
            <LifeBuoy size={14} /> 24/7 Global Support
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Have questions about a course, technical issues, billing, or enterprise team training? We're here to assist you.
          </p>
        </div>
      </section>

      {/* Main Grid: Info Cards + Support Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Direct Channels & Hours */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-lg space-y-6">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="text-indigo-600" size={18} /> Direct Channels
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong className="block text-slate-900 font-bold">Student Support</strong>
                    <span className="text-slate-500">support@eduvibe.learn</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Mail className="text-emerald-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong className="block text-slate-900 font-bold">Enterprise & Teams</strong>
                    <span className="text-slate-500">enterprise@eduvibe.learn</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="text-sky-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong className="block text-slate-900 font-bold">Phone Support (US & CA)</strong>
                    <span className="text-slate-500">+1 (800) 555-0199</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="text-amber-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong className="block text-slate-900 font-bold">Live Support Hours</strong>
                    <span className="text-slate-500">Mon - Fri: 24 Hours | Sat - Sun: 9AM - 6PM UTC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Offices */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-lg space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
                <MapPin size={16} /> Global Headquarters
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <strong className="block text-white font-semibold">San Francisco Hub</strong>
                  <span>450 Mission Street, Suite 1200, San Francisco, CA 94105</span>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <strong className="block text-white font-semibold">London Tech Center</strong>
                  <span>100 Bishopsgate, London EC2N 4AG, United Kingdom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Support Ticket Generator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl">
              {submittedTicket ? (
                <div className="text-center py-10 space-y-5">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={32} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Support Ticket Logged
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">
                      Ticket #{submittedTicket.id}
                    </h3>
                  </div>
                  
                  <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Submitted By:</span>
                      <span className="font-bold text-slate-800">{submittedTicket.name} ({submittedTicket.email})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Category:</span>
                      <span className="font-bold text-indigo-600">{submittedTicket.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Priority:</span>
                      <span className={`font-bold ${submittedTicket.priority === 'Urgent' ? 'text-rose-600' : 'text-slate-800'}`}>
                        {submittedTicket.priority}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Subject:</span>
                      <span className="font-bold text-slate-800">{submittedTicket.subject}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                      Our engineers usually respond to <strong className="text-slate-700">{submittedTicket.priority}</strong> priority inquiries within 2-4 hours.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormData({
                        name: '',
                        email: '',
                        category: 'Technical & Platform Support',
                        priority: 'Normal',
                        subject: '',
                        message: ''
                      });
                    }}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                  >
                    Open Another Support Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Submit a Support Request</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill in the details and our dedicated support engineers will investigate immediately.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Account Email</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Inquiry Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                      >
                        <option>Technical & Platform Support</option>
                        <option>Course Access & Video Playback</option>
                        <option>Billing, Invoices & Refunds</option>
                        <option>Certificate Verification Issues</option>
                        <option>Enterprise Team Plan Inquiry</option>
                        <option>Instructor Partnership</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Priority Level</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                      >
                        <option>Normal (Response in 12h)</option>
                        <option>High (Response in 4h)</option>
                        <option>Urgent (Blocking learning)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief summary of your issue or question"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Detailed Message</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Describe what happened, error messages, or details of your request..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                  >
                    <Send size={16} /> Submit Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick FAQ Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Help Center FAQs
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Support Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              q: 'How long do I have access to purchased courses?',
              a: 'All courses on EduVibe come with lifetime access, including all future video updates, project codebase revisions, and Q&A community access.'
            },
            {
              q: 'Can I get a refund if the course is not for me?',
              a: 'Yes! We offer a 30-day no-questions-asked refund guarantee on all courses if you have watched less than 50% of the course material.'
            },
            {
              q: 'Are certificates accredited and shareable on LinkedIn?',
              a: 'Yes! Every certificate has a unique cryptographic hash ID and permanent URL that can be directly embedded into your LinkedIn profile or resume.'
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-start gap-2">
                <HelpCircle size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
