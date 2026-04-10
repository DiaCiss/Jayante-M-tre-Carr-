
import React, { useState, useEffect } from 'react';
import { ViewState, Member } from '../types';
import { LogOut, Home as HomeIcon, LayoutDashboard, LogIn, Hammer, BookOpen, User, Sun, Moon, MoreVertical, X, ChevronDown, Settings, Phone } from 'lucide-react';
import { Logo } from './Logo';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  currentUser: Member | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setCurrentView, 
  currentUser,
  onLogout,
  isDarkMode,
  toggleTheme
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop NavLink Component
  const NavLink = ({ view, label, icon: Icon, isCta = false }: { view: ViewState, label: string, icon?: any, isCta?: boolean }) => {
    const isActive = currentView === view;
    return (
      <button
        onClick={() => setCurrentView(view)}
        className={`relative group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all duration-300 ${isActive ? 'bg-amber-400 text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.4)] font-bold scale-105' : isCta ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-800 font-medium' : isScrolled ? 'text-slate-600 hover:bg-slate-100 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white font-medium' : 'text-slate-600 hover:bg-slate-100/50 hover:text-emerald-700 dark:text-slate-200 dark:hover:bg-white/10 font-medium'}`}
      >
        {Icon && <Icon size={18} />}
        <span>{label}</span>
      </button>
    );
  };

  // Mobile Tab Component
  const MobileTab = ({ view, label, icon: Icon, highlight = false }: { view: ViewState, label: string, icon: any, highlight?: boolean }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => setCurrentView(view)}
        className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${isActive ? 'text-amber-500 scale-110' : 'text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
      >
        <div className={`p-2 rounded-full mb-1 transition-all ${isActive ? 'bg-amber-500/10' : highlight ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : ''}`}>
          <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 dark:bg-emerald-950 dark:text-slate-100 selection:bg-emerald-500 selection:text-white pb-28 md:pb-0 transition-colors duration-300 overflow-x-hidden w-full max-w-full">
      
      {/* DESKTOP NAV - Floating & Rounded */}
      <nav className={`hidden md:block fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-full border transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-[#022c22]/90 backdrop-blur-xl shadow-2xl border-white/20' : 'bg-transparent border-transparent shadow-none'}`}>
        <div className="px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 cursor-pointer group" onClick={() => setCurrentView('home')}>
                <Logo className="w-10 h-10" showText={true} textColor={isScrolled ? undefined : 'text-white'} />
              </div>
              <div className={`ml-12 flex items-center gap-2 p-1 rounded-full border transition-colors duration-300 ${isScrolled ? 'bg-slate-50/50 dark:bg-black/20 border-slate-200/50 dark:border-white/5' : 'bg-black/10 border-white/10 backdrop-blur-sm'}`}>
                <NavLink view="home" label="Accueil" icon={HomeIcon} />
                <NavLink view="presentation" label="Présentation" icon={BookOpen} />
                {!currentUser && (
                  <NavLink view="register" label="Devenir Bâtisseur" icon={Hammer} isCta={true} />
                )}
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
                <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10' : 'text-white hover:text-amber-400 bg-white/10 hover:bg-white/20'}`}>
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {/* 3-Dots Menu for Desktop (Secondary Actions) */}
                <div className="relative group/menu">
                    <button className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-slate-500 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10' : 'text-white hover:text-amber-400 bg-white/10 hover:bg-white/20'}`}>
                        <MoreVertical size={20} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform origin-top-right">
                        <button onClick={() => setCurrentView('presentation')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2">
                           <BookOpen size={16} /> Présentation
                        </button>
                        <button onClick={() => setCurrentView('contact')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2">
                           <Phone size={16} /> Contact
                        </button>
                        
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                        <p className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Informations</p>
                        
                        <button onClick={() => setCurrentView('legal-mentions')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">Mentions Légales</button>
                        <button onClick={() => setCurrentView('legal-privacy')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">Politique de Confidentialité</button>
                        <button onClick={() => setCurrentView('legal-cgu')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">CGU</button>
                        <button onClick={() => setCurrentView('legal-transparency')} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">Transparence Financière</button>
                    </div>
                </div>

                {currentUser ? (
                  <div className="relative group">
                    <button className="flex items-center gap-3 bg-white dark:bg-white/5 pl-1 pr-4 py-1 rounded-full border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-700">
                          {currentUser.fullName.charAt(0)}
                      </div>
                      <div className="flex flex-col text-right">
                         <span className="text-slate-700 dark:text-slate-200 text-xs font-bold leading-none">{currentUser.fullName.split(' ')[0]}</span>
                      </div>
                      <ChevronDown size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-100 dark:border-white/10 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right z-50">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-1">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser.fullName}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.phone}</p>
                        </div>
                        
                        <button 
                            onClick={() => setCurrentView(currentUser.role === 'ADMIN' ? 'admin' : 'member-dashboard')}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
                        >
                            <LayoutDashboard size={16} /> Tableau de Bord
                        </button>
                        
                        {currentUser.role === 'ADMIN' && (
                            <button 
                                onClick={() => setCurrentView('admin')}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 transition-colors"
                            >
                                <Settings size={16} /> Paramètres
                            </button>
                        )}

                        <div className="h-px bg-slate-100 dark:bg-white/5 my-1"></div>
                        
                        <button 
                            onClick={onLogout} 
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                        >
                            <LogOut size={16} /> Déconnexion
                        </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setCurrentView('login')} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all hover:-translate-y-0.5">
                    <LogIn size={16} /> <span>Connexion</span>
                  </button>
                )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE HEADER with KEBAB MENU */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-[#022c22]/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
         <div onClick={() => setCurrentView('home')}>
            <Logo className="w-10 h-10" showText={true} />
         </div>
         <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 hover:bg-slate-200">
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                    {isMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
                </button>
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 origin-top-right"
                        >
                            <button onClick={() => {setCurrentView('home'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <HomeIcon size={16} /> Accueil
                            </button>
                            <button onClick={() => {setCurrentView('presentation'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <BookOpen size={16} /> Présentation
                            </button>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                            {currentUser ? (
                                <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2">
                                    <LogOut size={16} /> Déconnexion
                                </button>
                            ) : (
                                <button onClick={() => {setCurrentView('login'); setIsMenuOpen(false)}} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                                    <LogIn size={16} /> Connexion
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT */}
      <main className={`flex-grow relative z-0 w-full max-w-full overflow-x-hidden ${['home', 'presentation'].includes(currentView) ? '' : 'md:pt-32'}`}>
        {isDarkMode && (
          <>
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"></div>
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[128px] translate-x-1/3 translate-y-1/3 -z-10 pointer-events-none"></div>
          </>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MOBILE FLOATING PILL NAV */}
      <div className="md:hidden fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <div className="pointer-events-auto glass-nav rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/60 dark:border-white/10 p-2 px-6 flex items-center justify-between w-[85%] max-w-[340px] bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-2xl">
             <MobileTab view="home" label="Accueil" icon={HomeIcon} />
             {currentUser ? (
                <MobileTab view={currentUser.role === 'ADMIN' ? 'admin' : 'member-dashboard'} label="Espace" icon={LayoutDashboard} highlight={true} />
             ) : (
                <MobileTab view="register" label="Bâtisseur" icon={Hammer} highlight={true} />
             )}
             <MobileTab view="presentation" label="Projet" icon={BookOpen} />
        </div>
      </div>
    </div>
  );
};
