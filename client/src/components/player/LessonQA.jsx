import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ThumbsUp,
  CornerDownRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Badge } from '../common/Badge';

export const LessonQA = ({ courseId, lessonId, lessonTitle }) => {
  const { user } = useAuth();
  const { socket, joinCourseRoom } = useSocket();

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [replyContent, setReplyContent] = useState({});
  const [activeReplyBox, setActiveReplyBox] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch discussions when lesson changes
  const fetchDiscussions = async () => {
    if (!courseId || !lessonId) return;
    try {
      setLoading(true);
      const res = await api.get(`/discussions/course/${courseId}/lesson/${lessonId}`);
      setDiscussions(res.discussions || []);
    } catch (err) {
      console.error('Failed to load discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
    joinCourseRoom(courseId);
  }, [courseId, lessonId]);

  // Real-time listener for discussions
  useEffect(() => {
    if (!socket) return;

    const handleNewDiscussion = (discussion) => {
      if (
        discussion.course === courseId &&
        discussion.lessonId.toString() === lessonId.toString()
      ) {
        setDiscussions((prev) => [discussion, ...prev]);
      }
    };

    const handleNewReply = ({ discussionId, discussion }) => {
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? discussion : d))
      );
    };

    socket.on('new_discussion', handleNewDiscussion);
    socket.on('new_reply', handleNewReply);

    return () => {
      socket.off('new_discussion', handleNewDiscussion);
      socket.off('new_reply', handleNewReply);
    };
  }, [socket, courseId, lessonId]);

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post(
        `/discussions/course/${courseId}/lesson/${lessonId}`,
        {
          title: newTitle.trim(),
          content: newContent.trim(),
          lessonTitle,
        }
      );
      setDiscussions((prev) => [res.discussion, ...prev]);
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      alert(err.message || 'Failed to post question');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (discussionId) => {
    const text = replyContent[discussionId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.post(`/discussions/${discussionId}/reply`, {
        content: text.trim(),
      });
      setDiscussions((prev) =>
        prev.map((d) => (d._id === discussionId ? res.discussion : d))
      );
      setReplyContent((prev) => ({ ...prev, [discussionId]: '' }));
      setActiveReplyBox(null);
    } catch (err) {
      alert(err.message || 'Failed to post reply');
    }
  };

  const handleToggleUpvote = async (discussionId) => {
    try {
      const res = await api.put(`/discussions/${discussionId}/upvote`);
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d._id === discussionId) {
            const hasUpvoted = d.upvotes?.some(
              (id) => (id._id || id).toString() === user._id.toString()
            );
            return {
              ...d,
              upvotes: hasUpvoted
                ? d.upvotes.filter(
                    (id) => (id._id || id).toString() !== user._id.toString()
                  )
                : [...(d.upvotes || []), user._id],
            };
          }
          return d;
        })
      );
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Ask Question Form */}
      <form
        onSubmit={handlePostQuestion}
        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3"
      >
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <MessageSquare size={16} className="text-indigo-600" />
          Ask a Question on this Lecture
        </h4>

        <input
          type="text"
          placeholder="Question summary or title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          required
        />

        <textarea
          rows={3}
          placeholder="Describe what you are trying to do, error message, or code snippet..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          required
        ></textarea>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send size={13} />
            {submitting ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </form>

      {/* Discussions Thread List */}
      <div className="space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
          All Questions ({discussions.length})
        </h4>

        {loading ? (
          <p className="text-xs text-slate-400">Loading discussion threads...</p>
        ) : discussions.length > 0 ? (
          discussions.map((disc) => {
            const hasUpvoted = disc.upvotes?.some(
              (id) => (id._id || id).toString() === user?._id?.toString()
            );

            return (
              <div
                key={disc._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        disc.user?.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${disc.user?.name}`
                      }
                      alt={disc.user?.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          {disc.user?.name}
                        </span>
                        {disc.user?.role === 'instructor' && (
                          <Badge variant="primary" size="xs">
                            Instructor
                          </Badge>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {disc.createdAt
                            ? new Date(disc.createdAt).toLocaleDateString()
                            : ''}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 mt-1">
                        {disc.title}
                      </h5>
                    </div>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleToggleUpvote(disc._id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      hasUpvoted
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <ThumbsUp size={12} className={hasUpvoted ? 'fill-indigo-600' : ''} />
                    <span>{disc.upvotes?.length || 0}</span>
                  </button>
                </div>

                {/* Question Body */}
                <p className="text-xs text-slate-700 leading-relaxed pl-11">
                  {disc.content}
                </p>

                {/* Replies Thread */}
                {disc.replies && disc.replies.length > 0 && (
                  <div className="ml-11 pl-4 border-l-2 border-slate-100 space-y-3">
                    {disc.replies.map((rep, rIdx) => (
                      <div
                        key={rep._id || rIdx}
                        className={`p-3 rounded-xl text-xs space-y-1.5 ${
                          rep.isInstructor || rep.user?.role === 'instructor'
                            ? 'bg-indigo-50/70 border border-indigo-100'
                            : 'bg-slate-50 border border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {rep.user?.name}
                            </span>
                            {(rep.isInstructor || rep.user?.role === 'instructor') && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">
                                <ShieldCheck size={11} /> Instructor Response
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {new Date(rep.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {rep.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form Trigger */}
                <div className="pl-11 pt-2">
                  {activeReplyBox === disc._id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        placeholder="Write your answer..."
                        value={replyContent[disc._id] || ''}
                        onChange={(e) =>
                          setReplyContent({
                            ...replyContent,
                            [disc._id]: e.target.value,
                          })
                        }
                        className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      ></textarea>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setActiveReplyBox(null)}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePostReply(disc._id)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveReplyBox(disc._id)}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <CornerDownRight size={13} />
                      Reply ({disc.replies?.length || 0})
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">
              No questions on this lecture yet. Have a doubt? Ask above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
