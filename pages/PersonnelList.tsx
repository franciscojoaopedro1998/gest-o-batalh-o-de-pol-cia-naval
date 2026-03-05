import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search, Download, UserPlus, User, MapPin, Edit2 } from "lucide-react";
import { Militar, Situacao, Patente } from "../types";
import { PATENTES_LIST } from "../constants";
import {
  exportToCSV,
  exportToPDF,
  exportToExcel,
} from "../src/utils/exportUtils";

interface PersonnelListProps {
  militares: Militar[];
  forcedStatus?: Situacao;
  titleOverride?: string;
  onEdit: (militar: Militar) => void;
}

const PersonnelList: React.FC<PersonnelListProps> = ({
  militares,
  forcedStatus,
  titleOverride,
  onEdit,
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    patente: "",
    situacao: "",
    unidade: "",
  });

  const uniqueUnits = useMemo(
    () => Array.from(new Set(militares.map((m) => m.unidadeMilitar))),
    [militares],
  );

  const listMilitares = useMemo(() => {
    return militares.filter((m) => {
      const matchesSearch =
        m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nip.includes(searchTerm);

      const matchesSituacao = forcedStatus
        ? m.situacao === forcedStatus
        : filters.situacao
          ? m.situacao === filters.situacao
          : true;

      const matchesPatente = filters.patente
        ? m.patente === filters.patente
        : true;
      const matchesUnidade = filters.unidade
        ? m.unidadeMilitar === filters.unidade
        : true;
      return (
        matchesSearch && matchesPatente && matchesSituacao && matchesUnidade
      );
    });
  }, [militares, searchTerm, filters, forcedStatus]);

  const handleExportExcel = () => {
    exportToExcel(
      listMilitares,
      `lista_efetivos_${forcedStatus || "geral"}`,
      "Efetivos",
    );
  };

  const handleExportPDF = () => {
    const columns = [
      { header: "NIP", dataKey: "nip" },
      { header: "Patente", dataKey: "patente" },
      { header: "Nome", dataKey: "nome" },
      { header: "Função", dataKey: "funcao" },
      { header: "Unidade", dataKey: "unidadeMilitar" },
      { header: "Situação", dataKey: "situacao" },
    ];
    exportToPDF(
      titleOverride || "Lista de Efetivos",
      listMilitares,
      columns,
      `lista_efetivos_${forcedStatus || "geral"}`,
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black uppercase text-slate-900 hidden md:block w-48">
          {titleOverride || "Efetivos"}
        </h3>
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className="relative flex-1">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por NIP ou Nome..."
              className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-900 focus:ring-4 focus:ring-blue-500/10 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* Filters */}
          <select
            className="p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none"
            value={filters.patente}
            onChange={(e) =>
              setFilters({ ...filters, patente: e.target.value })
            }
          >
            <option value="">Todas Patentes</option>
            {PATENTES_LIST.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {!forcedStatus && (
            <select
              className="p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none"
              value={filters.situacao}
              onChange={(e) =>
                setFilters({ ...filters, situacao: e.target.value })
              }
            >
              <option value="">Todas Situações</option>
              {Object.values(Situacao).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          <select
            className="p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none"
            value={filters.unidade}
            onChange={(e) =>
              setFilters({ ...filters, unidade: e.target.value })
            }
          >
            <option value="">Todas Unidades</option>
            {uniqueUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-red-600 hover:text-white transition-all"
          >
            <Download size={18} /> PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-emerald-50 text-emerald-600 px-6 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-emerald-600 hover:text-white transition-all"
          >
            <Download size={18} /> EXCEL
          </button>
          <button
            onClick={() => navigate("/adicionar")}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-all"
          >
            <UserPlus size={18} /> Adicionar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Militar
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Patente / NIP
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Unidade
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Situação
              </th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {listMilitares.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                onClick={() => navigate(`/militar/${m.id}`)}
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-200 overflow-hidden border border-slate-100">
                      {m.foto ? (
                        <img
                          src={m.foto}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-full h-full p-2 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{m.nome}</p>
                      <p className="text-xs font-medium text-slate-400">
                        {m.funcao}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="font-black text-blue-600 text-xs uppercase mb-1">
                    {m.patente}
                  </p>
                  <p className="font-mono text-xs text-slate-500">{m.nip}</p>
                </td>
                <td className="px-8 py-5">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <MapPin size={14} /> {m.unidadeMilitar}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      m.situacao === Situacao.MISSAO
                        ? "bg-emerald-100 text-emerald-600"
                        : m.situacao === Situacao.FERIAS
                          ? "bg-blue-100 text-blue-600"
                          : m.situacao === Situacao.BAIXA_MEDICA
                            ? "bg-red-100 text-red-600"
                            : m.situacao === Situacao.DESTACADO
                              ? "bg-purple-100 text-purple-600"
                              : m.situacao === Situacao.ORDENANCA
                                ? "bg-orange-100 text-orange-600"
                                : m.situacao === Situacao.FORMACAO
                                  ? "bg-cyan-100 text-cyan-600"
                                  : m.situacao === Situacao.DESERTOR
                                    ? "bg-red-200 text-red-800"
                                    : m.situacao === Situacao.DISPENSADO
                                      ? "bg-gray-100 text-gray-600"
                                      : m.situacao === Situacao.AUSENTE
                                        ? "bg-yellow-100 text-yellow-600"
                                        : "bg-amber-100 text-amber-600"
                    }`}
                  >
                    {m.situacao}
                  </span>
                </td>
                <td
                  className="px-8 py-5 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigate(`/militar/${m.id}`)}
                    className="p-3 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {listMilitares.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic">
            Nenhum militar encontrado nesta visão.
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonnelList;
