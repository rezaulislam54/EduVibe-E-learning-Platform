import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader } from '../../components/common/Loader';
import {
  BookOpen,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Layers,
  HelpCircle,
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

export const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${id}`);
        setFormData(res.course);
      } catch (err) {
        alert(err.message || 'Failed to load course for editing');
        navigate('/instructor/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...(prev.sections || []),
        {
          title: `Section ${(prev.sections?.length || 0) + 1}: New Section`,
          order: (prev.sections?.length || 0) + 1,
          lessons: [
            {
              title: 'New Lecture',
              description: '',
              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
              duration: 10,
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
    if (!updated[sIdx].lessons) updated[sIdx].lessons = [];
    updated[sIdx].lessons.push({
      title: `Lecture ${updated[sIdx].lessons.length + 1}`,
      description: '',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      duration: 10,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/courses/${id}`, formData);
      alert('Course updated successfully!');
      navigate('/instructor/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to update course');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !formData) {
    return <Loader text="Loading course editor..." />;
  }

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
              Edit Course: <span className="text-indigo-600">{formData.title}</span>
            </h1>
            <p className="text-xs text-slate-500">Update curriculum, pricing, or media</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Save size={15} />
          <span>{submitting ? 'Saving...' : 'Save Changes'}</span>
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

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === 'basic' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
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
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
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
                  Price ($)
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
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                required
              ></textarea>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Curriculum Builder
              </h2>
              <button
                type="button"
                onClick={handleAddSection}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>

            {formData.sections?.map((section, sIdx) => (
              <div
                key={sIdx}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4"
              >
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
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Lecture
                    </button>
                    {formData.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(sIdx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-slate-100">
                  {section.lessons?.map((lesson, lIdx) => (
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
                              className="rounded text-indigo-600"
                            />
                            <span>Preview</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(sIdx, lIdx)}
                            className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                          >
                            <Trash2 size={13} />
                          </button>
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
                            placeholder="Video URL"
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

        {activeTab === 'details' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500">
              Save your changes with the "Save Changes" button at the top.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
