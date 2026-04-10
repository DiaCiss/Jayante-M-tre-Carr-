import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Logo className="w-10 h-10" showText={false} />
              <span className="text-xl font-serif font-bold text-white">Munawwirus-Suduur</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              Un projet communautaire pour l'édification du complexe Kër Serigne Touba à Thiaroye Azur. Bâtissons ensemble notre avenir spirituel et social.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-amber-500 transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Le Projet</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Faire un Don</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Devenir Membre</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Informations</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Mentions Légales</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Politique de Confidentialité</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">CGU</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Transparence Financière</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                <span>Thiaroye Azur, Dakar, Sénégal<br/>Route Nationale 1</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-emerald-500 shrink-0" size={18} />
                <span>+221 33 800 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-emerald-500 shrink-0" size={18} />
                <span>contact@munawwirus-suduur.sn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Fédération Munawwirus-Suduur. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Fait avec <Heart size={12} className="text-red-500 fill-red-500" /> par la Commission Digitale
          </p>
        </div>
      </div>
    </footer>
  );
};
