
import React, { useState } from 'react';
import { LogIn, User, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';

interface LoginProps {
  onLogin: (identifier: string, pass: string) => Promise<void>;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onLogin(identifier, password);
    setIsLoading(false);
  };

  const handleDemoMember = () => {
    setIdentifier("770000001");
    setPassword(""); // Mock pass
  };

  const handleDemoAdmin = () => {
    setIdentifier("admin");
    setPassword("admin123");
  };

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 shadow-sm";

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-emerald-950 transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-100 dark:border-slate-800">
        
        {/* Left Side: Visual */}
        <div className="md:w-1/2 bg-emerald-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400 via-emerald-800 to-black"></div>
             
             <div className="relative z-10">
                 <div className="mb-6">
                    <Logo className="w-24 h-24" />
                 </div>
                 <h2 className="text-3xl font-bold mb-4 font-serif">Espace Membre</h2>
                 <p className="text-emerald-100/90 leading-relaxed">
                     Connectez-vous pour suivre vos cotisations et l'avancement du projet Kër Serigne Touba.
                 </p>
             </div>

             <div className="relative z-10 mt-12 space-y-4">
                 <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                     <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">Accès Démo</p>
                     <div className="grid grid-cols-2 gap-3">
                         <button 
                            onClick={handleDemoMember}
                            type="button"
                            className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group border border-white/10"
                         >
                            <User size={20} className="mb-1 text-emerald-200 group-hover:text-white" />
                            <span className="text-xs font-medium text-slate-200">Membre</span>
                         </button>
                         <button 
                            onClick={handleDemoAdmin}
                            type="button"
                            className="flex flex-col items-center justify-center p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group border border-white/10"
                         >
                            <ShieldCheck size={20} className="mb-1 text-amber-400 group-hover:text-amber-300" />
                            <span className="text-xs font-medium text-slate-200">Admin</span>
                         </button>
                     </div>
                 </div>
             </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-8 text-emerald-700 dark:text-emerald-400">
             <LogIn size={24} />
             <h2 className="text-2xl font-bold font-serif">Connexion</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Numéro de téléphone
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={inputClass}
                placeholder="77 000 00 00"
                autoComplete="tel"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Mot de passe</label>
                 <a href="#" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">Oublié ?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <>
                  <span>Se Connecter</span>
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                     <Zap size={12} fill="currentColor" />
                  </div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Vous n'avez pas de compte ? <br/>
                <button className="text-amber-500 font-bold hover:underline mt-1">Créer un compte</button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
