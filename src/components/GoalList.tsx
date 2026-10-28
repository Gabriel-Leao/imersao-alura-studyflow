/**
 * Componente que gerencia a exibição e os filtros da lista de objetivos de estudo.
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Goal, GoalFilter, GoalStatus } from '../types/goal';
import { GoalCard } from './GoalCard';
import { EmptyState } from './EmptyState';

interface GoalListProps {
  goals: Goal[];
  onEditGoal: (goal: Goal) => void;
  onDeleteRequest: (goal: Goal) => void;
  onStatusChange: (goal: Goal, newStatus: GoalStatus) => void;
  onOpenCreateModal: () => void;
  onLoadSamples: () => void;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  onEditGoal,
  onDeleteRequest,
  onStatusChange,
  onOpenCreateModal,
  onLoadSamples,
}) => {
  const [filter, setFilter] = useState<GoalFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'recent'>('deadline');

  // Filtragem e busca
  const filteredGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por status
    if (filter !== 'todos') {
      result = result.filter((g) => g.status === filter);
    }

    // Busca textual por título ou descrição
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        return a.deadline.localeCompare(b.deadline);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });

    return result;
  }, [goals, filter, searchQuery, sortBy]);

  const hasAnyGoal = goals.length > 0;
  const isFiltering = filter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <section aria-label="Lista de Objetivos de Estudo" className="space-y-4">
      {/* Barra de Filtros e Busca (exibida quando há objetivos cadastrados) */}
      {hasAnyGoal && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Controles Segmentados de Filtro por Status */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              <button
                type="button"
                onClick={() => setFilter('todos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'todos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({goals.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('nao_iniciado')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'nao_iniciado'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Não iniciados ({goals.filter((g) => g.status === 'nao_iniciado').length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('em_andamento')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'em_andamento'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Em andamento ({goals.filter((g) => g.status === 'em_andamento').length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('concluido')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filter === 'concluido'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Concluídos ({goals.filter((g) => g.status === 'concluido').length})
              </button>
            </div>

            {/* Ordenação */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sort-select" className="text-xs text-slate-500 font-medium whitespace-nowrap">
                Ordenar por:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'deadline' | 'recent')}
                className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="deadline">Prazo mais próximo</option>
                <option value="recent">Mais recentes primeiro</option>
              </select>
            </div>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título ou descrição..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      )}

      {/* Renderização da Lista de Objetivos */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEditGoal}
              onDeleteRequest={onDeleteRequest}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          isFiltered={isFiltering}
          onOpenCreateModal={onOpenCreateModal}
          onResetFilter={() => {
            setFilter('todos');
            setSearchQuery('');
          }}
          onLoadSamples={onLoadSamples}
        />
      )}
    </section>
  );
};
