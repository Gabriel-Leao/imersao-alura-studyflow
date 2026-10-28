/**
 * Cartão para apresentação individual de um objetivo de estudo.
 * Exibe título, descrição, prazo formatado, status e botões de ação (editar e excluir).
 */

import React from 'react';
import {
  Calendar,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  ListTodo,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { Goal, GoalStatus, STATUS_LABELS } from '../types/goal';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDeleteRequest: (goal: Goal) => void;
  onStatusChange: (goal: Goal, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  // Cálculo de dias restantes para o prazo
  const getDeadlineInfo = (deadlineStr: string) => {
    if (!deadlineStr) return { text: 'Sem prazo definido', isOverdue: false, isToday: false };

    // Comparar apenas as partes de data (ano-mês-dia) em horário local
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const deadlineDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Formatação em português
    const formattedDate = deadlineDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (diffDays < 0) {
      return {
        text: `Venceu há ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'dia' : 'dias'} (${formattedDate})`,
        isOverdue: true,
        isToday: false,
      };
    } else if (diffDays === 0) {
      return {
        text: `Vence hoje! (${formattedDate})`,
        isOverdue: false,
        isToday: true,
      };
    } else if (diffDays === 1) {
      return {
        text: `Vence amanhã (${formattedDate})`,
        isOverdue: false,
        isToday: false,
      };
    } else {
      return {
        text: `Prazo: ${formattedDate} (${diffDays} dias)`,
        isOverdue: false,
        isToday: false,
      };
    }
  };

  const deadlineInfo = getDeadlineInfo(goal.deadline);

  // Configuração visual de status
  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case 'concluido':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
          label: STATUS_LABELS.concluido,
          containerClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        };
      case 'em_andamento':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
          label: STATUS_LABELS.em_andamento,
          containerClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
        };
      case 'nao_iniciado':
      default:
        return {
          icon: <ListTodo className="w-3.5 h-3.5 text-slate-500 shrink-0" />,
          label: STATUS_LABELS.nao_iniciado,
          containerClass: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const statusBadge = getStatusBadge(goal.status);

  return (
    <article className="group bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Cabeçalho do Card: Status e Prazo */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {/* Badge de Status */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${statusBadge.containerClass}`}
          >
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </div>

          {/* Prazo com alerta inteligente */}
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-medium font-mono tabular-nums ${
              goal.status === 'concluido'
                ? 'text-slate-500'
                : deadlineInfo.isOverdue
                ? 'text-rose-600 font-semibold'
                : deadlineInfo.isToday
                ? 'text-amber-700 font-semibold'
                : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{deadlineInfo.text}</span>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold text-slate-900 tracking-tight leading-snug break-words ${
            goal.status === 'concluido' ? 'line-through text-slate-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description ? (
          <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line break-words">
            {goal.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mt-2">
            Sem anotações complementares.
          </p>
        )}
      </div>

      {/* Rodapé do Card com Ações Rápidas */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Ação rápida para trocar status com 1 clique */}
        <div className="flex items-center gap-1">
          {goal.status === 'nao_iniciado' && (
            <button
              type="button"
              onClick={() => onStatusChange(goal, 'em_andamento')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors cursor-pointer"
              title="Mudar status para Em andamento"
            >
              <span>Começar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {goal.status === 'em_andamento' && (
            <button
              type="button"
              onClick={() => onStatusChange(goal, 'concluido')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
              title="Marcar como Concluído"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Concluir</span>
            </button>
          )}

          {goal.status === 'concluido' && (
            <button
              type="button"
              onClick={() => onStatusChange(goal, 'em_andamento')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              title="Reabrir este objetivo"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reabrir</span>
            </button>
          )}
        </div>

        {/* Botões de Edição e Exclusão */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
            aria-label={`Editar objetivo "${goal.title}"`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(goal)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            aria-label={`Excluir objetivo "${goal.title}"`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Excluir</span>
          </button>
        </div>
      </div>
    </article>
  );
};
