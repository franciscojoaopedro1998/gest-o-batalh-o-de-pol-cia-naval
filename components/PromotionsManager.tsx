import React, { useState } from "react";
import { Award, CheckCircle2, User } from "lucide-react";
import { Militar, Patente } from "../types";
import { PATENTES_LIST } from "../constants";

interface PromotionsManagerProps {
  militares: Militar[];
  onPromote: (
    militarId: string,
    novaPatente: Patente,
    data: string,
    documento: string,
  ) => void;
}

const PromotionsManager: React.FC<PromotionsManagerProps> = ({
  militares,
  onPromote,
}) => {
  const [selectedMilitarId, setSelectedMilitarId] = useState("");
  const [novaPatente, setNovaPatente] = useState<Patente | "">("");
  const [dataPromocao, setDataPromocao] = useState("");
  const [documento, setDocumento] = useState("");

  const selectedMilitar = militares.find((m) => m.id === selectedMilitarId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMilitarId && novaPatente && dataPromocao && documento) {
      onPromote(
        selectedMilitarId,
        novaPatente as Patente,
        dataPromocao,
        documento,
      );
      // Reset form
      setSelectedMilitarId("");
      setNovaPatente("");
      setDataPromocao("");
      setDocumento("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
          <Award size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase text-slate-900">
            Processo de Promoção
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Elevação de patente e registro de carreira
          </p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-4">
                Militar
              </label>
              <select
                className="w-full p-6 bg-slate-50 rounded-3xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                value={selectedMilitarId}
                onChange={(e) => setSelectedMilitarId(e.target.value)}
              >
                <option value="">Selecione o militar...</option>
                {militares.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.post} {m.nip} - {m.nome} ({m.patente})
                  </option>
                ))}
              </select>
            </div>

            {selectedMilitar && (
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-3xl border border-blue-100">
                <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-sm">
                  {selectedMilitar.foto ? (
                    <img
                      src={selectedMilitar.foto}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="p-4 w-full h-full text-blue-200" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest">
                    Atual
                  </p>
                  <p className="font-black text-blue-900">
                    {selectedMilitar.patente}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-4">
                Nova Patente
              </label>
              <select
                className="w-full p-6 bg-slate-50 rounded-3xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none"
                value={novaPatente}
                onChange={(e) => setNovaPatente(e.target.value as Patente)}
              >
                <option value="">Promover para...</option>
                {PATENTES_LIST.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-4">
                Data Efetiva
              </label>
              <input
                type="date"
                className="w-full p-6 bg-slate-50 rounded-3xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                value={dataPromocao}
                onChange={(e) => setDataPromocao(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-4">
                Documento Ref.
              </label>
              <input
                type="text"
                placeholder="Ex: Portaria 123/24"
                className="w-full p-6 bg-slate-50 rounded-3xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button
              type="submit"
              className="bg-slate-900 text-white px-10 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-4"
            >
              <CheckCircle2 /> Efetivar Promoção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionsManager;
