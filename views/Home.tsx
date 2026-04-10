
import React, { useState, useEffect, useRef } from 'react';
import { Member, Contribution, ViewState, GlobalSettings, UserRole } from '../types';
import { Users, TrendingUp, Target, MapPin, ChevronRight, Award, PlayCircle, ChevronDown, CheckCircle2, Home as HomeIcon, Heart, BookOpen, CheckCircle, ArrowRight, Shield, Layers } from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Footer } from '../components/Footer';

interface HomeProps {
  members: Member[];
  contributions: Contribution[];
  onNavigate: (view: ViewState) => void;
  globalSettings: GlobalSettings;
}

const VERSES = [
  {
    text: "Ceux qui dépensent leurs biens dans le sentier d’Allah sont comparables à un grain qui produit sept épis, à cent grains par épi. Allah multiplie la récompense à qui Il veut.",
    ref: "Sourate Al-Baqara (2:261)"
  },
  {
    text: "Et entraidez-vous dans l’accomplissement des bonnes œuvres et de la piété.",
    ref: "Sourate Al-Ma’ida (5:2)"
  },
  {
    text: "Les croyants et les croyantes sont alliés les uns des autres... accomplissent la prière, donnent la zakat et obéissent à Allah et à Son Messager.",
    ref: "Sourate At-Tawba (9:71)"
  },
  {
    text: "Ceux qui donnent de leur bien, de nuit et de jour, en secret ou publiquement, auront leur récompense auprès de leur Seigneur.",
    ref: "Sourate Al-Hadid (57:18)"
  }
];

// Compteur Animé
const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      if (start === end) return;
      
      let totalMilSec = duration * 1000;
      const timer = setInterval(() => {
        const increment = Math.ceil(end / (totalMilSec / 16)); 
        start += increment;
        if (start > end) start = end;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// Jauge Circulaire Animée
const CircularProgress = ({ sqmData, target }: { sqmData: number, target: number }) => {
  const percentage = Math.min(100, Math.round((sqmData / target) * 100));
  const radius = 80;
  const stroke = 10; 
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const strokeDashoffset = isInView 
    ? circumference - (percentage / 100) * circumference 
    : circumference;

  return (
    <div ref={ref} className="relative flex flex-col items-center justify-center drop-shadow-lg scale-90 md:scale-100">
       <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
        <circle
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-slate-200 dark:text-emerald-900/40"
        />
        <circle
          stroke="#f59e0b" // Amber-500
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 2s ease-out' 
          }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-slate-800 dark:text-white">
        <span className="text-4xl font-bold font-serif">{percentage}%</span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Objectif</span>
      </div>
    </div>
  );
};

// Custom Video Player
const CustomVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="w-full h-full bg-black rounded-2xl overflow-hidden animate-fade-in">
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
          title="Présentation Projet KST"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative group cursor-pointer overflow-hidden rounded-2xl"
      onClick={() => setIsPlaying(true)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 to-black">
         <img 
            src="https://images.unsplash.com/photo-1564121211835-e88c852648ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
            alt="Video Cover" 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105"
         />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300">
             <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center pl-1 shadow-lg">
                <PlayCircle className="text-white" size={32} fill="currentColor" />
             </div>
         </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6">
         <h3 className="text-white font-serif font-bold text-xl drop-shadow-md">Découvrir le Projet</h3>
         <p className="text-emerald-100 text-sm">Présentation officielle par le comité • 3:45</p>
      </div>
    </div>
  );
};

export const Home: React.FC<HomeProps> = ({ members, contributions, onNavigate, globalSettings }) => {
  const [verseIndex, setVerseIndex] = useState(0);
  const [filterRecent, setFilterRecent] = useState(true);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // --- STATS CALCULATION (Real + Simulation) ---
  const realRaised = contributions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRaised = realRaised + globalSettings.manualRaisedOffset;
  const totalSQMReserved = members.reduce((acc, curr) => acc + curr.sqmCommitted, 0);
  const displayTargetSQM = globalSettings.targetSqm;
  
  // Rotate verses
  useEffect(() => {
    const interval = setInterval(() => {
      setVerseIndex((prev) => (prev + 1) % VERSES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Filtered list (Only Active Members)
  const activeMembers = members.filter(m => m.role !== UserRole.ADMIN && m.status === 'ACTIVE');
  const displayMembers = filterRecent 
    ? [...activeMembers].sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()).slice(0, 10)
    : activeMembers;

  const toggleMemberDetails = (id: string) => {
    setExpandedMember(expandedMember === id ? null : id);
  };

  return (
    <div className="animate-fade-in bg-slate-50 dark:bg-emerald-950 transition-colors duration-300 pb-20">
      
      {/* 1. HERO & BANNER */}
      <div className="relative bg-emerald-900 min-h-[550px] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 to-emerald-900/95"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-32 pb-24">
           <div className="mb-8 animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white tracking-tight mb-2 drop-shadow-2xl leading-tight">
                Munawwirus-Suduur
              </h1>
              <p className="text-xl md:text-2xl font-serif text-amber-400 font-bold uppercase tracking-widest drop-shadow-md">
                Kër Serigne Touba
              </p>
              <div className="h-1 w-24 bg-amber-500 mx-auto mt-6 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
           </div>

           <h2 className="text-lg md:text-2xl font-medium text-emerald-100 mb-10 italic font-serif opacity-90 max-w-2xl mx-auto">
             " Bâtissons ensemble le « Kër Serigne Touba » de Thiaroye Azur "
           </h2>

           {/* Animated Verse */}
           <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-h-[140px] flex flex-col justify-center items-center transition-all duration-500 shadow-2xl">
              <AnimatePresence mode="wait">
                  <motion.div
                    key={verseIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                      <p className="text-base md:text-lg text-white font-serif leading-relaxed italic mb-3">
                        « {VERSES[verseIndex].text} »
                      </p>
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                        — {VERSES[verseIndex].ref}
                      </span>
                  </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* 2. OBJECTIVE & STATS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="glass-card bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl">
            
            {/* Diagram */}
            <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 pb-8 md:pb-0 md:pr-8">
               <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 font-serif uppercase tracking-wide flex items-center gap-2">
                 <Target className="text-amber-500" /> Objectif Global
               </h3>
               <CircularProgress sqmData={totalSQMReserved} target={displayTargetSQM} />
               <p className="mt-4 text-center text-slate-600 dark:text-slate-300">
                 <strong className="text-emerald-700 dark:text-emerald-400 text-xl"><AnimatedCounter value={totalSQMReserved} /> m²</strong> sécurisés sur <span className="font-semibold">{displayTargetSQM} m²</span>
               </p>
            </div>

            {/* Key Stats */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 pl-0 md:pl-8">
               <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/40 dark:to-slate-900 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-sm">
                        <TrendingUp size={24} />
                     </div>
                     <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-2 py-1 rounded">En cours</span>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 font-semibold uppercase tracking-wider">Fonds Collectés</p>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-emerald-900 dark:text-white mt-1 break-all">
                     <AnimatedCounter value={totalRaised} /> <span className="text-sm font-sans font-normal text-emerald-700 dark:text-emerald-400">FCFA</span>
                  </p>
               </div>

               <div className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-white dark:bg-white/10 text-amber-600 dark:text-amber-400 rounded-xl shadow-sm">
                        <Users size={24} />
                     </div>
                     <span className="bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs font-bold px-2 py-1 rounded">Bâtisseurs</span>
                  </div>
                  <p className="text-sm text-amber-800 dark:text-amber-300 font-semibold uppercase tracking-wider">Membres Actifs</p>
                  <p className="text-2xl md:text-3xl font-serif font-bold text-amber-900 dark:text-white mt-1"><AnimatedCounter value={activeMembers.length} /></p>
               </div>
            </div>
        </div>
      </div>

      {/* 3. LISTE DES BÂTISSEURS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
         <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
               <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white flex items-center gap-3">
                 <Award className="text-amber-500" size={32} />
                 Le Cercle des Bâtisseurs
               </h2>
               <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                 Reconnaissance à ceux qui contribuent à l'édification de ce projet béni.
               </p>
            </div>
            
            <div className="flex bg-white dark:bg-white/5 p-1 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
               <button 
                 onClick={() => setFilterRecent(true)}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filterRecent ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10'}`}
               >
                 Récents
               </button>
               <button 
                 onClick={() => setFilterRecent(false)}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${!filterRecent ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10'}`}
               >
                 Tous
               </button>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-900/50 rounded-2xl shadow-lg border border-slate-200 dark:border-white/10 overflow-hidden animate-fade-in backdrop-blur-sm">
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-slate-100 dark:divide-white/5">
                 <thead className="bg-slate-50 dark:bg-white/5">
                   <tr>
                     <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bâtisseur</th>
                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Engagement</th>
                     <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progression</th>
                     <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-transparent">
                   {displayMembers.map((member) => {
                     const paid = contributions.filter(c => c.memberId === member.id && c.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0);
                     const totalDue = member.sqmCommitted * 50000;
                     const percent = Math.min(100, Math.round((paid / totalDue) * 100));
                     const isExpanded = expandedMember === member.id;
                     
                     // Badges for Top Contributors
                     const isGold = paid >= 500000;
                     const isSilver = paid >= 250000 && paid < 500000;

                     return (
                       <React.Fragment key={member.id}>
                       <tr 
                          onClick={() => toggleMemberDetails(member.id)}
                          className={`cursor-pointer transition-colors ${isExpanded ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
                       >
                         <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 relative">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${isGold ? 'bg-amber-400 text-white border-2 border-amber-200' : isSilver ? 'bg-slate-300 text-slate-800 border-2 border-slate-200' : 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200'}`}>
                                    {member.fullName.charAt(0)}
                                </div>
                                {isGold && <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[8px] px-1 rounded-full border border-white">OR</div>}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-slate-900 dark:text-white">{member.fullName}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <MapPin size={10} /> {member.address || 'Thiaroye Azur'}
                                </div>
                              </div>
                            </div>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                               {member.sqmCommitted} m²
                            </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-center align-middle">
                            <div className="w-full max-w-[120px] bg-slate-100 dark:bg-white/10 rounded-full h-1.5 mx-auto mb-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">{percent}%</span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-right">
                            <ChevronDown size={18} className={`inline-block text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                         </td>
                       </tr>
                       
                       <AnimatePresence>
                         {isExpanded && (
                           <tr>
                             <td colSpan={4} className="p-0 border-b border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/20">
                               <motion.div 
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: 'auto', opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{ duration: 0.3 }}
                                 className="overflow-hidden"
                               >
                                 <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Montant Total Versé</p>
                                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{paid.toLocaleString()} FCFA</p>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Dernière Contribution</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300">
                                            {contributions.filter(c => c.memberId === member.id && c.status === 'completed').length > 0 
                                                ? new Date(contributions.filter(c => c.memberId === member.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).toLocaleDateString()
                                                : 'Aucune'}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-end">
                                        {percent >= 100 ? (
                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-2 rounded-lg">
                                                <CheckCircle2 size={18} /> <span className="text-sm font-bold">Objectif Atteint !</span>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                                                Encore {(totalDue - paid).toLocaleString()} FCFA
                                            </div>
                                        )}
                                    </div>
                                 </div>
                               </motion.div>
                             </td>
                           </tr>
                         )}
                       </AnimatePresence>
                       </React.Fragment>
                     );
                   })}
                 </tbody>
               </table>
             </div>
         </div>
      </div>

      {/* 4. PRÉSENTATION VIDEO */}
      <div className="bg-slate-100 dark:bg-slate-900 py-20 relative overflow-hidden transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                 <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">Le Complexe Multifonctionnel</h2>
                 <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                     Découvrez la vision architecturale et spirituelle derrière le projet Kër Serigne Touba. Un espace conçu pour durer et servir la communauté.
                 </p>
                 <button onClick={() => onNavigate('presentation')} className="text-emerald-600 font-bold hover:underline flex items-center gap-2">
                     Voir tous les détails <ChevronRight size={16} />
                 </button>
              </div>
              <div className="md:w-1/2 w-full">
                 <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
                     <CustomVideoPlayer />
                 </div>
              </div>
         </div>
      </div>

      {/* 5. UN COMPLEXE, 3 PILIERS */}
      <div className="bg-white dark:bg-[#033025] py-20 relative overflow-hidden transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-emerald-950 dark:text-white">Un Complexe, Trois Piliers</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-2xl mx-auto">Une structure intégrée conçue pour répondre aux besoins spirituels, sociaux et éducatifs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Pilier 1 : Résidence */}
               <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-amber-500 dark:border-amber-600">
                  <div className="bg-emerald-900 dark:bg-emerald-950 h-40 flex items-center justify-center relative">
                     <div className="absolute inset-0 bg-black/20"></div>
                     <HomeIcon size={64} className="text-amber-400 relative z-10" />
                  </div>
                  <div className="p-8">
                     <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">La Résidence</h3>
                     <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase mb-4 tracking-wide">Kër Serigne Touba</h4>
                     <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm text-justify">
                        Un espace d’hospitalité (Teranga) conforme à la tradition mouride. Elle servira de lieu d'accueil pour les dignitaires (représentants du Khalif) et d'abri pour les membres de la communauté en besoin.
                     </p>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-400">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>Accueil des dignitaires religieux</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-400">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>Hébergement solidaire</span>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Pilier 2 : Mosquée */}
               <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-emerald-500">
                  <div className="bg-emerald-800 dark:bg-emerald-900 h-40 flex items-center justify-center relative">
                     <div className="absolute inset-0 bg-black/20"></div>
                     <Heart size={64} className="text-emerald-300 relative z-10" />
                  </div>
                  <div className="p-8">
                     <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">La Mosquée</h3>
                     <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-4 tracking-wide">Espace de Culte</h4>
                     <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm text-justify">
                        Le cœur spirituel du complexe. Un lieu dédié aux prières quotidiennes, aux prières de l'Eid, et aux cérémonies religieuses (Thiant, déclamation des Xaça’id).
                     </p>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-400">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>Prières & rassemblements</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-400">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>Cadre de recueillement adéquat</span>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Pilier 3 : Dâra */}
               <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-amber-500 dark:border-amber-600">
                  <div className="bg-emerald-700 dark:bg-emerald-800 h-40 flex items-center justify-center relative">
                     <div className="absolute inset-0 bg-black/20"></div>
                     <BookOpen size={64} className="text-white relative z-10" />
                  </div>
                  <div className="p-8">
                     <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">Le Dâra Moderne</h3>
                     <h4 className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase mb-4 tracking-wide">Éducation & Formation</h4>
                     <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm text-justify">
                        Un institut éducatif novateur alliant l'enseignement des valeurs mourides (Xaça’id) couplé à des formations professionnelles modernes (Infographie, Web, Entrepreneuriat) pour préparer une jeunesse responsable.
                     </p>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-400">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>Enseignement Coran & Xaça’id</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-400">
                            <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span>Formation professionnelle (Numérique)</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 6. FAITES PARTIE DE L'HISTOIRE (ENGAGEMENT) */}
      <div className="bg-emerald-900 py-16 text-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
         <div className="max-w-3xl mx-auto px-4 relative z-10">
             <h2 className="text-3xl font-serif font-bold text-white mb-6">Faites partie de l'histoire</h2>
             <p className="text-emerald-100 mb-8 text-lg">
                 Chaque brique posée est une aumône continue (Sadaqa Jariya). Rejoignez le cercle des bâtisseurs dès aujourd'hui.
             </p>
             <button 
                onClick={() => onNavigate('register')}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold rounded-full transition-all transform hover:-translate-y-1 shadow-xl"
             >
                 Je m'engage maintenant
             </button>
         </div>
      </div>

      {/* 7. POURQUOI CE PROJET EST VITAL */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50 dark:bg-emerald-950 transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-16">
              <div className="md:w-1/3">
                  <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-amber-500 pl-4">
                      Pourquoi ce projet est vital ?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                      Le projet Kër Serigne Touba n’est pas seulement une construction, c'est une réponse structurelle aux défis de notre localité. Il incarne un modèle de développement endogène basé sur nos valeurs.
                  </p>
                  <div className="mt-8">
                      <button 
                        onClick={() => onNavigate('register')}
                        className="group flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
                      >
                          Rejoindre le projet <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              </div>
              
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-emerald-900/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                      <Users className="text-emerald-600 dark:text-emerald-400 mb-3" size={32} />
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Cohésion Sociale</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Un espace communautaire centralisé favorisant les rassemblements et renforçant les liens fraternels.</p>
                  </div>
                  <div className="bg-white dark:bg-amber-900/20 p-6 rounded-xl border border-amber-100 dark:border-amber-800/50 shadow-sm">
                      <Shield className="text-amber-600 dark:text-amber-500 mb-3" size={32} />
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Sécurité & Cadre</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Une structure pérenne permettant d'organiser des activités culturelles et religieuses dans un cadre sécurisé.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                      <Layers className="text-slate-600 dark:text-slate-400 mb-3" size={32} />
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Modèle Économique</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Une mobilisation des ressources locales prouvant notre capacité à l'autonomie et à la solidarité.</p>
                  </div>
                  <div className="bg-white dark:bg-emerald-900/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
                      <BookOpen className="text-emerald-600 dark:text-emerald-400 mb-3" size={32} />
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Avenir de la Jeunesse</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Préserver la jeunesse de la dépravation morale en offrant un cadre éducatif sain et porteur d'avenir.</p>
                  </div>
              </div>
          </div>
      </div>

      <Footer />

    </div>
  );
};
