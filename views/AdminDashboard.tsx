import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Member, Contribution, GlobalSettings, UserRole, UserStatus } from '../types';
import { Users, DollarSign, Settings, Activity, Search, Filter, Download, Trash2, Edit, Save, Plus, X, FileText, Share2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'contributions' | 'settings' | 'content' | 'legal'>('overview');
  const [members, setMembers] = useState<Member[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, contributionsData, settingsData] = await Promise.all([
          api.getMembers(),
          api.getContributions(),
          api.getSettings()
        ]);
        setMembers(membersData);
        setContributions(contributionsData);
        setSettings(settingsData);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      await api.updateSettings(settings);
      alert('Paramètres sauvegardés !');
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderSettings = () => {
    if (!settings) return null;
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Settings className="text-emerald-600" /> Paramètres Globaux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Objectif Surface (m²)</label>
              <input 
                type="number" 
                value={settings.targetSqm}
                onChange={(e) => setSettings({...settings, targetSqm: Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prix du m² (FCFA)</label>
              <input 
                type="number" 
                value={settings.sqmPrice}
                onChange={(e) => setSettings({...settings, sqmPrice: Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Objectif Financier (FCFA)</label>
              <input 
                type="number" 
                value={settings.targetAmount}
                onChange={(e) => setSettings({...settings, targetAmount: Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contribution Hors-Ligne (Offset)</label>
              <input 
                type="number" 
                value={settings.manualRaisedOffset}
                onChange={(e) => setSettings({...settings, manualRaisedOffset: Number(e.target.value)})}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.isSimulationMode}
                  onChange={(e) => setSettings({...settings, isSimulationMode: e.target.checked})}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Mode Simulation (Dons fictifs)</span>
             </label>
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSaveSettings} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors">
              <Save size={18} /> Sauvegarder
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (!settings) return null;
    return (
      <div className="space-y-8">
        {/* Contact Info */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Phone className="text-blue-600" /> Coordonnées
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Adresse</label>
                <input 
                  type="text" 
                  value={settings.contactInfo?.address || ''}
                  onChange={(e) => setSettings({...settings, contactInfo: {...settings.contactInfo, address: e.target.value}})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Téléphone</label>
                <input 
                  type="text" 
                  value={settings.contactInfo?.phone || ''}
                  onChange={(e) => setSettings({...settings, contactInfo: {...settings.contactInfo, phone: e.target.value}})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input 
                  type="text" 
                  value={settings.contactInfo?.email || ''}
                  onChange={(e) => setSettings({...settings, contactInfo: {...settings.contactInfo, email: e.target.value}})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
             </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Share2 className="text-purple-600" /> Réseaux Sociaux
          </h3>
          <div className="space-y-4">
            {settings.socialLinks?.map((link: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-24 font-medium capitalize text-slate-700 dark:text-slate-300">{link.platform}</span>
                <input 
                  type="text" 
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...settings.socialLinks];
                    newLinks[index].url = e.target.value;
                    setSettings({...settings, socialLinks: newLinks});
                  }}
                  className="flex-grow px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={link.enabled}
                    onChange={(e) => {
                      const newLinks = [...settings.socialLinks];
                      newLinks[index].enabled = e.target.checked;
                      setSettings({...settings, socialLinks: newLinks});
                    }}
                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-500">Actif</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors">
              <Save size={18} /> Sauvegarder
            </button>
        </div>
      </div>
    );
  };

  const renderLegal = () => {
    if (!settings) return null;
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="text-slate-600 dark:text-slate-400" /> Pages Légales
          </h3>
          <div className="space-y-8">
            {settings.legalPages?.map((page: any, index: number) => (
              <div key={page.slug} className="border-b border-slate-100 dark:border-slate-800 pb-8 last:border-0">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{page.title}</h4>
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">/{page.slug}</span>
                </div>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={page.title}
                    onChange={(e) => {
                      const newPages = [...settings.legalPages];
                      newPages[index].title = e.target.value;
                      setSettings({...settings, legalPages: newPages});
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    placeholder="Titre de la page"
                  />
                  <textarea 
                    value={page.content}
                    onChange={(e) => {
                      const newPages = [...settings.legalPages];
                      newPages[index].content = e.target.value;
                      setSettings({...settings, legalPages: newPages});
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white h-48 font-mono text-sm"
                    placeholder="Contenu HTML ou Texte..."
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSaveSettings} className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors">
              <Save size={18} /> Sauvegarder
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 dark:bg-emerald-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Administration</h1>
            <p className="text-slate-600 dark:text-slate-300">Gestion globale de la plateforme</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Download size={18} /> Export
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
                <Plus size={18} /> Contribution
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
            { id: 'members', label: 'Membres', icon: Users },
            { id: 'contributions', label: 'Contributions', icon: DollarSign },
            { id: 'settings', label: 'Paramètres', icon: Settings },
            { id: 'content', label: 'Contenu', icon: Edit },
            { id: 'legal', label: 'Pages Légales', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Total Collecté</h3>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {contributions.reduce((acc, c) => acc + c.amount, 0).toLocaleString()} FCFA
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Membres Actifs</h3>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {members.length}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-slate-500 dark:text-slate-400 font-medium mb-2">Contributions</h3>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {contributions.length}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'members' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="relative flex-grow max-w-md">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                        type="text" 
                        placeholder="Rechercher un membre..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                     />
                  </div>
                  <div className="flex items-center gap-2">
                     <Filter size={18} className="text-slate-400" />
                     <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                     >
                        <option value="ALL">Tous les statuts</option>
                        <option value="ACTIVE">Actif</option>
                        <option value="PENDING">En attente</option>
                        <option value="BANNED">Banni</option>
                     </select>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        <tr>
                           <th className="px-6 py-4 font-medium">Membre</th>
                           <th className="px-6 py-4 font-medium">Contact</th>
                           <th className="px-6 py-4 font-medium">Engagement</th>
                           <th className="px-6 py-4 font-medium">Statut</th>
                           <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredMembers.map((member) => (
                           <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="font-bold text-slate-900 dark:text-white">{member.fullName}</div>
                                 <div className="text-xs text-slate-500">Inscrit le {new Date(member.joinDate).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{member.phone}</td>
                              <td className="px-6 py-4">
                                 <div className="font-bold text-emerald-600 dark:text-emerald-400">{member.sqmCommitted} m²</div>
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    member.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                    member.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                 }`}>
                                    {member.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit size={16} /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'contributions' && (
             <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-medium">Date</th>
                      <th className="px-6 py-4 font-medium">Donateur</th>
                      <th className="px-6 py-4 font-medium">Montant</th>
                      <th className="px-6 py-4 font-medium">Méthode</th>
                      <th className="px-6 py-4 font-medium">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contributions.map((contrib) => (
                      <tr key={contrib.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{new Date(contrib.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          {contrib.memberId ? members.find(m => m.id === contrib.memberId)?.fullName : (contrib.donorName || 'Anonyme')}
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">{contrib.amount.toLocaleString()} FCFA</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{contrib.method}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{contrib.type || 'MEMBER'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          )}

          {activeTab === 'settings' && renderSettings()}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'legal' && renderLegal()}
        </div>
      </div>
    </div>
  );
};
