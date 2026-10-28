/**
 * Tipos de dados para o gerenciamento de objetivos de estudo no StudyFlow.
 */

export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface GoalFormData {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
}

export type GoalFilter = 'todos' | GoalStatus;

export interface GoalStats {
  total: number;
  naoIniciados: number;
  emAndamento: number;
  concluidos: number;
}

export const STATUS_LABELS: Record<GoalStatus, string> = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
};

export const STATUS_DESCRIPTIONS: Record<GoalStatus, string> = {
  nao_iniciado: 'Objetivo planejado, ainda não começou.',
  em_andamento: 'Estudos ativos e em progresso.',
  concluido: 'Meta concluída com sucesso!',
};
