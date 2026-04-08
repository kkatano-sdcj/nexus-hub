import React, { useState } from 'react';
import { 
  Layout, Home, Radio, Calendar, Video, Newspaper, 
  Search, Bell, MessageSquare, Share2, Heart, Play, 
  MapPin, Clock, MoreHorizontal, Sparkles, Bot
} from 'lucide-react';
import { MOCK_DATA } from './constants';
import { ContentItem, ContentType } from './types';
import PodcastPlayer from './components/PodcastPlayer';
import AIAssistant from './components/AIAssistant';
import { analyzeContent } from './services/geminiService';

// --- Sub-components defined here for single-file delivery where possible, to keep structure clean ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-zinc-500 group-hover:text-indigo-400'} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const ArticleModal = ({ item, onClose }: { item: ContentItem; onClose: () => void }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const summary = await analyzeContent(item.content || item.summary, item.type);
    setAiAnalysis(summary);
    setAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden border border-zinc-800 flex flex-col shadow-2xl">
        <div className="relative h-64 shrink-0">
          <img src={item.thumbnail} className="w-full h-full object-cover" alt={item.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          >
            <MoreHorizontal size={24} />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 bg-indigo-600 text-xs font-bold text-white rounded-full mb-3 shadow-lg shadow-indigo-900/50">
              {item.type}
            </span>
            <h2 className="text-3xl font-bold text-white leading-tight">{item.title}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={item.author.avatar} className="w-10 h-10 rounded-full border border-zinc-700" alt="Author" />
              <div>
                <p className="text-sm font-semibold text-white">{item.author.name}</p>
                <p className="text-xs text-zinc-400">{item.author.role} • {item.date}</p>
              </div>
            </div>

            <div className="prose prose-invert prose-zinc max-w-none">
              <p className="text-zinc-300 text-lg leading-relaxed">{item.content || item.summary}</p>
              <p className="text-zinc-400 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center gap-6">
               <button className="flex items-center gap-2 text-zinc-400 hover:text-pink-500 transition-colors">
                  <Heart size={20} /> <span className="text-sm">{item.likes}</span>
               </button>
               <button className="flex items-center gap-2 text-zinc-400 hover:text-blue-400 transition-colors">
                  <MessageSquare size={20} /> <span className="text-sm">Comment</span>
               </button>
               <button className="flex items-center gap-2 text-zinc-400 hover:text-green-400 transition-colors">
                  <Share2 size={20} /> <span className="text-sm">Share</span>
               </button>
            </div>
          </div>

          {/* AI Sidebar inside Modal */}
          <div className="w-full md:w-80 shrink-0 space-y-4">
             <div className="bg-zinc-800/50 rounded-2xl p-5 border border-zinc-700/50">
                <div className="flex items-center gap-2 text-indigo-400 mb-3 font-semibold">
                  <Sparkles size={18} />
                  <h3>AI Insight</h3>
                </div>
                
                {!aiAnalysis && !analyzing && (
                  <button 
                    onClick={handleAnalyze}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Generate Summary
                  </button>
                )}

                {analyzing && (
                  <div className="text-sm text-zinc-400 animate-pulse">Analyzing content...</div>
                )}

                {aiAnalysis && (
                  <div className="text-sm text-zinc-300 leading-relaxed space-y-2">
                    {aiAnalysis.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [currentPodcast, setCurrentPodcast] = useState<ContentItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ContentItem | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);

  // Filter content
  const getFilteredContent = () => {
    if (activeTab === 'Home') return MOCK_DATA;
    if (activeTab === 'News') return MOCK_DATA.filter(i => i.type === ContentType.ARTICLE);
    if (activeTab === 'Podcast') return MOCK_DATA.filter(i => i.type === ContentType.PODCAST);
    if (activeTab === 'Video') return MOCK_DATA.filter(i => i.type === ContentType.VIDEO);
    if (activeTab === 'Events') return MOCK_DATA.filter(i => i.type === ContentType.EVENT);
    return MOCK_DATA;
  };

  const filteredData = getFilteredContent();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden">
      
      {/* --- Sidebar --- */}
      <aside className="w-20 md:w-64 border-r border-zinc-800 flex-col hidden sm:flex bg-black/20 backdrop-blur-xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-zinc-800/50">
           <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">N</div>
           <span className="ml-3 font-bold text-lg tracking-tight hidden md:block text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">NexusHub</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={Home} label="Home" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
          <SidebarItem icon={Newspaper} label="News" active={activeTab === 'News'} onClick={() => setActiveTab('News')} />
          <SidebarItem icon={Radio} label="Podcast" active={activeTab === 'Podcast'} onClick={() => setActiveTab('Podcast')} />
          <SidebarItem icon={Video} label="Video" active={activeTab === 'Video'} onClick={() => setActiveTab('Video')} />
          <SidebarItem icon={Calendar} label="Events" active={activeTab === 'Events'} onClick={() => setActiveTab('Events')} />
        </nav>

        <div className="p-4 border-t border-zinc-800">
           <button 
              onClick={() => setShowAIChat(!showAIChat)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-800/50 hover:border-emerald-500/50 text-emerald-400 transition-all"
           >
              <Bot size={20} />
              <span className="hidden md:block font-medium text-sm">AI Assistant</span>
           </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 border-b border-zinc-800 flex items-center justify-between px-6 md:px-10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-xl font-bold">{activeTab}</h1>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="text" 
                placeholder="Search Nexus..." 
                className="bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 w-64 transition-all"
              />
            </div>
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
              <img src="https://picsum.photos/100/100?random=99" alt="User" />
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
          
          {/* Featured Hero (Only on Home) */}
          {activeTab === 'Home' && (
            <div className="mb-12 relative rounded-3xl overflow-hidden aspect-[21/9] group cursor-pointer border border-zinc-800">
              <img 
                src="https://picsum.photos/1200/600?random=101" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white rounded-full mb-4 inline-block">
                  FEATURED
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Global Innovation Summit 2024: <span className="text-indigo-400">Recap & Awards</span>
                </h2>
                <p className="text-zinc-300 text-lg mb-6 line-clamp-2">
                  Catch up on the biggest announcements from our annual summit, including the launch of Project 'Orion' and the new employee stock program.
                </p>
                <div className="flex items-center gap-4">
                  <button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors">
                    Read Article
                  </button>
                  <button className="p-3 bg-zinc-800/80 backdrop-blur rounded-full text-white hover:bg-indigo-600 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filtered Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredData.map((item) => (
              <div 
                key={item.id} 
                className="bg-zinc-900/50 border border-zinc-800/60 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all hover:bg-zinc-900 group flex flex-col"
              >
                {/* Card Thumbnail */}
                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => item.type === ContentType.PODCAST ? setCurrentPodcast(item) : setSelectedArticle(item)}>
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-xs font-medium text-white rounded uppercase tracking-wider flex items-center gap-1">
                    {item.type === ContentType.VIDEO && <Video size={12} />}
                    {item.type === ContentType.PODCAST && <Radio size={12} />}
                    {item.type === ContentType.EVENT && <Calendar size={12} />}
                    {item.type}
                  </div>

                  {/* Play Overlay for Video/Podcast */}
                  {(item.type === ContentType.VIDEO || item.type === ContentType.PODCAST) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                         <Play size={24} fill="currentColor" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                    <span className="text-indigo-400 font-medium">#{item.tags[0]}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                  
                  <h3 
                    onClick={() => item.type === ContentType.PODCAST ? setCurrentPodcast(item) : setSelectedArticle(item)}
                    className="text-lg font-bold text-zinc-100 mb-2 leading-snug cursor-pointer hover:text-indigo-400 transition-colors"
                  >
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2 flex-1">
                    {item.summary}
                  </p>

                  {item.type === ContentType.EVENT && item.location && (
                     <div className="flex items-center gap-2 text-xs text-zinc-300 mb-4 bg-zinc-800/50 p-2 rounded">
                        <MapPin size={14} className="text-red-400" /> {item.location}
                     </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-auto">
                    <div className="flex items-center gap-2">
                       <img src={item.author.avatar} className="w-6 h-6 rounded-full" alt="author" />
                       <span className="text-xs text-zinc-400 font-medium">{item.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {item.type === ContentType.PODCAST && (
                            <button 
                                onClick={() => setCurrentPodcast(item)}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                                <Play size={12} fill="currentColor"/> LISTEN
                            </button>
                        )}
                        {item.type !== ContentType.PODCAST && (
                             <button className="text-zinc-500 hover:text-white transition-colors">
                                <Heart size={16} />
                             </button>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Floating AI Chat (If active) --- */}
        {showAIChat && (
          <div className="absolute right-6 bottom-24 w-80 h-[500px] z-40 shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease-out]">
            <AIAssistant onClose={() => setShowAIChat(false)} />
          </div>
        )}

      </main>

      {/* --- Right Widgets Sidebar (Desktop) --- */}
      <aside className="w-72 border-l border-zinc-800 hidden xl:flex flex-col bg-zinc-950 p-6 space-y-8">
         {/* Trending */}
         <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Trending in Tech</h3>
            <ul className="space-y-4">
               {['Generative Design', 'Rust for Backend', 'Sustainable AI', 'Quantum Leaps'].map((topic, i) => (
                  <li key={i} className="flex items-center justify-between group cursor-pointer">
                     <span className="text-zinc-300 font-medium text-sm group-hover:text-indigo-400 transition-colors">#{topic}</span>
                     <span className="text-xs text-zinc-600 bg-zinc-900 px-2 py-1 rounded">+{(10 - i) * 12}%</span>
                  </li>
               ))}
            </ul>
         </div>

         {/* Upcoming Events Mini */}
         <div>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Upcoming Events</h3>
            <div className="space-y-3">
               <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
                     <Clock size={12} /> TOMORROW, 2:00 PM
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Cybersecurity Workshop</h4>
                  <p className="text-xs text-zinc-500">Room 304 & Zoom</p>
               </div>
               <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
                     <Clock size={12} /> NOV 14, 10:00 AM
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Design System Sync</h4>
                  <p className="text-xs text-zinc-500">Main Hall</p>
               </div>
            </div>
         </div>
      </aside>

      {/* --- Podcast Player (Sticky Bottom) --- */}
      <PodcastPlayer episode={currentPodcast} onClose={() => setCurrentPodcast(null)} />

      {/* --- Article/Content Modal --- */}
      {selectedArticle && (
        <ArticleModal item={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}

    </div>
  );
}