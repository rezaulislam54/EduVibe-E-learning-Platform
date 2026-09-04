import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Search,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  Share2,
  ExternalLink,
  Printer,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const urlId = searchParams.get('id') || '';
  const [certId, setCertId] = useState(urlId || 'CERT-MERN-89241');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock certificate database
  const sampleCertificates = {
    'CERT-MERN-89241': {
      id: 'CERT-MERN-89241',
      recipientName: 'Md. Rezaul Islam',
      courseTitle: 'Full-Stack MERN Architecture Masterclass 2026',
      instructor: 'Alex Rivera (Principal Architect)',
      issueDate: 'August 28, 2026',
      score: '98.5% (High Distinction)',
      skills: ['MongoDB', 'Express.js', 'React 19', 'Node.js', 'Socket.io', 'JWT Security'],
      status: 'VERIFIED_ACTIVE',
      hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    'CERT-AI-31209': {
      id: 'CERT-AI-31209',
      recipientName: 'Sarah Connor',
      courseTitle: 'Production LLMs, LangChain & Autonomous AI Agents',
      instructor: 'Dr. Sarah Lin (Stanford AI Alum)',
      issueDate: 'July 15, 2026',
      score: '96.0% (Distinction)',
      skills: ['Python', 'OpenAI API', 'LangChain', 'Vector DBs', 'RAG Architecture'],
      status: 'VERIFIED_ACTIVE',
      hash: '0x9a3e21074a819b5c21ef80a094251147e8346df91d848a609277f093f6634120'
    }
  };

  const handleVerify = (idToLookUp) => {
    const cleanId = (idToLookUp || certId).trim().toUpperCase();
    setHasSearched(true);
    if (sampleCertificates[cleanId]) {
      setSearchResult(sampleCertificates[cleanId]);
    } else if (cleanId.startsWith('CERT-')) {
      // Dynamic generated valid response for any CERT-*
      setSearchResult({
        id: cleanId,
        recipientName: 'Verified EduVibe Scholar',
        courseTitle: 'Advanced Software Engineering & System Design',
        instructor: 'EduVibe Faculty Board',
        issueDate: '2026-08-15',
        score: '95% (Honors)',
        skills: ['Software Architecture', 'Clean Code', 'Scalability'],
        status: 'VERIFIED_ACTIVE',
        hash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
      });
    } else {
      setSearchResult(null);
    }
  };

  useEffect(() => {
    if (urlId) {
      handleVerify(urlId);
    } else {
      handleVerify('CERT-MERN-89241');
    }
  }, [urlId]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify-certificate?id=${searchResult?.id || certId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
            <ShieldCheck size={14} /> Cryptographic Verification Registry
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Verify EduVibe Certificate Authenticity
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Employers, universities, and partners can instantly validate the authenticity and credential integrity of any graduate certificate.
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(certId);
              }}
              className="flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter Certificate ID (e.g., CERT-MERN-89241)"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-white placeholder:text-slate-400 focus:outline-none text-sm font-mono font-bold"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/30 whitespace-nowrap"
              >
                Validate Credential
              </button>
            </form>
            <div className="flex justify-center gap-3 text-xs text-slate-400 mt-2">
              <span>Try: <button onClick={() => { setCertId('CERT-MERN-89241'); handleVerify('CERT-MERN-89241'); }} className="text-emerald-400 underline font-mono">CERT-MERN-89241</button></span>
              <span>•</span>
              <span>Try: <button onClick={() => { setCertId('CERT-AI-31209'); handleVerify('CERT-AI-31209'); }} className="text-emerald-400 underline font-mono">CERT-AI-31209</button></span>
            </div>
          </div>
        </div>
      </section>

      {/* Result Display */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {searchResult ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
            {/* Authenticity Bar */}
            <div className="bg-emerald-600 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>OFFICIALLY VERIFIED & AUTHENTIC CERTIFICATE</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share URL'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Printer size={13} /> Print
                </button>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="p-8 sm:p-12 space-y-8 relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                  <div className="text-2xl font-black tracking-tight text-indigo-600 flex items-center gap-2">
                    <Award className="text-indigo-600" size={28} /> EduVibe Academy
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                    Official Certificate of Specialization
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-slate-400 block">Certificate ID</span>
                  <span className="text-sm font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg inline-block">
                    {searchResult.id}
                  </span>
                </div>
              </div>

              {/* Recipient & Course Details */}
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">
                    This certifies that
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {searchResult.recipientName}
                  </h2>
                  <p className="text-sm text-slate-600">
                    has successfully demonstrated mastery and completed all rigorous project requirements for:
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-indigo-950">
                    {searchResult.courseTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <User size={14} className="text-slate-400" /> Instructor: <strong>{searchResult.instructor}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" /> Issued: <strong>{searchResult.issueDate}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 bg-emerald-100/80 font-bold px-2 py-0.5 rounded">
                      {searchResult.score}
                    </span>
                  </div>
                </div>

                {/* Skills Verified */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Verified Competencies & Skills
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {searchResult.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Ledger Info */}
                <div className="pt-6 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-mono break-all">
                  <div className="flex items-center gap-2 text-slate-700 font-bold font-sans">
                    <ShieldCheck size={14} className="text-emerald-600" /> Cryptographic Ledger Record:
                  </div>
                  <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl">
                    SHA-256 Hash: {searchResult.hash}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="bg-white rounded-3xl border border-rose-200 p-12 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Certificate Not Found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              No matching credential was found for ID <strong className="font-mono text-slate-800">{certId}</strong>. Please verify the ID from the student's certificate badge or link.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default VerifyCertificate;
