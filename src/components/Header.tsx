/**
 * Cabeçalho principal do StudyFlow.
 * Segue o contrato de Top Bar com branding, indicador e ação primária de novo objetivo.
 */

import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, totalGoals }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Marca do Produto */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              StudyFlow
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Metas de Estudo para Iniciantes
            </span>
          </div>
        </div>

        {/* Informação e Ação Principal */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center text-xs text-slate-500 font-medium mr-2">
            <span>{totalGoals} {totalGoals === 1 ? 'objetivo cadastrado' : 'objetivos cadastrados'}</span>
          </div>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
