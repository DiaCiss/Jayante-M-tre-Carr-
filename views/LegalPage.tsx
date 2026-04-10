import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { LegalPage } from '../types';

interface LegalPageViewProps {
  slug: string;
}

export const LegalPageView: React.FC<LegalPageViewProps> = ({ slug }) => {
  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await api.getLegalPage(slug);
        setPage(data);
      } catch (err) {
        setError('Page non trouvée');
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32 text-red-500">
        {error || 'Erreur inconnue'}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-slate-50 dark:bg-emerald-950">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-8 md:p-12 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
          {page.title}
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* In a real app, use a Markdown renderer or sanitize HTML */}
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </div>
    </div>
  );
};
