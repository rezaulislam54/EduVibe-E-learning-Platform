import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BookOpen,
  Plus,
  Trash2,
  PlayCircle,
  Sparkles,
  Save,
  ArrowLeft,
  DollarSign,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Data Science & AI',
  'Cloud & DevOps',
  'Design & UI/UX',
  'Cybersecurity',
  'Business & Marketing',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export const CreateCourse = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'curriculum' | 'details'

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Web Development',
    level: 'All Levels',
    language: 'English',
    price: 49.99,
    discountPrice: 14.99,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    learningObjectives: [
      'Master key concepts and build real-world software applications',
      'Understand architectural best practices and patterns',
    ],
    requirements: ['Basic computer literacy and enthusiasm to learn'],
    targetAudience: ['Developers and tech enthusiasts looking to level up'],
    sections: [
      {
        title: 'Section 1: Introduction & Architecture Setup',
        order: 1,
        lessons: [
          {
            title: 'Welcome to the Course & Roadmap',
            description: 'Course overview and learning goals.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: 10,
            isPreview: true,
            resources: [],
            order: 1,
          },
        ],
      },
    ],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Section & Lesson Handlers
  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: `Section ${prev.sections.length + 1}: New Section`,
          order: prev.sections.length + 1,
          lessons: [
            {
              title: 'New Lecture',
              description: '',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              duration: 15,
              isPreview: false,
              resources: [],
              order: 1,
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveSection = (sIdx) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== sIdx),
    }));
  };

  const handleSectionTitleChange = (sIdx, title) => {
    const updated = [...formData.sections];
    updated[sIdx].title = title;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleAddLesson = (sIdx) => {
    const updated = [...formData.sections];
    updated[sIdx].lessons.push({
      title: `Lecture ${updated[sIdx].lessons.length + 1}`,
      description: '',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      duration: 12,
      isPreview: false,
      resources: [],
      order: updated[sIdx].lessons.length + 1,
    });
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleRemoveLesson = (sIdx, lIdx) => {
    const updated = [...formData.sections];
    updated[sIdx].lessons = updated[sIdx].lessons.filter((_, idx) => idx !== lIdx);
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  const handleLessonChange = (sIdx, lIdx, field, val) => {
    const updated = [...formData.sections];
    updated[sIdx].lessons[lIdx][field] = val;
    setFormData((prev) => ({ ...prev, sections: updated }));
  };

  // Array item helpers (learning objectives / requirements)
  const handleAddArrayItem = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], ''],
    }));
  };

  const handleRemoveArrayItem = (key, idx) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  };

  const handleArrayItemChange = (key, idx, val) => {
    const updated = [...formData[key]];
    updated[idx] = val;
    setFormData((prev) => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subtitle || !formData.description) {
      alert('Please fill out the course title, subtitle, and description');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/courses', formData);
      alert('Course created and published successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/instructor/dashboard"
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Create New Masterclass
            </h1>
            <p className="text-xs text-slate-500">
              Publish rich, interactive courses for global learners
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Save size={15} />
          <span>{submitting ? 'Publishing...' : 'Publish Course'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        {[
          { id: 'basic', label: '1. Basic Information', icon: BookOpen },
          { id: 'curriculum', label: '2. Curriculum & Videos', icon: Layers },
          { id: 'details', label: '3. Objectives & Requirements', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Tabs Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tab 1: Basic Information */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Course Details & Media
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Next.js 15 & Tailwind Full-Stack Masterclass"
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Short Subtitle *
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Catchy one-sentence summary of what this course delivers"
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500/20"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-indigo-500/20"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Language
                </label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Regular Price ($) (Set 0 for Free)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Discounted Price ($) (Optional)
                </label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Promotional Trailer Video URL
                </label>
                <input
                  type="text"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleInputChange}
                  placeholder="https://...mp4"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Detailed Course Description *
              </label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Comprehensive breakdown of course topics, project architecture, tools, and prerequisites..."
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500/20"
                required
              ></textarea>
            </div>
          </div>
        )}

        {/* Tab 2: Curriculum Manager */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Curriculum Builder
                </h2>
                <p className="text-xs text-slate-500">
                  Organize lectures into sections and attach video streaming links
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>

            {formData.sections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(sIdx, e.target.value)}
                    className="flex-1 font-bold text-sm text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddLesson(sIdx)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Lecture
                    </button>
                    {formData.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sIdx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Lessons in Section */}
                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-slate-100">
                  {section.lessons.map((lesson, lIdx) => (
                    <div
                      key={lIdx}
                      className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) =>
                            handleLessonChange(sIdx, lIdx, 'title', e.target.value)
                          }
                          placeholder="Lecture Title"
                          className="flex-1 font-bold text-xs bg-white p-2 border border-slate-200 rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={lesson.isPreview}
                              onChange={(e) =>
                                handleLessonChange(
                                  sIdx,
                                  lIdx,
                                  'isPreview',
                                  e.target.checked
                                )
                              }
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Free Preview</span>
                          </label>

                          {section.lessons.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLesson(sIdx, lIdx)}
                              className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={lesson.videoUrl}
                            onChange={(e) =>
                              handleLessonChange(sIdx, lIdx, 'videoUrl', e.target.value)
                            }
                            placeholder="Video Stream URL (.mp4, Cloudinary, etc.)"
                            className="w-full text-xs font-mono bg-white p-2 border border-slate-200 rounded-lg"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={lesson.duration}
                            onChange={(e) =>
                              handleLessonChange(
                                sIdx,
                                lIdx,
                                'duration',
                                Number(e.target.value)
                              )
                            }
                            placeholder="Duration (mins)"
                            className="w-full text-xs bg-white p-2 border border-slate-200 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Objectives & Requirements */}
        {activeTab === 'details' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-8">
            {/* Learning Objectives */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  What Will Students Learn?
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('learningObjectives')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus size={13} /> Add Objective
                </button>
              </div>

              {formData.learningObjectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) =>
                      handleArrayItemChange('learningObjectives', idx, e.target.value)
                    }
                    placeholder="e.g. Build enterprise-grade REST APIs with Node and Express"
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('learningObjectives', idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">
                  Prerequisites & Requirements
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddArrayItem('requirements')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Plus size={13} /> Add Requirement
                </button>
              </div>

              {formData.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) =>
                      handleArrayItemChange('requirements', idx, e.target.value)
                    }
                    placeholder="e.g. Basic understanding of JavaScript syntax"
                    className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveArrayItem('requirements', idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
