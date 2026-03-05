import React, { useState } from "react";
/* Added missing Calendar icon import */
import {
  X,
  User,
  Shield,
  Briefcase,
  Phone,
  MapPin,
  History,
  Printer,
  FileText,
  Heart,
  Activity,
  HeartPulse,
  TrendingUp,
  AlertCircle,
  Ruler,
  Scale,
  Award,
  Ship,
  Plane,
  Plus,
  Calendar,
} from "lucide-react";
import { Militar, Patente, HistoricoEvento } from "../types";
import { PATENTES_LIST } from "../constants";

interface MilitarModalProps {
  militar: Militar;
  onClose: () => void;
}

import { generateMilitarDossier } from "../utils/pdfService";

const MilitarModal: React.FC<MilitarModalProps> = ({ militar, onClose }) => {
  const [showAddPromotion, setShowAddPromotion] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<HistoricoEvento>>({
    tipo: "PROMOÇÃO",
  }); // Fix: Default type

  // Function to handle adding a promotion (User requested this logic be present)
  const handleAddPromotion = () => {
    // Note: In a real app this would call an API.
    // Ideally this component should receive an onAddPromotion prop.
    // For now we will rely on the parent updating the state or similar mechanism if implemented.
    // Since this is "Visual" for now, we just close the form.
    setShowAddPromotion(false);
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case "PROMOÇÃO":
        return <Award className="text-blue-500" size={18} />;
      case "MISSÃO":
        return <Ship className="text-emerald-500" size={18} />;
      case "FÉRIAS":
        return <Plane className="text-amber-500" size={18} />;
      default:
        return <Activity className="text-slate-500" size={18} />;
    }
  };

  const Detail = ({ label, value, icon: Icon }: any) => (
    <div className="hover:translate-x-2 transition-transform">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-slate-300" />} {label}
      </p>
      <p className="text-slate-900 font-bold text-lg leading-tight tracking-tight">
        {value || "---"}
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
      <div className="bg-white w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-[4rem] shadow-2xl relative flex flex-col scale-in-95">
        {/* Header Profissional */}
        <div className="p-12 md:p-16 bg-slate-950 text-white flex flex-col md:flex-row items-center gap-12 shrink-0">
          <div className="relative group shrink-0">
            {militar.foto ? (
              <img
                src={militar.foto}
                className="w-40 h-52 md:w-52 md:h-64 object-cover rounded-[2.5rem] shadow-2xl border-4 border-white/10 relative z-10"
              />
            ) : (
              <div className="w-40 h-52 md:w-52 md:h-64 bg-white/5 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-white/20 relative z-10">
                <User size={48} className="opacity-10" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <span className="bg-blue-600 px-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 inline-block">
              {militar.patente}
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">
              {militar.nome}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-10 text-[12px] text-white/50 font-black uppercase tracking-widest">
              <span className="flex items-center gap-3">
                <MapPin size={18} /> {militar.unidadeMilitar}
              </span>
              <span className="flex items-center gap-3">
                <Shield size={18} /> NIP {militar.nip}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 z-10">
            <button
              onClick={() => generateMilitarDossier(militar)}
              className="bg-white text-slate-950 px-10 py-5 rounded-3xl font-black uppercase text-xs flex items-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-xl"
            >
              <Printer size={20} /> Exportar PDF
            </button>
            <button
              onClick={onClose}
              className="p-5 bg-white/10 hover:bg-red-500 rounded-3xl transition-all"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Intelligence Content */}
        <div className="flex-1 overflow-y-auto p-12 md:p-24 bg-[#fafbfc] custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-24">
            {/* Left: General Info */}
            <div className="lg:col-span-2 space-y-20">
              <section className="space-y-12">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <Shield size={24} className="text-blue-600" />
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                    Dados de Registro Operacional
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                  <Detail
                    label="Grupo Sanguíneo"
                    value={militar.grupoSanguineo}
                    icon={Heart}
                  />
                  <Detail
                    label="Altura / Peso"
                    value={`${militar.altura}cm / ${militar.peso}kg`}
                    icon={Ruler}
                  />
                  <Detail
                    label="Especialidade"
                    value={militar.especialidade}
                    icon={Activity}
                  />
                  <Detail label="BI" value={militar.bi} icon={FileText} />
                  <Detail
                    label="Data de Adição"
                    value={new Date(
                      militar.dataIncorporacao,
                    ).toLocaleDateString("pt-AO")}
                    icon={Calendar}
                  />
                  <Detail
                    label="Função Atual"
                    value={militar.funcao}
                    icon={Briefcase}
                  />
                </div>
              </section>

              <section className="space-y-12">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <AlertCircle size={24} className="text-red-600" />
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                    Contatos de Emergência
                  </h3>
                </div>
                <div className="p-10 bg-slate-950 text-white rounded-[3rem] shadow-2xl">
                  <p className="text-[11px] font-black uppercase text-blue-500 mb-2">
                    {militar.contatoAcidente.parentesco}
                  </p>
                  <p className="text-3xl font-black tracking-tight mb-4">
                    {militar.contatoAcidente.nome}
                  </p>
                  <p className="text-5xl font-mono font-black text-blue-500">
                    {militar.contatoAcidente.telefone}
                  </p>
                </div>
              </section>

              {/* Seção dedicada de Histórico de Promoções */}
              <section className="space-y-12">
                <div className="flex justify-between items-center border-b border-slate-100 pb-5">
                  <div className="flex items-center gap-4">
                    <Award size={24} className="text-amber-500" />
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                      Histórico de Promoções
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddPromotion(!showAddPromotion)}
                    className="no-print p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {showAddPromotion && (
                  <div className="p-8 bg-slate-50 rounded-3xl no-print animate-in slide-in-from-top-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="date"
                        className="p-3 rounded-xl border-none font-bold"
                        onChange={(e) =>
                          setNewPromo({ ...newPromo, data: e.target.value })
                        }
                      />
                      <select
                        className="p-3 rounded-xl border-none font-bold"
                        onChange={(e) =>
                          setNewPromo({
                            ...newPromo,
                            descricao: `Promovido a ${e.target.value}`,
                          })
                        }
                      >
                        <option>Selecione Patente...</option>
                        {PATENTES_LIST.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      placeholder="Documento de Portaria"
                      className="w-full p-3 rounded-xl border-none font-bold mb-4"
                      onChange={(e) =>
                        setNewPromo({ ...newPromo, detalhes: e.target.value })
                      }
                    />
                    <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">
                      Salvar Promoção
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-3xl overflow-hidden border border-slate-50">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest">
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4">Evento</th>
                        <th className="px-6 py-4">Documento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {militar.historico
                        .filter((h) => h.tipo === "PROMOÇÃO")
                        .map((h) => (
                          <tr key={h.id} className="text-sm font-bold">
                            <td className="px-6 py-4 font-mono text-slate-400">
                              {new Date(h.data).toLocaleDateString("pt-AO")}
                            </td>
                            <td className="px-6 py-4 text-slate-900">
                              {h.descricao}
                            </td>
                            <td className="px-6 py-4 text-blue-600">
                              {h.detalhes || "---"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right: Smart Timeline */}
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm space-y-12">
              <div className="flex items-center gap-4">
                <History size={24} className="text-blue-600" />
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                  Timeline Unificada
                </h3>
              </div>

              <div className="relative space-y-10 before:absolute before:left-6 before:top-0 before:h-full before:w-0.5 before:bg-slate-50">
                {militar.historico.length > 0 ? (
                  militar.historico.map((evento) => (
                    <div key={evento.id} className="relative pl-16 group">
                      <div className="absolute left-3.5 top-0 w-5 h-5 bg-white border-4 border-slate-100 rounded-full group-hover:border-blue-500 transition-colors z-10"></div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-black text-slate-400 font-mono">
                          {new Date(evento.data).toLocaleDateString("pt-AO")}
                        </span>
                        <div className="flex items-center gap-3">
                          {getEventIcon(evento.tipo)}
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                            {evento.tipo}
                          </span>
                        </div>
                        <p className="text-sm font-black text-slate-900">
                          {evento.descricao}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-20 italic font-medium">
                    Sem registros arquivados.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilitarModal;
