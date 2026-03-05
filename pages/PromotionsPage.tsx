import React from "react";
import PromotionsManager from "../components/PromotionsManager";
import { Militar, Patente, HistoricoEvento, Situacao } from "../types";
import { User } from "lucide-react";

interface PromotionsPageProps {
  militares: Militar[];
  onPromote: (id: string, patente: Patente, data: string, doc: string) => void;
  viewMode: "create" | "list";
}

const PromotionsPage: React.FC<PromotionsPageProps> = ({
  militares,
  onPromote,
  viewMode,
}) => {
  if (viewMode === "create") {
    return <PromotionsManager militares={militares} onPromote={onPromote} />;
  }

  // List View (Promovidos)
  const promotedMilitares = militares.filter((m) =>
    m.historico.some((h) => h.tipo === "PROMOÇÃO"),
  );

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
        <h3 className="text-xl font-black uppercase text-slate-900">
          Histórico de Promoções
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotedMilitares.map((m) => {
          const lastPromo = m.historico.find((h) => h.tipo === "PROMOÇÃO");
          return (
            <div
              key={m.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden">
                  {m.foto ? (
                    <img src={m.foto} className="w-full h-full object-cover" />
                  ) : (
                    <User className="p-3 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{m.nome}</h4>
                  <p className="text-xs text-blue-600 font-black uppercase">
                    {m.patente}
                  </p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  Última Promoção
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {lastPromo?.descricao || "Sem dados recentes"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {lastPromo
                    ? new Date(lastPromo.data).toLocaleDateString()
                    : ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromotionsPage;
