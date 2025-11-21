import React, { useState, useEffect } from 'react';
import { ProjectCard } from './components/ProjectCard';
import { GeminiCoach } from './components/GeminiCoach';
import { ArcadeOverlay } from './components/ArcadeOverlay';
import { BlogSection } from './components/BlogSection';
import { AdminConsole } from './components/AdminConsole';
import { INITIAL_PROFILE, INITIAL_PROJECTS, ARTISTIC_BACKGROUND_URL, USER_PORTRAIT_URL } from './constants';
import { generateProjectIdea } from './services/geminiService';
import { blogService } from './services/blogService';
import { BlogPost } from './types';

const App: React.FC = () => {
  const [idea, setIdea] = useState<string | null>(null);
  const [loadingIdea, setLoadingIdea] = useState(false);
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  // Blog State managed here so updates reflect immediately
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Load initial blog posts asynchronously
    loadPosts();

    // Admin Shortcut: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loadPosts = async () => {
    const posts = await blogService.getAll();
    setBlogPosts(posts);
  };

  const handleGenerateIdea = async () => {
    setLoadingIdea(true);
    const newIdea = await generateProjectIdea(INITIAL_PROFILE.skills);
    setIdea(newIdea);
    setLoadingIdea(false);
  };

  // Admin Handlers
  const handleSavePost = async (post: BlogPost) => {
    try {
      await blogService.save(post);
      await loadPosts(); // Refresh from DB to get latest state
    } catch (error) {
      console.error("Failed to save post", error);
      alert("Failed to save post to database. Check console.");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await blogService.delete(id);
      await loadPosts(); // Refresh from DB
    } catch (error) {
      console.error("Failed to delete post", error);
      alert("Failed to delete post. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-sand-100 text-stone-800 relative overflow-x-hidden">
      
      {/* Global Artistic Backdrop (Shadows) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* The image layer with blend mode - Optimized for Shadow Photo */}
        <div 
          className="absolute inset-0 opacity-[0.12] mix-blend-multiply transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${scrollY * 0.05}px) scale(1.05)` }}
        >
           <img 
             src={ARTISTIC_BACKGROUND_URL} 
             alt="Shadow Texture" 
             className="w-full h-full object-cover filter grayscale contrast-125"
           />
        </div>
        {/* Gradient Overlays to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-sand-100/60 via-transparent to-sand-100/90"></div>
        
        {/* Color Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-terracotta-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-turquoise-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-sand-100/90 backdrop-blur-md border-b border-sand-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="font-bold text-xl tracking-tight text-stone-900 hover:text-terracotta-600 transition-colors">
            {INITIAL_PROFILE.name}<span className="text-terracotta-500">.strategy</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#about" className="hover:text-terracotta-600 transition-colors">About</a>
            <a href="#experience" className="hover:text-terracotta-600 transition-colors">Experience</a>
            <a href="#projects" className="hover:text-terracotta-600 transition-colors">Work</a>
            <a href="#blog" className="hover:text-terracotta-600 transition-colors">Insights</a>
            <a href={`mailto:${INITIAL_PROFILE.socials.email}`} className="hover:text-terracotta-600 transition-colors">Contact</a>
            
            <div className="flex items-center gap-3 border-l border-stone-300 pl-6">
              {/* Admin Toggle (Header) */}
              <button 
                onClick={() => setIsAdminOpen(true)}
                className="text-stone-400 hover:text-terracotta-600 transition-colors"
                title="Admin Console (Password: strategy)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </button>

              {/* Game Toggle Button */}
              <button 
                onClick={() => setIsArcadeOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white hover:bg-terracotta-500 hover:text-white text-stone-600 transition-all border border-sand-200 hover:border-terracotta-500 group shadow-sm"
                title="Take a break!"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:animate-pulse">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
                <span className="text-xs font-semibold">Play</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-20 relative z-10">
        
        {/* Hero Section with Portrait */}
        <section id="home" className="min-h-[85vh] flex items-center mb-24 animate-fade-in scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-sand-300 text-stone-500 text-sm font-medium mb-6 shadow-sm">
                 <span className="w-2 h-2 rounded-full bg-turquoise-500"></span>
                 Available for Strategy & Leadership
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-6 leading-[1.1]">
                Building digital <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-turquoise-600">
                  futures.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-stone-700 mb-8 leading-relaxed max-w-xl bg-sand-100/50 backdrop-blur-sm p-4 -ml-4 rounded-xl border border-sand-200/50">
                {INITIAL_PROFILE.bio}
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="#projects"
                  className="bg-terracotta-600 hover:bg-terracotta-500 text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-terracotta-500/25"
                >
                  View Portfolio
                </a>
                <a 
                  href={INITIAL_PROFILE.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white hover:bg-stone-50 text-stone-800 px-8 py-3 rounded-full font-semibold transition-all border border-stone-300 shadow-sm hover:shadow-md"
                >
                  GitHub Profile
                </a>
              </div>
            </div>

            {/* Portrait Image - Optimized for Tree Selfie (Vertical/Unique Angle) */}
            <div className="order-1 lg:order-2 relative h-[400px] lg:h-[600px] flex justify-center lg:justify-end">
              {/* Using a squircle shape to frame the face nicely without cutting too much context */}
              <div className="relative w-full max-w-md aspect-[3/4] lg:h-full rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-2xl shadow-stone-500/20 transform hover:scale-[1.02] transition-transform duration-500">
                 <img 
                   src={USER_PORTRAIT_URL} 
                   alt={INITIAL_PROFILE.name}
                   className="w-full h-full object-cover"
                 />
                 {/* Subtle gradient at bottom for text contrast if needed, or just artistic effect */}
                 <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent opacity-40"></div>
              </div>
              
              {/* Decorative Elements behind portrait */}
              <div className="absolute top-8 right-8 w-full h-full max-w-md border-4 border-terracotta-500/10 rounded-[2.5rem] -z-10 rotate-3"></div>
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-stone-100 max-w-xs hidden md:block animate-fade-in">
                <p className="text-xs font-bold text-terracotta-600 uppercase tracking-wider mb-1">Current Mood</p>
                <p className="text-sm text-stone-700 italic">"Always looking at problems from a different angle."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed About Section */}
        <section id="about" className="mb-24 py-8 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Narrative */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-600 text-sm font-medium mb-6 border border-terracotta-200">
                <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse"></span>
                About Me
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6 leading-tight">
                Bridging the Gap Between <span className="text-terracotta-600">Strategy</span> & <span className="text-turquoise-600">Execution</span>.
              </h2>
              <div className="space-y-6 text-stone-600 text-lg leading-relaxed">
                <p>
                  My career didn't start with a commit message; it started with a vision. As the <strong>Director of the Fox Innovation Lab</strong> at 20th Century Fox, I had a front-row seat to the future of media, spearheading initiatives in VR, AR, and AI before they hit the mainstream.
                </p>
                <p>
                  I didn't just watch technology evolve; I helped shape how a major studio adopted it. I negotiated with tech giants like Samsung and Google, managed multi-million dollar budgets, and built demos that wowed C-Suite executives. But I realized I wanted to be closer to the metal. I wanted to <em>build</em> the solutions I was strategizing about.
                </p>
                <p>
                  Today, I combine that high-level strategic perspective with hands-on technical execution. I don't just write code; I build products that make business sense. My superpower is understanding the "why" (Strategy) and the "how" (Technology).
                </p>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-terracotta-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-terracotta-50 rounded-xl flex items-center justify-center mb-4 text-terracotta-600 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-4.5 4.5 4.5 0 00-9 0 6.01 6.01 0 001.5 4.5m0 0a9.015 9.015 0 01-9 0m18 0a9.015 9.015 0 01-9 0m3-8.25a3 3 0 01-9 0 3 3 0 019 0z" />
                    </svg>
                </div>
                <h3 className="text-stone-900 font-bold text-lg mb-2">Innovation Leader</h3>
                <p className="text-stone-500 text-sm">Founded the Fox Innovation Lab, leading pilots in VR, AR, and AI.</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-turquoise-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 text-turquoise-600 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </div>
                <h3 className="text-stone-900 font-bold text-lg mb-2">Technical Prototyping</h3>
                <p className="text-stone-500 text-sm">Validating strategic concepts with code: React, TypeScript, & LLMs.</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-amber-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-amber-600 group-hover:scale-110 transition-transform">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                   </svg>
                </div>
                <h3 className="text-stone-900 font-bold text-lg mb-2">Strategic Vision</h3>
                <p className="text-stone-500 text-sm">Bridging business requirements with technical realities to deliver value.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-24 scroll-mt-24">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Work History</h2>
            <div className="h-px bg-stone-200 flex-1"></div>
          </div>
          
          <div className="relative border-l-2 border-stone-200 ml-4 md:ml-12 space-y-12">
            {INITIAL_PROFILE.experience.map((job) => (
              <div key={job.id} className="relative pl-8 md:pl-12">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white border-2 border-terracotta-500"></div>
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                   <h3 className="text-xl font-bold text-stone-900">{job.role}</h3>
                   <span className="text-sm font-medium text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full self-start md:self-auto mt-2 md:mt-0 border border-terracotta-100">
                     {job.period}
                   </span>
                </div>
                <h4 className="text-lg font-semibold text-stone-600 mb-3">{job.company}</h4>
                <p className="text-stone-600 leading-relaxed max-w-3xl">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-24 scroll-mt-24">
          <div className="flex items-center gap-4 mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-stone-900">Select Work</h2>
             <div className="h-px bg-stone-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {INITIAL_PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* AI Idea Generator */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Looking for inspiration?</h3>
              <p className="text-stone-300 mb-8">
                Let my AI assistant analyze my skill set and suggest a project idea for us to build together.
              </p>
              
              {idea && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl mb-8 animate-fade-in">
                  <p className="text-lg font-medium leading-relaxed">{idea}</p>
                </div>
              )}

              <button 
                onClick={handleGenerateIdea}
                disabled={loadingIdea}
                className="bg-terracotta-600 hover:bg-terracotta-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-terracotta-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loadingIdea ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Thinking...
                  </>
                ) : (
                  <>
                    Generate Idea
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Blog Section (Dynamic) */}
        <BlogSection posts={blogPosts} />

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-stone-500">&copy; {new Date().getFullYear()} {INITIAL_PROFILE.name}. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-6 text-stone-400">
             <a href={INITIAL_PROFILE.socials.github} target="_blank" rel="noreferrer" className="hover:text-terracotta-600 transition-colors">GitHub</a>
             <a href={`mailto:${INITIAL_PROFILE.socials.email}`} className="hover:text-terracotta-600 transition-colors">Email</a>
             
             {/* Admin Lock Icon */}
             <button 
               onClick={() => setIsAdminOpen(true)}
               className="hover:text-stone-600 transition-colors"
               title="Admin Login"
             >
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                 <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
               </svg>
             </button>
          </div>
        </div>
      </footer>

      <GeminiCoach />
      
      {isArcadeOpen && <ArcadeOverlay onClose={() => setIsArcadeOpen(false)} />}
      
      {/* Admin Console Overlay */}
      {isAdminOpen && (
        <AdminConsole 
          posts={blogPosts}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
          onClose={() => setIsAdminOpen(false)} 
        />
      )}

    </div>
  );
};

export default App;