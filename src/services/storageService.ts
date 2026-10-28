/**
 * Serviço de armazenamento local (localStorage) para o StudyFlow.
 * Gerencia a persistência dos objetivos de estudo sem necessidade de backend.
 */

import { Goal, GoalFormData, GoalStats } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

export const INITIAL_SAMPLE_GOALS: Goal[] = [
  {
    id: 'sample-1',
    title: 'Compreender a lógica de programação com variáveis e condicionais',
    description: 'Estudar os conceitos fundamentais de variáveis, tipos de dados e comandos if/else resolvendo 5 exercícios práticos.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Configurar o ambiente de estudos e terminal',
    description: 'Instalar o VS Code, extensões essenciais e praticar comandos básicos de navegação no terminal.',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Montar cronograma semanal de 30 minutos diários',
    description: 'Definir horários fixos de segunda a sexta para leitura técnica e anotações dos resumos.',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const storageService = {
  /**
   * Recupera a lista de objetivos do localStorage.
   */
  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com dados de exemplo na primeira visita para guiar o estudante
        this.saveGoals(INITIAL_SAMPLE_GOALS);
        return INITIAL_SAMPLE_GOALS;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveGoals(goals: Goal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria e salva um novo objetivo de estudo.
   */
  createGoal(formData: GoalFormData): Goal {
    const now = new Date().toISOString();
    const newGoal: Goal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: now,
      updatedAt: now,
    };

    const currentGoals = this.getGoals();
    const updatedGoals = [newGoal, ...currentGoals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateGoal(id: string, formData: GoalFormData): Goal | null {
    const currentGoals = this.getGoals();
    const index = currentGoals.findIndex((g) => g.id === id);

    if (index === -1) {
      return null;
    }

    const updatedGoal: Goal = {
      ...currentGoals[index],
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    currentGoals[index] = updatedGoal;
    this.saveGoals(currentGoals);
    return updatedGoal;
  },

  /**
   * Exclui um objetivo pelo ID.
   */
  deleteGoal(id: string): boolean {
    const currentGoals = this.getGoals();
    const filtered = currentGoals.filter((g) => g.id !== id);

    if (filtered.length === currentGoals.length) {
      return false;
    }

    this.saveGoals(filtered);
    return true;
  },

  /**
   * Carrega os objetivos de demonstração para novos estudantes.
   */
  resetToSamples(): Goal[] {
    this.saveGoals(INITIAL_SAMPLE_GOALS);
    return INITIAL_SAMPLE_GOALS;
  },

  /**
   * Limpa todos os objetivos.
   */
  clearAll(): void {
    this.saveGoals([]);
  },

  /**
   * Calcula as estatísticas dos objetivos.
   */
  calculateStats(goals: Goal[]): GoalStats {
    return {
      total: goals.length,
      naoIniciados: goals.filter((g) => g.status === 'nao_iniciado').length,
      emAndamento: goals.filter((g) => g.status === 'em_andamento').length,
      concluidos: goals.filter((g) => g.status === 'concluido').length,
    };
  },
};
