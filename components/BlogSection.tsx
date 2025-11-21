import React, { useState } from 'react';
import { BlogPost } from '../types';
import { summarizeBlogPost } from '../services/geminiService';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setSummary(null); // Reset summary when opening a new post
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  const handleClosePost = () => {
    setSelectedPost(null);
    setSummary(null);
    document.body.style.overflow = 'auto';
  };

  const handleGenerateSummary = async () => {
    if (!selectedPost) return;
    setLoadingSummary(true);
    const result = await summarizeBlogPost(selectedPost.content);
    setSummary(result);
    setLoadingSummary(false);
  };

  return (
    <section id="blog" className="mb-24 scroll-mt-24">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Strategic Insights</h2>
        <div className="h-px bg-stone-200 flex-1"></div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-stone-200 border-dashed">
          <p className="text-stone-500 italic">No articles published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className={`group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:shadow-stone-200 transition-all duration-300 cursor-pointer flex flex-col ${index === 0 ? 'md:col-span-2' : ''}`}
              onClick={() => handleOpenPost(post)}
            >
              <div className={`relative overflow-hidden ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}>
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                   {post.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold text-stone-800 rounded-full uppercase tracking-wider shadow-sm">
                       {tag}
                     </span>
                   ))}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-stone-500 mb-3 font-medium">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className={`font-bold text-stone-900 mb-3 group-hover:text-terracotta-600 transition-colors ${index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                  {post.title}
                </h3>
                
                <p className="text-stone-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>

                <div className="flex items-center text-terracotta-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                  Read Article 
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reading Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in" onClick={handleClosePost}></div>
          
          <div className="bg-sand-50 w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="relative h-48 sm:h-64 shrink-0">
              <img 
                src={selectedPost.imageUrl} 
                alt={selectedPost.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent"></div>
              <button 
                onClick={handleClosePost}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex gap-2 mb-3">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-terracotta-600 text-xs font-bold rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold leading-tight mb-2">{selectedPost.title}</h2>
                <div className="flex items-center gap-3 text-sm text-stone-300">
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10">
              
              {/* AI Summary Feature */}
              <div className="mb-8 p-6 bg-white rounded-xl border border-stone-200 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-turquoise-700 font-bold text-sm tracking-wider uppercase">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M16.5 6a3 3 0 11-6 0 3 3 0 016 0zM19 6v9a3 3 0 01-3 3H8a3 3 0 01-3-3V6a5 5 0 00-5 5v8a3 3 0 003 3h18a3 3 0 003-3v-8a5 5 0 00-5-5z" />
                      </svg>
                      Executive Summary
                    </div>
                    {!summary && (
                      <button 
                        onClick={handleGenerateSummary}
                        disabled={loadingSummary}
                        className="text-xs font-semibold bg-turquoise-100 text-turquoise-700 px-3 py-1.5 rounded-full hover:bg-turquoise-200 transition-colors disabled:opacity-50"
                      >
                        {loadingSummary ? 'Analyzing...' : 'Generate TL;DR with AI'}
                      </button>
                    )}
                 </div>
                 
                 {loadingSummary && (
                   <div className="space-y-2 animate-pulse">
                     <div className="h-2 bg-sand-200 rounded w-3/4"></div>
                     <div className="h-2 bg-sand-200 rounded w-full"></div>
                     <div className="h-2 bg-sand-200 rounded w-5/6"></div>
                   </div>
                 )}

                 {summary && (
                   <div className="prose prose-sm prose-stone text-stone-700 animate-fade-in">
                     <div className="whitespace-pre-line">{summary}</div>
                   </div>
                 )}

                 {!summary && !loadingSummary && (
                   <p className="text-stone-500 text-sm italic">
                     Short on time? Ask my AI to summarize the key strategic takeaways from this article.
                   </p>
                 )}
              </div>

              {/* Article Body */}
              <div 
                className="prose prose-stone prose-lg max-w-none first-letter:text-5xl first-letter:font-bold first-letter:text-terracotta-600 first-letter:mr-3 first-letter:float-left"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }} 
              />
            </div>

          </div>
        </div>
      )}

    </section>
  );
};