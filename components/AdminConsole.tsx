import React, { useState } from 'react';
import { BlogPost } from '../types';
import { generateBlogPost } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';

interface AdminConsoleProps {
  posts: BlogPost[];
  onSave: (post: BlogPost) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

// Helper to get env var safely
const getEnvPassword = () => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env.VITE_ADMIN_PASSWORD;
  }
  return undefined;
};

export const AdminConsole: React.FC<AdminConsoleProps> = ({ posts, onSave, onDelete, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'LIST' | 'EDIT'>('LIST');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const CORRECT_PASSWORD = getEnvPassword() || 'strategy';

  // Login Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials.');
    }
  };

  // Editor Handlers
  const handleCreateNew = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      tags: [],
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
    };
    setEditingPost(newPost);
    setView('EDIT');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setView('EDIT');
  };

  const handleSave = async () => {
    if (editingPost) {
      setIsSaving(true);
      try {
        await onSave(editingPost);
        setView('LIST');
        setEditingPost(null);
      } catch (e) {
        alert("Error saving post.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleAiDraft = async () => {
    if (!editingPost?.title) {
      alert("Please enter a title first so the AI knows what to write about.");
      return;
    }
    setIsGenerating(true);
    const content = await generateBlogPost(editingPost.title);
    setEditingPost(prev => prev ? { ...prev, content: content } : null);
    setIsGenerating(false);
  };

  // Login View
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-stone-900 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fade-in">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-stone-900">Admin Console</h2>
             <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1">Access Code</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none"
                placeholder="Enter password..."
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors">
              Enter Dashboard
            </button>
            <p className="text-xs text-center text-stone-400 mt-4">Hint: The password is "{CORRECT_PASSWORD === 'strategy' ? 'strategy' : '******'}"</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-sand-100 flex flex-col animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-stone-900">Content Manager</h2>
          <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${supabase ? "bg-turquoise-100 text-turquoise-700 border-turquoise-200" : "bg-orange-100 text-orange-700 border-orange-200"}`}>
            {supabase ? "SUPABASE CONNECTED" : "DEMO MODE (NO DB)"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {view === 'EDIT' && (
            <button onClick={() => setView('LIST')} className="text-stone-500 hover:text-stone-900 text-sm font-medium">
              Cancel
            </button>
          )}
          <button onClick={onClose} className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
            Exit Console
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          
          {/* LIST VIEW */}
          {view === 'LIST' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-stone-800">Your Posts</h3>
                <button 
                  onClick={handleCreateNew}
                  className="bg-terracotta-600 hover:bg-terracotta-500 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-terracotta-500/20 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  New Post
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-sand-50 border-b border-stone-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {posts.map(post => (
                      <tr key={post.id} className="hover:bg-sand-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-stone-900">{post.title}</p>
                          <p className="text-xs text-stone-400 truncate max-w-xs">{post.excerpt}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-stone-500">{post.date}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleEdit(post)}
                            className="text-stone-400 hover:text-terracotta-600 font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={async () => {
                              if(confirm('Are you sure you want to delete this post?')) {
                                try {
                                  await onDelete(post.id);
                                } catch(e) {
                                  alert("Delete failed");
                                }
                              }
                            }}
                            className="text-stone-400 hover:text-red-600 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {posts.length === 0 && (
                  <div className="p-12 text-center text-stone-400 italic">
                    No posts found in database.
                  </div>
                )}
              </div>
            </>
          )}

          {/* EDIT VIEW */}
          {view === 'EDIT' && editingPost && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              {/* Form */}
              <div className="flex-1 p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Title</label>
                  <input 
                    type="text" 
                    value={editingPost.title}
                    onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none font-bold text-lg"
                    placeholder="Enter article title..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Date</label>
                    <input 
                      type="text" 
                      value={editingPost.date}
                      onChange={e => setEditingPost({...editingPost, date: e.target.value})}
                      className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Read Time</label>
                    <input 
                      type="text" 
                      value={editingPost.readTime}
                      onChange={e => setEditingPost({...editingPost, readTime: e.target.value})}
                      className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Cover Image URL</label>
                  <input 
                    type="text" 
                    value={editingPost.imageUrl}
                    onChange={e => setEditingPost({...editingPost, imageUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none text-sm font-mono text-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Excerpt (Preview Text)</label>
                  <textarea 
                    value={editingPost.excerpt}
                    onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none text-sm h-24 resize-none"
                    placeholder="Short summary for the card..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={editingPost.tags.join(', ')}
                    onChange={e => setEditingPost({...editingPost, tags: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none text-sm"
                    placeholder="Strategy, AI, Tech..."
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div className="flex-1 p-8 bg-sand-50 border-t md:border-t-0 md:border-l border-stone-200 flex flex-col">
                 <div className="flex justify-between items-center mb-2">
                   <label className="block text-sm font-bold text-stone-700">HTML Content</label>
                   <button 
                    onClick={handleAiDraft}
                    disabled={isGenerating}
                    className="text-xs bg-turquoise-100 text-turquoise-700 px-3 py-1 rounded-full font-bold hover:bg-turquoise-200 transition-colors flex items-center gap-1 disabled:opacity-50"
                   >
                     {isGenerating ? (
                       <span className="animate-spin">⏳</span>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                         <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.683a1 1 0 01.633.633l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684z" />
                       </svg>
                     )}
                     Magic Draft
                   </button>
                 </div>
                 <p className="text-xs text-stone-400 mb-4">Use HTML tags like &lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;.</p>
                 
                 <textarea 
                    value={editingPost.content}
                    onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                    className="flex-1 w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-terracotta-500 outline-none text-sm font-mono text-stone-700 resize-none"
                    placeholder="<p>Start writing your article...</p>"
                  />

                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-700 transition-colors disabled:opacity-70"
                    >
                      {isSaving ? 'Saving...' : 'Save Article'}
                    </button>
                  </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};