/**
 * Rodapé informativo do StudyFlow.
 */

import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <span>StudyFlow</span>
          <span>·</span>
          <span>Seu organizador de estudos diário</span>
        </div>
        <p className="flex items-center gap-1 text-slate-400">
          Feito para apoiar estudantes no início de sua jornada
        </p>
      </div>
    </footer>
  );
};
