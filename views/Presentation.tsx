
import React from 'react';
import { ViewState } from '../types';
import { Home, Heart, BookOpen, Quote, CheckCircle, ArrowRight, Layers, Users, Shield } from 'lucide-react';

interface PresentationProps {
  onNavigate: (view: ViewState) => void;
}

export const Presentation: React.FC<PresentationProps> = ({ onNavigate }) => {
  return (
    <div className="animate-fade-in bg-slate-50 dark:bg-emerald-950 transition-colors duration-300">
      
      {/* 1. HERO HEADER */}
      <div className="relative bg-emerald-900 pt-32 pb-24 overflow-hidden">
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 dark:from-emerald-950 to-transparent z-10 transition-colors duration-300"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-20 text-center">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-800 border border-emerald-700 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 animate-slide-up">
            Fédération Munawwirus-Suduur
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white mb-6 leading-tight animate-slide-up" style={{animationDelay: '0.1s'}}>
            Projet <span className="text-amber-400">Kër Serigne Touba</span> <br/> Thiaroye Azur
          </h1>
          <p className="text-xl text-emerald-100 italic font-light animate-slide-up" style={{animationDelay: '0.2s'}}>
            "Un édifice pour la foi, un centre pour le savoir, un foyer pour la solidarité."
          </p>
        </div>
      </div>

      {/* 2. INTRODUCTION & VISION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-30">
        <div className="bg-white dark:bg-slate-900/90 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 p-8 md:p-12 backdrop-blur-md">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-serif font-bold text-emerald-950 dark:text-white mb-6 flex items-center gap-3">
                        <span className="w-12 h-1 bg-amber-500"></span> Notre Ambition
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed text-justify">
                        Le projet <strong>« Kër Serigne Touba » Thiaroye Azur</strong> est une initiative majeure portée par la Fédération Munawwirus-Suduur. 
                        Il répond à une nécessité impérieuse : offrir à la communauté mouride de la localité un cadre digne, sécurisé et multifonctionnel.
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                        Au-delà de la construction physique, nous bâtissons un <strong>héritage spirituel et social</strong>. Ce complexe sera le cœur battant de la vie communautaire, 
                        permettant de perpétuer les enseignements de Cheikh Ahmadou Bamba dans un environnement adapté aux défis de notre époque.
                    </p>
                </div>
                <div className="md:w-1/2">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-8 border border-amber-100 dark:border-amber-800/50 relative">
                        <Quote className="text-amber-300 absolute top-4 left-4" size={60} />
                        <div className="relative z-10 text-center pt-4">
                            <p className="text-xl font-serif italic text-emerald-900 dark:text-amber-100 mb-6">
                            "Et entraidez-vous dans l’accomplissement des bonnes œuvres et de la piété."
                            </p>
                            <div className="inline-block border-t border-amber-300 pt-2">
                                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Sourate Al-Ma’ida (5:2)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. LES COMPOSANTES DU PROJET - Migrated to Home */}
      
      {/* 4. IMPACT & IMPORTANCE - Migrated to Home */}

      {/* CTA Footer - Migrated to Home */}
      <div className="bg-emerald-900 py-16 text-center">
         <div className="max-w-3xl mx-auto px-4">
             <h2 className="text-3xl font-serif font-bold text-white mb-6">Rejoignez-nous</h2>
             <p className="text-emerald-100 mb-8 text-lg">
                 Ensemble, bâtissons un avenir meilleur pour notre communauté.
             </p>
             <button 
                onClick={() => onNavigate('register')}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-full transition-all transform hover:-translate-y-1 shadow-xl"
             >
                 Devenir Membre
             </button>
         </div>
      </div>

    </div>
  );
};
