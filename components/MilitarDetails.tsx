import React, { useState } from "react";
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
  Award,
  Ship,
  Plane,
  Plus,
  Calendar,
  ArrowLeft,
  Ruler,
  AlertCircle,
  Fingerprint,
  QrCode,
} from "lucide-react";
import { Militar, HistoricoEvento } from "../types";
import { PATENTES_LIST } from "../constants";
import { generateMilitarDossier } from "../src/utils/pdfService";

import { exportToExcel } from "../src/utils/exportUtils";

interface MilitarDetailsProps {
  militar: Militar;
  onBack: () => void;
  onUpdate: (updatedMilitar: Militar) => void;
}

const MilitarDetails: React.FC<MilitarDetailsProps> = ({
  militar,
  onBack,
  onUpdate,
}) => {
  const [showAddPromotion, setShowAddPromotion] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<HistoricoEvento>>({
    tipo: "PROMOÇÃO",
  });

  const handleExportExcel = () => {
    exportToExcel([militar], `dossier_militar_${militar.nip}`, "Dossier");
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case "PROMOÇÃO":
        return <Award className="text-blue-400" size={16} />;
      case "MISSÃO":
        return <Ship className="text-emerald-400" size={16} />;
      case "FÉRIAS":
        return <Plane className="text-amber-400" size={16} />;
      default:
        return <Activity className="text-slate-400" size={16} />;
    }
  };

  const Detail = ({ label, value, icon: Icon }: any) => (
    <div className="group border-b border-white/5 pb-4 hover:border-blue-500/30 transition-colors">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
        {Icon && <Icon size={12} className="text-blue-500/50" />} {label}
      </p>
      <p className="text-white font-mono font-bold text-lg tracking-tight group-hover:text-blue-400 transition-colors uppercase">
        {value || "N/A"}
      </p>
    </div>
  );

  return (
    <div className="bg-slate-950 w-full min-h-full rounded-[3rem] border border-white/5 relative flex flex-col animate-in fade-in slide-in-from-right-12 duration-700 overflow-hidden">
      {/* Dossier Header */}
      <div className="p-10 md:p-14 glass-dark flex flex-col md:flex-row items-center gap-12 shrink-0 border-b border-white/5 technical-border">
        <div className="flex flex-col gap-4 self-start md:self-center">
          <button
            onClick={onBack}
            className="p-4 bg-white/5 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 rounded-2xl transition-all border border-white/5 hover:border-blue-500/30"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <div className="relative group shrink-0">
          <div className="absolute -inset-2 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {militar.foto ? (
            <img
              src={militar.foto}
              className="w-44 h-56 md:w-56 md:h-72 object-cover rounded-3xl shadow-2xl border-2 border-white/10 relative z-10 brightness-90 contrast-110 group-hover:brightness-100 transition-all"
            />
          ) : (
            <div className="w-44 h-56 md:w-56 md:h-72 bg-white/5 rounded-3xl flex items-center justify-center border-2 border-dashed border-white/10 relative z-10">
              <User size={64} className="text-white/10" />
            </div>
          )}
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center z-20 shadow-xl shadow-blue-900/40 border-2 border-slate-950">
            <Shield size={24} className="text-white" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {militar.patente}
            </span>
            <span className="bg-slate-800 text-slate-400 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              ID: {militar.nip}
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none mb-6 text-white uppercase font-mono">
            {militar.nome}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-8 text-[11px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <MapPin size={16} className="text-blue-500" />{" "}
              {militar.unidadeMilitar}
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors">
              <Shield size={16} className="text-emerald-500 animate-pulse" />{" "}
              <span className="text-emerald-500">STATUS: OPERACIONAL</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center gap-4 z-10 px-8 border-l border-white/5">
          <img
            src="/logo2.jpeg"
            alt="Logo PN"
            className="w-20 h-20 object-contain brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity"
          />
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">
              POLÍCIA NAVAL
            </p>
            <p className="text-[8px] font-bold text-blue-500/50 uppercase mt-1">
              Classified Intel
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 z-10">
          <button
            onClick={() => generateMilitarDossier(militar)}
            className="btn-primary flex items-center gap-3 px-8 shadow-[0_0_20px_rgba(37,99,235,0.2)]"
          >
            <Printer size={18} /> Gerar Dossiê
          </button>
          <button
            onClick={handleExportExcel}
            className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all"
          >
            <FileText size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      {/* Dossier Body */}
      <div className="flex-1 p-8 md:p-16 bg-transparent relative overflow-hidden">
        {/* Background Patterns & Watermarks */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.015] select-none">
          <span className="text-[200px] font-black tracking-[0.2em] uppercase text-white font-mono whitespace-nowrap">
            CLASSIFIED
          </span>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          {/* Main Info Columns */}
          <div className="lg:col-span-8 space-y-12">
            {/* Registro Operacional Card */}
            <div className="military-card glass-dark border-blue-500/10 hover:border-blue-500/30 relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none">
                <Fingerprint size={200} />
              </div>
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-blue-400" />
                  <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px]">
                    Especificações do Registro
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-[8px] font-black uppercase tracking-widest text-red-500">
                    Acesso Restrito
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-500/50 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-500/20 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 relative z-10">
                <Detail
                  label="Grupo Sanguíneo"
                  value={militar.grupoSanguineo}
                  icon={Heart}
                />
                <Detail
                  label="Biometria"
                  value={`${militar.altura}cm / ${militar.peso}kg`}
                  icon={Ruler}
                />
                <Detail
                  label="Especialidade"
                  value={militar.especialidade}
                  icon={Activity}
                />
                <Detail
                  label="Identidade (BI)"
                  value={militar.bi}
                  icon={FileText}
                />
                <Detail
                  label="Incorporação"
                  value={new Date(militar.dataIncorporacao).toLocaleDateString(
                    "pt-AO",
                  )}
                  icon={Calendar}
                />
                <Detail
                  label="Tipo de Serviço"
                  value={militar.tipoPrestacaoServico}
                  icon={Shield}
                />
              </div>
            </div>

            {/* Organizacional & Emergencia Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="military-card glass-dark border-blue-500/10">
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                  <MapPin size={18} className="text-blue-400" />
                  <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px]">
                    Alocação
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Companhia
                    </span>
                    <span className="text-sm font-black text-blue-400 uppercase font-mono">
                      {militar.companhia}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Pelotão
                    </span>
                    <span className="text-sm font-black text-blue-400 uppercase font-mono">
                      {militar.pelotao}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Secção
                    </span>
                    <span className="text-sm font-black text-blue-400 uppercase font-mono">
                      {militar.seccao}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Equipa
                    </span>
                    <span className="text-sm font-black text-blue-400 uppercase font-mono">
                      {militar.equipa}
                    </span>
                  </div>
                </div>
              </div>

              <div className="military-card bg-blue-600 shadow-[0_20px_40px_rgba(37,99,235,0.2)] border-none relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1] mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform">
                  <AlertCircle size={100} />
                </div>
                <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none">
                  <QrCode size={48} />
                </div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-white/80" />
                        <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px]">
                          Emergência
                        </h3>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_10px_rgba(248,113,113,0.8)]"></div>
                    </div>
                    <p className="text-[10px] font-black uppercase text-blue-200">
                      {militar.contatoAcidente.parentesco}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white uppercase tracking-tight mb-2 truncate">
                      {militar.contatoAcidente.nome}
                    </p>
                    <p className="text-4xl font-mono font-black text-white tracking-tighter">
                      {militar.contatoAcidente.telefone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event History Table */}
            <div className="military-card glass-dark overflow-hidden p-0 border-white/5">
              <div className="p-8 border-b border-white/5 flex items-center gap-3">
                <History size={18} className="text-blue-400" />
                <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px]">
                  Histórico de Eventos
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <th className="px-8 py-4">Data</th>
                      <th className="px-8 py-4">Protocolo</th>
                      <th className="px-8 py-4">Informação</th>
                      <th className="px-8 py-4">Referência</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {militar.historico.map((h) => (
                      <tr
                        key={h.id}
                        className="text-[11px] font-bold text-slate-300 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-8 py-4 font-mono text-blue-400">
                          {new Date(h.data).toLocaleDateString("pt-AO")}
                        </td>
                        <td className="px-8 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-black border ${
                              h.tipo === "PROMOÇÃO"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : h.tipo === "MISSÃO"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                            }`}
                          >
                            {h.tipo}
                          </span>
                        </td>
                        <td className="px-8 py-4 uppercase">{h.descricao}</td>
                        <td className="px-8 py-4 text-slate-500 font-mono italic">
                          {h.detalhes || "---"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Timeline & Visual Intel */}
          <div className="lg:col-span-4 space-y-8">
            <div className="military-card glass-dark border-blue-500/20 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-6">
                <Activity size={18} className="text-blue-400 animate-pulse" />
                <h3 className="font-black text-white uppercase tracking-[0.3em] text-[10px]">
                  Linha do Tempo
                </h3>
              </div>

              <div className="relative flex-1 space-y-12 before:absolute before:left-3 before:top-2 before:h-full before:w-[1px] before:bg-white/5">
                {militar.historico.length > 0 ? (
                  militar.historico.slice(0, 6).map((evento) => (
                    <div key={evento.id} className="relative pl-12 group">
                      <div className="absolute left-[9px] top-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(37,99,235,1)]"></div>
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-slate-500 font-mono uppercase tracking-widest">
                          {new Date(evento.data).toLocaleDateString("pt-AO")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            {evento.tipo}
                          </span>
                        </div>
                        <p className="text-[11px] font-extrabold text-white uppercase leading-tight group-hover:text-blue-300 transition-colors">
                          {evento.descricao}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-20 italic text-[10px] font-black uppercase text-white">
                    Sem Registros de Transmissão
                  </div>
                )}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-500/10">
                  <p className="text-[8px] font-black text-blue-400 uppercase mb-2 tracking-[0.3em]">
                    Integridade de Dados
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[95%]"></div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      95%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilitarDetails;
