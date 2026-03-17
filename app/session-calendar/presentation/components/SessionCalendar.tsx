"use client";

import { useState, useEffect } from "react";
import { DjangoMunicipalCouncilSessionRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-session.repository";
import { DjangoMunicipalCouncilPresidentRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-president.repository";
import { DjangoMunicipalCouncilSecretaryRepository } from "@/app/core/infrastructure/adapters/django-municipal-council-secretary.repository";
import { MunicipalCouncilSession } from "@/app/core/domain/types/municipal-council-session";
import { MunicipalCouncilPresident } from "@/app/core/domain/types/municipal-council-president";
import { MunicipalCouncilSecretary } from "@/app/core/domain/types/municipal-council-secretary";
import { logger } from "@/app/core/infrastructure/logger/logger";

const sessionRepository = new DjangoMunicipalCouncilSessionRepository();
const presidentRepository = new DjangoMunicipalCouncilPresidentRepository();
const secretaryRepository = new DjangoMunicipalCouncilSecretaryRepository();

interface SessionWithDetails extends MunicipalCouncilSession {
  presidentName?: string;
  secretaryName?: string;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function SessionCalendar() {
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<SessionWithDetails[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [
    selectedSession,
    setSelectedSession,
  ] = useState<SessionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      let sessionsData: MunicipalCouncilSession[] = [];
      let presidents: MunicipalCouncilPresident[] = [];
      let secretaries: MunicipalCouncilSecretary[] = [];

      try {
        sessionsData = await sessionRepository.getAll();
        console.log("Sesiones cargadas:", sessionsData);
      } catch (e) {
        console.error("Error al cargar sesiones:", e);
        setError("Error al cargar sesiones");
      }

      try {
        presidents = await presidentRepository.getAll();
      } catch (e) {
        console.error("Error al cargar presidentes:", e);
      }

      try {
        secretaries = await secretaryRepository.getAll();
      } catch (e) {
        console.error("Error al cargar secretarios:", e);
      }

      const presidentMap = new Map(
        presidents.map((p: MunicipalCouncilPresident) => [p.id, p.fullName]),
      );
      const secretaryMap = new Map(
        secretaries.map((s: MunicipalCouncilSecretary) => [s.id, s.fullName]),
      );

      const sessionsWithDetails: SessionWithDetails[] = sessionsData.map(
        (session: MunicipalCouncilSession) => ({
          ...session,
          presidentName: presidentMap.get(session.idPresident),
          secretaryName: secretaryMap.get(session.idSecretary),
        }),
      );

      setSessions(sessionsWithDetails);
    } catch (err) {
      console.error("Error general:", err);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
  };

  const getSessionsForDate = (dateKey: string) => {
    try {
      const [year, month, day] = dateKey.split("-").map(Number);
      const checkDateOnly = new Date(year, month - 1, day);

      return sessions.filter((session) => {
        if (!session.dateHourStart || !session.dateHourEnd) return false;

        const startDate = new Date(session.dateHourStart);
        const endDate = new Date(session.dateHourEnd);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
          return false;

        const startDateOnly = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        );
        const endDateOnly = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
        );

        const matches =
          startDateOnly <= checkDateOnly && endDateOnly >= checkDateOnly;
        if (matches) {
          console.log(
            "Session found:",
            session.titleSession,
            "start:",
            startDateOnly,
            "end:",
            endDateOnly,
            "check:",
            checkDateOnly,
          );
        }
        return matches;
      });
    } catch (e) {
      console.error("Error in getSessionsForDate:", e);
      return [];
    }
  };

  const getSessionsStartingOnDate = (dateKey: string) => {
    try {
      return sessions.filter((session) => {
        if (!session.dateHourStart) return false;

        const startDate = new Date(session.dateHourStart);
        if (isNaN(startDate.getTime())) return false;

        const dateKeyStart = formatDateKey(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        );
        return dateKeyStart === dateKey;
      });
    } catch {
      return [];
    }
  };

  const getSessionsEndingOnDate = (dateKey: string) => {
    try {
      return sessions.filter((session) => {
        if (!session.dateHourEnd) return false;

        const endDate = new Date(session.dateHourEnd);
        if (isNaN(endDate.getTime())) return false;

        const dateKeyEnd = formatDateKey(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
        );
        return dateKeyEnd === dateKey;
      });
    } catch {
      return [];
    }
  };

  const handleDateClick = (dateKey: string) => {
    const sessionsOnDate = getSessionsForDate(dateKey);
    console.log("Date clicked:", dateKey, "Sessions found:", sessionsOnDate);
    if (sessionsOnDate.length > 0) {
      setSelectedDate(dateKey);
      setSelectedSession(sessionsOnDate[0]);
    }
  };

  const handleCreateSession = (dateKey: string) => {
    const selectedDate = new Date(dateKey);
    const dateStr = selectedDate.toISOString().slice(0, 16);
    window.location.href = `/session?date=${dateStr}`;
  };

  const closeModal = () => {
    setSelectedDate(null);
    setSelectedSession(null);
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = formatDateKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-20 border border-[#e5ddd0] bg-[#faf8f5]"
        ></div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const sessionsOnDate = getSessionsForDate(dateKey);
      const hasSession = sessionsOnDate.length > 0;
      const startSessions = getSessionsStartingOnDate(dateKey);
      const endSessions = getSessionsEndingOnDate(dateKey);
      const hasStart = startSessions.length > 0;
      const hasEnd = endSessions.length > 0;
      const isToday = dateKey === today;

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(dateKey)}
          className={`h-20 border border-[#e5ddd0] p-1 cursor-pointer transition-all ${
            hasSession
              ? "bg-[#fef3c7] hover:bg-[#fde68a]"
              : "bg-white hover:bg-[#faf8f5]"
          } ${isToday ? "ring-2 ring-[#d4a574] ring-inset" : ""} ${
            hasStart || hasEnd ? "cursor-pointer" : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div
              className={`text-sm font-medium ${
                isToday ? "text-[#d4a574]" : "text-[#3d2f1f]"
              } ${
                hasStart ? "underline decoration-2 decoration-[#d97706]" : ""
              } ${
                hasEnd && !hasStart ? "line-through decoration-[#dc2626]" : ""
              }`}
            >
              {day}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCreateSession(dateKey);
              }}
              className="text-[#8b7355] hover:text-[#3d2f1f] hover:bg-[#e5ddd0] rounded p-0.5 text-xs"
              title="Crear sesión"
            >
              +
            </button>
          </div>
          {hasSession && (
            <div className="mt-1">
              {hasStart && (
                <div className="text-xs text-[#92400e] font-medium underline decoration-[#d97706] decoration-2">
                  Inicio
                </div>
              )}
              {hasEnd && (
                <div className="text-xs text-[#92400e] font-medium line-through decoration-[#dc2626]">
                  Fin
                </div>
              )}
              {!hasStart && !hasEnd && (
                <div className="text-xs text-[#b45309]">Sesión</div>
              )}
            </div>
          )}
        </div>,
      );
    }

    return days;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-[#d4c5b0]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium text-[#3d2f1f]">
            Calendario de Sesiones
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                handleCreateSession(
                  formatDateKey(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate(),
                  ),
                )
              }
              className="px-4 py-2 text-sm bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332] transition-colors"
            >
              + Crear Sesión
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm bg-[#f5f1eb] text-[#3d2f1f] rounded-lg hover:bg-[#e5ddd0] transition-colors"
            >
              Hoy
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-[#f5f1eb] transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#3d2f1f]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="text-lg font-medium text-[#3d2f1f] min-w-[180px] text-center">
                {MONTHS[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-[#f5f1eb] transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#3d2f1f]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3d2f1f]"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <button
                onClick={loadSessions}
                className="px-4 py-2 bg-[#3d2f1f] text-white rounded-lg hover:bg-[#5a4332]"
              >
                Reintentar
              </button>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-[#8b7355] mb-2">No hay sesiones registradas</p>
              <p className="text-sm text-[#b8a896]">
                Crea una sesión en /session
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-sm font-medium text-[#8b7355] bg-[#f5f1eb] rounded-t-lg"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 border border-[#e5ddd0] rounded-b-lg overflow-hidden">
              {renderCalendarDays()}
            </div>
          </>
        )}

        <div className="mt-6 flex items-center gap-6 text-sm text-[#8b7355]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#fef3c7] border border-[#d97706] rounded"></div>
            <span>Días con sesión</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 text-sm font-medium underline decoration-2 decoration-[#d97706]">
              1
            </div>
            <span>Día inicio</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 text-sm font-medium line-through decoration-[#dc2626]">
              1
            </div>
            <span>Día fin</span>
          </div>
        </div>
      </div>

      {selectedSession && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-medium text-[#3d2f1f]">
                  Detalle de la Sesión
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-[#f5f1eb] transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-[#8b7355]"
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
                <div className="bg-[#fef3c7] border-l-4 border-[#d97706] p-4 rounded-r-lg">
                  <h4 className="font-medium text-[#92400e] text-lg">
                    {selectedSession.titleSession}
                  </h4>
                  <span className="inline-block mt-2 px-3 py-1 bg-[#d97706] text-white text-sm rounded-full">
                    {selectedSession.typeSession}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#8b7355] mb-1">
                      Estado
                    </label>
                    <p className="text-[#3d2f1f] font-medium">
                      {selectedSession.statusSession}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8b7355] mb-1">
                      Modalidad
                    </label>
                    <p className="text-[#3d2f1f] font-medium capitalize">
                      {selectedSession.modality}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#8b7355] mb-1">
                      Fecha y Hora de Inicio
                    </label>
                    <p className="text-[#3d2f1f]">
                      {new Date(
                        selectedSession.dateHourStart,
                      ).toLocaleDateString("es-CO", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8b7355] mb-1">
                      Fecha y Hora de Fin
                    </label>
                    <p className="text-[#3d2f1f]">
                      {new Date(selectedSession.dateHourEnd).toLocaleDateString(
                        "es-CO",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8b7355] mb-1">
                    Lugar de Enclosure
                  </label>
                  <p className="text-[#3d2f1f]">
                    {selectedSession.placeEnclosure}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8b7355] mb-1">
                    Orden del Día
                  </label>
                  <div className="bg-[#faf8f5] p-3 rounded-lg text-[#3d2f1f] whitespace-pre-line">
                    {selectedSession.ordenDay}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#8b7355] mb-1">
                      Quorum Requerido
                    </label>
                    <p className="text-[#3d2f1f]">
                      {selectedSession.quorumRequired} personas
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#8b7355] mb-1">
                      Presidente
                    </label>
                    <p className="text-[#3d2f1f]">
                      {selectedSession.presidentName || "No asignado"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#8b7355] mb-1">
                    Secretario
                  </label>
                  <p className="text-[#3d2f1f]">
                    {selectedSession.secretaryName || "No asignado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
