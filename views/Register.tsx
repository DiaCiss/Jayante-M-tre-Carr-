
import React, { useState } from 'react';
import { Member, SQM_PRICE, UserRole, UserStatus } from '../types';
import { CheckCircle, ChevronRight, ArrowLeft, UserPlus, Home, Lock, Loader2 } from 'lucide-react';

interface RegisterProps {
  onRegister: (member: Member) => Promise<void>;
}

export const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    sqmCommitted: 1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
      setStep(2);
      return;
    }
    
    setIsLoading(true);
    // Finalize
    const newMember: Member = {
      id: `KST-${Math.floor(Math.random() * 10000)}`,
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      password: formData.password, 
      sqmCommitted: Number(formData.sqmCommitted),
      joinDate: new Date().toISOString(),
      role: UserRole.MEMBER,
      status: UserStatus.PENDING
    };
    
    await onRegister(newMember);
    setIsLoading(false);
  };

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm";

  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4 flex items-center justify-center bg-slate-50 dark:bg-emerald-950 transition-colors duration-300">
      <div className="max-w-2xl w-full mx-auto">
        
        {/* Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-t-3xl p-8 text-center shadow-lg relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-2xl transform translate-x-10 -translate-y-10 pointer-events-none"></div>
             <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-500 dark:text-amber-400 mb-4 border border-amber-100 dark:border-amber-800 shadow-sm">
                    <UserPlus size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Inscription Membre</h2>
                <p className="text-slate-500 dark:text-slate-400">Rejoignez le cercle des bâtisseurs</p>
             </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-b-3xl shadow-xl p-8 border-t-0">
          {/* Progress Steps */}
          <div className="mb-10">
             <div className="flex items-center justify-between relative z-10">
                <div className={`flex flex-col items-center transition-colors duration-500 ${step >= 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-500 ${step >= 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900/50' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        1
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider">Identité</span>
                </div>
                
                <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 mx-4 rounded-full overflow-hidden">
                    <div className={`h-full bg-amber-500 transition-all duration-500 ease-out ${step === 2 ? 'w-full' : 'w-1/2'}`}></div>
                </div>

                <div className={`flex flex-col items-center transition-colors duration-500 ${step >= 2 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition-all duration-500 ${step >= 2 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900/50' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        2
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider">Engagement</span>
                </div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="relative min-h-[400px]">
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 gap-4">
                    <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom Complet</label>
                        <input
                            required
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="ex: Moussa Diop"
                            autoComplete="name"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
                        <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="77 000 00 00"
                        autoComplete="tel"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Adresse</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Ville, Quartier"
                            autoComplete="street-address"
                        />
                    </div>
                    
                    {/* Security */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="group">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Lock size={14}/> Mot de passe</label>
                            <input
                            required
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            />
                        </div>
                         <div className="group">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1"><Lock size={14}/> Confirmer</label>
                            <input
                            required
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`${inputClass} ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            />
                        </div>
                    </div>
                </div>
                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/50"
                    >
                        <span>Continuer</span>
                        <ChevronRight size={20} />
                    </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                 <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                            <Home size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Votre Contribution</h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-6">
                        <div className="w-full md:w-auto">
                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block">Surface souhaitée (m²)</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="100"
                                name="sqmCommitted"
                                value={formData.sqmCommitted}
                                onChange={handleChange}
                                className="w-full md:w-32 px-4 py-3 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl focus:border-emerald-500 focus:ring-0 text-center font-bold text-2xl text-slate-900 dark:text-white outline-none transition-colors"
                            />
                        </div>
                        <div className="hidden md:block h-12 w-px bg-slate-300 dark:bg-slate-700"></div>
                        <div className="w-full md:w-auto flex-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100 p-4 rounded-xl shadow-sm">
                            <p className="text-emerald-700 dark:text-emerald-400 text-xs font-medium uppercase tracking-wider mb-1">Montant Total Estimé</p>
                            <p className="text-3xl font-bold tracking-tight">{(formData.sqmCommitted * SQM_PRICE).toLocaleString()} <span className="text-lg font-normal text-emerald-600 dark:text-emerald-400">FCFA</span></p>
                        </div>
                    </div>
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">Prix unitaire : <span className="font-semibold text-slate-800 dark:text-white">{SQM_PRICE.toLocaleString()} FCFA / m²</span></p>
                 </div>

                 <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 text-sm rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <CheckCircle className="flex-shrink-0 mt-0.5 text-amber-500" size={18} />
                    <p>Engagement moral. Paiement échelonné possible.</p>
                 </div>

                 <div className="flex gap-4 pt-4">
                   <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isLoading}
                    className="w-1/3 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} /> Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-2/3 py-4 bg-amber-400 text-slate-900 font-bold rounded-xl hover:bg-amber-300 transition-all shadow-lg shadow-amber-100 dark:shadow-amber-900/40 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : "Confirmer l'inscription"}
                  </button>
                 </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
