/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Goal, GoalFormData, GoalStatus } from './types/goal';
import { storageService } from './services/storageService';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { GoalList } from './components/GoalList';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Footer } from './components/Footer';

export default function App() {
  // Lista principal de objetivos carregada do localStorage
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  // Notificação toast simples para feedback imediato das ações
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // Carregar dados na inicialização
  useEffect(() => {
    const loadedGoals = storageService.getGoals();
    setGoals(loadedGoals);
    setIsLoading(false);
  }, []);

  // Estatísticas calculadas dinamicamente
  const stats = useMemo(() => {
    return storageService.calculateStats(goals);
  }, [goals]);

  // Abertura do modal para novo cadastro
  const handleOpenCreateModal = () => {
    setGoalToEdit(null);
    setIsFormModalOpen(true);
  };

  // Abertura do modal para edição
  const handleOpenEditModal = (goal: Goal) => {
    setGoalToEdit(goal);
    setIsFormModalOpen(true);
  };

  // Submissão do formulário (Criar ou Atualizar)
  const handleFormSubmit = (data: GoalFormData) => {
    if (goalToEdit) {
      const updated = storageService.updateGoal(goalToEdit.id, data);
      if (updated) {
        setGoals((prev) =>
          prev.map((g) => (g.id === updated.id ? updated : g))
        );
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.createGoal(data);
      setGoals((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
  };

  // Solicitação de exclusão (abre confirmação)
  const handleDeleteRequest = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  // Confirmação de exclusão
  const handleConfirmDelete = () => {
    if (goalToDelete) {
      const success = storageService.deleteGoal(goalToDelete.id);
      if (success) {
        setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
        showToast('Objetivo excluído com sucesso.');
      }
      setIsDeleteModalOpen(false);
      setGoalToDelete(null);
    }
  };

  // Atualização rápida de status direto do card
  const handleStatusChange = (goal: Goal, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(goal.id, {
      title: goal.title,
      description: goal.description,
      deadline: goal.deadline,
      status: newStatus,
    });
    if (updated) {
      setGoals((prev) =>
        prev.map((g) => (g.id === updated.id ? updated : g))
      );
      if (newStatus === 'concluido') {
        showToast('Parabéns! Meta de estudo concluída!');
      } else if (newStatus === 'em_andamento') {
        showToast('Objetivo marcado como em andamento.');
      } else {
        showToast('Status do objetivo atualizado.');
      }
    }
  };

  // Carregar exemplos de objetivos para novos estudantes
  const handleLoadSamples = () => {
    const samples = storageService.resetToSamples();
    setGoals(samples);
    showToast('Exemplos de estudo carregados!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600 font-medium">Carregando seus objetivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Navigation */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        totalGoals={stats.total}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Painel de Estatísticas e Contagem */}
        <StatsOverview stats={stats} />

        {/* Lista de Objetivos com Filtros, Busca e Ações */}
        <GoalList
          goals={goals}
          onEditGoal={handleOpenEditModal}
          onDeleteRequest={handleDeleteRequest}
          onStatusChange={handleStatusChange}
          onOpenCreateModal={handleOpenCreateModal}
          onLoadSamples={handleLoadSamples}
        />
      </main>

      {/* Rodapé */}
      <Footer />

      {/* Modal de Cadastro / Edição */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setGoalToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        goalToEdit={goalToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        goal={goalToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setGoalToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Notificação Toast Flutuante */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-700/60 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
