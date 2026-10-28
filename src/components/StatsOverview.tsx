/**
 * Componente que exibe a contagem e visão geral dos objetivos cadastrados.
 * Exibe a quantidade total de objetivos e a divisão por status de estudo.
 */

import React from 'react';
import { Target, Clock, CheckCircle2, ListTodo } from 'lucide-react';
import { GoalStats } from '../types/goal';

interface StatsOverviewProps {
  stats: GoalStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.concluidos / stats.total) * 100) 
    : 0;

  return (
    <section aria-label="Resumo dos objetivos" className="space-y-4">
      {/* Mensagem de Boas-vindas e Contagem Principal */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Organize seus passos no aprendizado
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Defina metas curtas e claras para manter a constância nos seus estudos.
              Você tem <strong className="text-slate-900 font-semibold">{stats.total} {stats.total === 1 ? 'objetivo cadastrado' : 'objetivos cadastrados'}</strong> no total.
            </p>
          </div>

          {/* Barra de Progresso Geral */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 sm:p-4 min-w-[200px] shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Progresso geral</span>
              <span className="font-mono tabular-nums">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
                role="progressbar"
                aria-valuenow={completionPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 text-right font-medium">
              {stats.concluidos} de {stats.total} concluídos
            </p>
          </div>
        </div>

        {/* 4 Cards de Métricas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-slate-100">
          {/* Total */}
          <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Total Cadastrado</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {stats.total}
            </p>
          </div>

          {/* Não Iniciados */}
          <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1">
              <ListTodo className="w-4 h-4 text-slate-500" />
              <span>Não iniciados</span>
            </div>
            <p className="text-2xl font-bold text-slate-700 font-mono tabular-nums">
              {stats.naoIniciados}
            </p>
          </div>

          {/* Em Andamento */}
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-medium mb-1">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Em andamento</span>
            </div>
            <p className="text-2xl font-bold text-amber-900 font-mono tabular-nums">
              {stats.emAndamento}
            </p>
          </div>

          {/* Concluídos */}
          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-medium mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Concluídos</span>
            </div>
            <p className="text-2xl font-bold text-emerald-900 font-mono tabular-nums">
              {stats.concluidos}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
