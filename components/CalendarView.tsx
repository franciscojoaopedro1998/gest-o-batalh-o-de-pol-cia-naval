import React, { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  MapPin,
  Flag,
} from "lucide-react";
import { Militar, Missao, Situacao } from "../types";

interface CalendarViewProps {
  missoes: Missao[];
  militares: Militar[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ missoes, militares }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    const events = [];

    // Mission Starts
    missoes.forEach((m) => {
      if (m.dataInicio && isSameDay(new Date(m.dataInicio), date)) {
        events.push({
          type: "missao_inicio",
          title: `Início: ${m.nome}`,
          details: m.local,
        });
      }
      if (m.dataFimPrevisa && isSameDay(new Date(m.dataFimPrevisa), date)) {
        events.push({
          type: "missao_fim",
          title: `Fim: ${m.nome}`,
          details: m.local,
        });
      }
    });

    // Promotions (Anniversary)
    militares.forEach((m) => {
      const promoDate = new Date(m.dataUltimaPromocao);
      if (
        promoDate.getDate() === date.getDate() &&
        promoDate.getMonth() === date.getMonth()
      ) {
        events.push({
          type: "promocao",
          title: `Aniv. Promoção: ${m.patente} ${m.nome.split(" ").pop()}`,
        });
      }
    });

    return events;
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)]">
      <div className="flex-1 bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900 capitalize tracking-tighter">
            {format(currentDate, "MMMM yyyy", { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-200 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-6 py-3 bg-slate-50 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Hoje
            </button>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-200 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4 text-center">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div
              key={d}
              className="text-[10px] font-black uppercase text-slate-400 tracking-widest"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-4">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const events = getEventsForDay(day);
            const hasEvents = events.length > 0;

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative rounded-3xl flex flex-col items-center justify-center p-2 transition-all border-2
                  ${!isCurrentMonth ? "opacity-20" : "opacity-100"}
                  ${isSelected ? "bg-slate-950 text-white border-slate-950 shadow-xl scale-105 z-10" : "bg-slate-50 border-transparent hover:bg-blue-50 hover:border-blue-200"}
                  ${isToday(day) && !isSelected ? "border-blue-500 text-blue-600" : ""}
                `}
              >
                <span
                  className={`text-lg font-black ${isSelected ? "text-white" : "text-slate-700"}`}
                >
                  {format(day, "d")}
                </span>
                {hasEvents && (
                  <div className="flex gap-1 mt-1">
                    {events.some((e) => e.type.includes("missao")) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    )}
                    {events.some((e) => e.type === "promocao") && (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`
         w-full lg:w-96 bg-slate-950 text-white rounded-[3rem] p-8 shadow-2xl transition-all duration-500 transform
         ${selectedDate ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 hidden lg:block pointer-events-none"}
      `}
      >
        {selectedDate && (
          <>
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                  {format(selectedDate, "EEEE", { locale: ptBR })}
                </p>
                <h3 className="text-4xl font-black">
                  {format(selectedDate, "d MMM")}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-3 bg-white/10 rounded-full hover:bg-red-500 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {selectedEvents.length > 0 ? (
                selectedEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 p-5 rounded-2xl border border-white/5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {evt.type.includes("missao") ? (
                        <Flag size={14} className="text-emerald-500" />
                      ) : (
                        <Clock size={14} className="text-amber-500" />
                      )}
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${evt.type.includes("missao") ? "text-emerald-500" : "text-amber-500"}`}
                      >
                        {evt.type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="font-bold text-lg leading-tight mb-1">
                      {evt.title}
                    </p>
                    {evt.details && (
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <MapPin size={12} /> {evt.details}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 opacity-30 italic">
                  Nenhum evento registrado para esta data.
                </div>
              )}
            </div>
          </>
        )}
        {!selectedDate && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <Clock size={48} className="mb-4" />
            <p className="font-bold">
              Selecione uma data para visualizar os detalhes operacionais.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
