import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    // Mock send
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 dark:bg-emerald-950">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">Contactez-nous</h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Une question ? Une suggestion ? N'hésitez pas à nous écrire ou à nous rendre visite.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Adresse</h3>
                <p className="text-slate-600 dark:text-slate-300">{settings?.contactInfo?.address || 'Chargement...'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Téléphone</h3>
                <p className="text-slate-600 dark:text-slate-300">{settings?.contactInfo?.phone || 'Chargement...'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full text-emerald-600 dark:text-emerald-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Email</h3>
                <p className="text-slate-600 dark:text-slate-300">{settings?.contactInfo?.email || 'Chargement...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Envoyez un message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nom complet</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input 
                type="email" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea 
                required 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32 resize-none"
              />
            </div>
            <button 
              type="submit" 
              disabled={status === 'loading' || status === 'success'}
              className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                status === 'success' 
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1'
              }`}
            >
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : status === 'success' ? (
                'Message envoyé !'
              ) : (
                <>Envoyer <Send size={18} /></>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
