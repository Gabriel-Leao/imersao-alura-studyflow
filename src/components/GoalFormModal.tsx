/**
 * Modal e formulário para cadastro e edição de objetivos de estudo no StudyFlow.
 * Interface intuitiva, acolhedora e com validações em português do Brasil.
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { Goal, GoalFormData, GoalStatus } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goalToEdit?: Goal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}) => {
  // Data de hoje como mínimo recomendado
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    deadline: todayStr,
    status: 'nao_iniciado',
  });

  const [errors, setErrors] = useState<{
    title?: string;
    deadline?: string;
  }>({});

  // Sincroniza formulário com o objetivo sendo editado ou limpa para novo
  useEffect(() => {
    if (goalToEdit) {
      setFormData({
        title: goalToEdit.title,
        description: goalToEdit.description || '',
        deadline: goalToEdit.deadline,
        status: goalToEdit.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: todayStr,
        status: 'nao_iniciado',
      });
    }
    setErrors({});
  }, [goalToEdit, isOpen, todayStr]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Por favor, selecione uma data de prazo para o objetivo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {goalToEdit ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {goalToEdit
                ? 'Atualize as informações do seu objetivo de estudo.'
                : 'Defina o que você quer aprender e estabeleça um prazo claro.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Fechar formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Campo Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1.5">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              autoFocus
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="Ex: Aprender laços de repetição (for e while)"
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Campo Descrição */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-description" className="block text-xs font-semibold text-slate-800 uppercase tracking-wide">
                Descrição e anotações <span className="text-slate-400 font-normal lowercase">(opcional)</span>
              </label>
              <span className="text-[11px] text-slate-400">Ajuda a lembrar os detalhes</span>
            </div>
            <textarea
              id="goal-description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Assistir ao módulo 2 do curso e criar um pequeno script de tabuada para fixar."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-y"
            />
          </div>

          {/* Linha dupla: Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prazo */}
            <div>
              <label htmlFor="goal-deadline" className="block text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1.5">
                Prazo final <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="goal-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => {
                    setFormData({ ...formData, deadline: e.target.value });
                    if (errors.deadline) setErrors({ ...errors, deadline: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.deadline
                      ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                      : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-600'
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.deadline}</span>
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="goal-status" className="block text-xs font-semibold text-slate-800 uppercase tracking-wide mb-1.5">
                Status atual
              </label>
              <select
                id="goal-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as GoalStatus })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Dica para iniciantes */}
          <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-lg flex items-start gap-2.5 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Dica para iniciantes:</strong> Divida grandes temas em metas que você consiga terminar em poucos dias. Metas menores mantêm a motivação em alta!
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {goalToEdit ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
