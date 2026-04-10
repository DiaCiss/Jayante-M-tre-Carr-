
import React, { useState } from 'react';
import { Member, Contribution, SQM_PRICE, PaymentMethod } from '../types';
import { Download, Bell, CreditCard, CheckCircle, PieChart, TrendingUp, Camera, Calendar } from 'lucide-react';

interface MemberDashboardProps {
  member: Member;
  allContributions: Contribution[];
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ member, allContributions }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const myContributions = allContributions.filter(c => c.memberId === member.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPaid = myContributions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalDue = member.sqmCommitted * SQM_PRICE;
  const progress = Math.min(100, Math.round((totalPaid / totalDue) * 100));
  const remaining = totalDue - totalPaid;

  const handleDownloadReceipt = () => {
    alert("Téléchargement du reçu en cours...");
  };

  const handlePhotoUpload = () => {
    alert("Fonctionnalité de mise à jour de photo à venir.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
         <div className="relative group cursor-pointer" onClick={handlePhotoUpload}>
            <div className="h-24 w-24 rounded-full border-4 border-emerald-100 dark:border-emerald-900 overflow-hidden">
                {member.photoUrl ? (
                    <img src={member.photoUrl} alt="Profil" className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full bg-emerald-50 dark:bg-emerald-900 flex items-center justify-center text-emerald-300 font-bold text-3xl">
                        {member.fullName.charAt(0)}
                    </div>
                )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
            </div>
         </div>
         <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{member.fullName}</h1>
            <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-bold px-2 py-0.5 rounded-full uppercase">Membre Actif</span>
                <span className="text-sm">Inscrit le {new Date(member.joinDate).toLocaleDateString()}</span>
            </p>
         </div>
         <div className="flex gap-3">
             <div className="text-right px-6 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Total Cotisé</p>
                 <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{totalPaid.toLocaleString()} FCFA</p>
             </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Main Status Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full -translate-y-32 translate-x-32 group-hover:scale-110 transition-transform duration-700"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
                <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 font-serif">
                    <PieChart className="text-emerald-600 dark:text-emerald-400" size={24} />
                    Suivi de l'engagement
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Objectif personnel : <span className="font-bold text-slate-900 dark:text-white">{totalDue.toLocaleString()} FCFA</span></p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${progress === 100 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'}`}>
                {progress === 100 ? 'Objectif Atteint' : `${progress}% Complété`}
                </div>
            </div>

            <div className="space-y-6">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden shadow-inner">
                   <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-4 rounded-full transition-all duration-1000" 
                    style={{ width: `${progress}%` }}
                   ></div>
                </div>

                <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-emerald-600 dark:text-emerald-400"/>
                        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider">Déjà Versé</p>
                    </div>
                    <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 tracking-tight">{totalPaid.toLocaleString()} <span className="text-sm font-medium opacity-70">FCFA</span></p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Reste à payer</p>
                    </div>
                    <p className="text-2xl font-extrabold text-slate-700 dark:text-white tracking-tight">{remaining.toLocaleString()} <span className="text-sm font-medium opacity-70">FCFA</span></p>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Notifications & Actions */}
        <div className="bg-slate-900 dark:bg-[#0f172a] rounded-2xl shadow-xl p-8 flex flex-col justify-between text-white relative overflow-hidden border border-slate-800">
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
           <div className="relative z-10">
             <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-3 font-serif">
               <Bell size={20} className="text-amber-400" />
               Rappels & Actions
             </h3>
             {remaining > 0 ? (
               <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 mb-6">
                 <p className="text-sm text-slate-200 leading-relaxed">
                   Pour tenir vos engagements sur 12 mois, une mensualité de <strong className="text-amber-400">{Math.ceil(remaining/12).toLocaleString()} FCFA</strong> est conseillée.
                 </p>
                 <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
                    <Calendar size={14} /> Prochaine échéance : 05 du mois
                 </div>
               </div>
             ) : (
                <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-5 mb-6">
                 <p className="text-sm text-emerald-200 flex items-start gap-2">
                   <CheckCircle size={18} className="shrink-0 mt-0.5"/> 
                   <span>Qu'Allah agrée votre contribution. Vous êtes un pilier de ce projet.</span>
                 </p>
               </div>
             )}
           </div>
           
           {remaining > 0 && (
             <button 
              onClick={() => setShowPaymentModal(true)}
              className="relative z-10 w-full py-4 bg-amber-500 text-emerald-950 font-bold rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-3 shadow-lg shadow-black/20"
             >
               <CreditCard size={20} />
               Faire un versement
             </button>
           )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg font-serif">Historique des 12 derniers mois</h3>
          </div>
          <button onClick={handleDownloadReceipt} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-emerald-200 text-sm font-medium flex items-center gap-2 transition-all">
            <Download size={16} /> 
            <span className="hidden sm:inline">Relevé</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mois / Motif</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Méthode</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Montant</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
              {myContributions.length > 0 ? (
                myContributions.map((contrib) => (
                  <tr key={contrib.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {new Date(contrib.date).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-900 dark:text-white font-semibold">
                      {contrib.monthFor}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                        {contrib.method}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-emerald-700 dark:text-emerald-400">
                      {contrib.amount.toLocaleString()} FCFA
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Validé
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-400 flex flex-col items-center">
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-3">
                         <TrendingUp size={24} className="text-slate-300 dark:text-slate-600"/>
                    </div>
                    Aucune transaction enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 shadow-2xl scale-100 transform transition-transform border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Moyens de Paiement</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Effectuez votre versement au numéro officiel ci-dessous.</p>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-center">
                 <p className="text-sm text-amber-800 dark:text-amber-400 font-bold uppercase mb-1">Numéro Officiel</p>
                 <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-wider">+221 77 313 91 57</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl">
                 <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">W</div>
                 <div>
                    <p className="font-bold text-slate-900 dark:text-white">Wave</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Envoi direct avec frais supportés si possible</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 border border-orange-100 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-900/20 rounded-xl">
                 <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">OM</div>
                 <div>
                    <p className="font-bold text-slate-900 dark:text-white">Orange Money</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Envoi direct</p>
                 </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
