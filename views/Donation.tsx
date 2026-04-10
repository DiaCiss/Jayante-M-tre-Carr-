import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, CreditCard, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Donation = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    amount: 5000,
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [paymentMethod, setPaymentMethod] = useState<'WAVE' | 'OM'>('WAVE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.makeDonation({
        ...formData,
        method: paymentMethod
      });
      setStatus('success');
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-slate-50 dark:bg-emerald-950">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Merci pour votre don !</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Votre contribution de {formData.amount.toLocaleString()} FCFA a bien été enregistrée.
            Qu'Allah vous rétribue.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors"
          >
            Faire un autre don
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 dark:bg-emerald-950">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Faire un Don Libre
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Contribuez à la construction de l'édifice selon vos moyens.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Montant du don (FCFA)
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[1000, 5000, 10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amt })}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.amount === amt
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                min="500"
                required
              />
            </div>

            {/* Coordonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email (Optionnel)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Message de soutien (Optionnel)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-24 resize-none"
              />
            </div>

            {/* Méthode de paiement */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Moyen de paiement
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WAVE')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-xl border transition-all ${
                    paymentMethod === 'WAVE'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Smartphone className="text-blue-500" />
                  <span className="font-bold">Wave</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('OM')}
                  className={`flex items-center justify-center gap-3 py-4 rounded-xl border transition-all ${
                    paymentMethod === 'OM'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="text-orange-500" />
                  <span className="font-bold">Orange Money</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Heart className="fill-slate-900" size={20} />
                  Faire le don
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
