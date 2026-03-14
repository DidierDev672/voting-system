"use client";

import { useState, FormEvent } from "react";
import { DjangoConsultationRepository } from "@/app/core/infrastructure/adapters/django-consultation.repository";
import { CreateConsultationUseCase } from "@/app/core/application/usecases/consultation.usecases";
import {
  QuestionType,
  ConsultationStatus,
} from "@/app/core/domain/types/consultation";
import { logger } from "@/app/core/infrastructure/logger/logger";

const consultationRepository = new DjangoConsultationRepository();
const createConsultationUseCase = new CreateConsultationUseCase(
  consultationRepository,
);

interface Question {
  id: string;
  text: string;
  questionType: QuestionType;
  options: string[];
  required: boolean;
}

export default function RegisterConsultationForm() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    proprietaryRepresentation: "",
    status: "draft" as ConsultationStatus,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!mounted) {
    setMounted(true);
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: "",
      questionType: "text",
      options: [],
      required: true,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (
    id: string,
    field: string,
    value: string | boolean | string[],
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const updated = { ...q, [field]: value };
          if (field === "questionType") {
            if (value === "text" || value === "scale") {
              updated.options = [];
            } else if (updated.options.length === 0) {
              updated.options = ["", ""];
            }
          }
          return updated;
        }
        return q;
      }),
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    );
  };

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, options: [...q.options, ""] };
        }
        return q;
      }),
    );
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((_, i) => i !== optionIndex),
          };
        }
        return q;
      }),
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    logger.info("FORM: Iniciando registro de consulta", {
      title: formData.title,
    });

    try {
      const validQuestions = questions
        .filter((q) => q.text.trim().length > 0)
        .map((q) => ({
          text: q.text,
          questionType: q.questionType,
          options:
            q.questionType === "multiple_choice" ||
            q.questionType === "single_choice"
              ? q.options.filter((o) => o.trim().length > 0)
              : [],
          required: q.required,
        }));

      const result = await createConsultationUseCase.execute({
        title: formData.title,
        description: formData.description,
        proprietaryRepresentation: formData.proprietaryRepresentation,
        status: formData.status,
        questions: validQuestions,
      });

      logger.success("FORM: Consulta registrada exitosamente", {
        id: result.id,
      });
      setSuccess(`Consulta "${result.title}" registrada exitosamente`);

      setFormData({
        title: "",
        description: "",
        proprietaryRepresentation: "",
        status: "draft",
      });
      setQuestions([]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al registrar consulta";
      logger.error("FORM: Error al registrar consulta", {
        error: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (type: QuestionType): string => {
    const labels: Record<QuestionType, string> = {
      text: "Abierta",
      multiple_choice: "Selección múltiple",
      single_choice: "Única respuesta",
      scale: "Escala",
    };
    return labels[type];
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 border border-[#d4c5b0]">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-[#3d2f1f]">
            Crear Consulta Popular
          </h2>
          <p className="text-[#8b7355] mt-2">
            Configure los parámetros de la consulta popular
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#f5e6e0] to-[#fef5f3] border-l-4 border-[#d4a574] rounded-r-md">
            <p className="text-sm text-[#c17767]">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-gradient-to-r from-[#e6f5e6] to-[#f0fdf4] border-l-4 border-[#4ade80] rounded-r-md">
            <p className="text-sm text-[#16a34a]">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Título de la Consulta *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
                placeholder="Título de la consulta"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ConsultationStatus,
                  })
                }
                className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
                <option value="closed">Cerrada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
              placeholder="Descripción de la consulta popular"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#3d2f1f] mb-2">
              Representación Propietaria *
            </label>
            <input
              type="text"
              value={formData.proprietaryRepresentation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  proprietaryRepresentation: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-[#e5ddd0] rounded-lg bg-[#faf8f5] text-[#3d2f1f] focus:outline-none focus:border-[#8b7355] transition-all"
              placeholder="Nombre o entidad responsable"
              required
            />
          </div>

          <div className="border-t border-[#e5ddd0] pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-[#3d2f1f]">Preguntas</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Pregunta
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 bg-[#faf8f5] rounded-lg border-2 border-dashed border-[#e5ddd0]">
                <svg
                  className="w-12 h-12 mx-auto text-[#d4c5b0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-2 text-[#8b7355]">
                  No hay preguntas agregadas
                </p>
                <p className="text-sm text-[#b8a896]">
                  Agregue al menos una pregunta para la consulta
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-[#faf8f5] rounded-lg p-4 border border-[#e5ddd0]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-sm font-medium text-[#8b7355]">
                        Pregunta {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-[#c17767] hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(question.id, "text", e.target.value)
                        }
                        className="w-full px-4 py-2 border-2 border-[#e5ddd0] rounded-lg bg-white text-[#3d2f1f] focus:outline-none focus:border-[#8b7355]"
                        placeholder="Texto de la pregunta"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-[#8b7355] mb-1">
                            Tipo de pregunta
                          </label>
                          <select
                            value={question.questionType}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "questionType",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border-2 border-[#e5ddd0] rounded-lg bg-white text-[#3d2f1f] focus:outline-none focus:border-[#8b7355]"
                          >
                            <option value="text">Abierta</option>
                            <option value="single_choice">
                              Única respuesta
                            </option>
                            <option value="multiple_choice">
                              Selección múltiple
                            </option>
                            <option value="scale">Escala</option>
                          </select>
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) =>
                                updateQuestion(
                                  question.id,
                                  "required",
                                  e.target.checked,
                                )
                              }
                              className="w-4 h-4 text-[#3d2f1f] border-2 border-[#e5ddd0] rounded focus:ring-[#8b7355]"
                            />
                            <span className="ml-2 text-sm text-[#3d2f1f]">
                              Obligatoria
                            </span>
                          </label>
                        </div>
                      </div>

                      {(question.questionType === "single_choice" ||
                        question.questionType === "multiple_choice") && (
                        <div className="mt-4">
                          <label className="block text-xs text-[#8b7355] mb-2">
                            Opciones de respuesta
                          </label>
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    updateOption(
                                      question.id,
                                      optIndex,
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 px-3 py-2 border-2 border-[#e5ddd0] rounded-lg bg-white text-[#3d2f1f] focus:outline-none focus:border-[#8b7355]"
                                  placeholder={`Opción ${optIndex + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeOption(question.id, optIndex)
                                  }
                                  className="text-[#c17767] hover:text-red-700"
                                  disabled={question.options.length <= 2}
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(question.id)}
                              className="text-sm text-[#8b7355] hover:text-[#3d2f1f] flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                              Agregar opción
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || questions.length === 0}
              className="w-full py-4 px-4 bg-gradient-to-r from-[#3d2f1f] to-[#5a4332] text-white font-medium rounded-lg hover:from-[#2a1f13] hover:to-[#3d2f1f] focus:outline-none focus:ring-4 focus:ring-[#8b7355] focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Crear Consulta Popular
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
