import React, { useState } from "react";
import { Flag, MapPin, Calendar, User, Search, Plus } from "lucide-react";
import { Missao, Militar } from "../types";

interface MissionsManagerProps {
  missoes: Missao[];
  militares: Militar[];
  onAddMission: (missao: Missao) => void;
  onAssignMilitar: (militarId: string, missao: Missao) => void;
}

const MissionsManager: React.FC<MissionsManagerProps> = ({
  missoes,
  militares,
  onAddMission,
  onAssignMilitar,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newMission, setNewMission] = useState<Partial<Missao>>({
    status: "Planejada",
  });
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreate = () => {
    if (!newMission.nome || !newMission.local) return;

    // Create the mission
    const missionId = Date.now().toString();
    const createdMission = { ...newMission, id: missionId } as Missao;
    onAddMission(createdMission);

    // Assign selected personnel
    selectedPersonnel.forEach((mId) => {
      onAssignMilitar(mId, createdMission);
    });

    setShowCreate(false);
    setNewMission({ status: "Planejada" });
    setSelectedPersonnel([]);
  };

  const toggleSelection = (id: string) => {
    if (selectedPersonnel.includes(id)) {
      setSelectedPersonnel((prev) => prev.filter((p) => p !== id));
    } else {
      setSelectedPersonnel((prev) => [...prev, id]);
    }
  };

  const filteredPersonnel = militares.filter(
    (m) =>
      m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.nip.includes(searchTerm),
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Centro de Formação e Cursos
        </h2>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-3 hover:bg-blue-900 transition-all"
        >
          <Plus size={18} /> Novo Curso
        </button>
      </div>

      {showCreate && (
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4">
          <h3 className="text-xl font-black mb-6">
            Cadastrar Curso / Especialização
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input
              placeholder="Nome do Curso"
              className="p-4 bg-slate-50 rounded-xl font-bold"
              value={newMission.nome || ""}
              onChange={(e) =>
                setNewMission({ ...newMission, nome: e.target.value })
              }
            />
            <input
              placeholder="Local"
              className="p-4 bg-slate-50 rounded-xl font-bold"
              value={newMission.local || ""}
              onChange={(e) =>
                setNewMission({ ...newMission, local: e.target.value })
              }
            />
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1">
                  Início
                </label>
                <input
                  type="date"
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold"
                  value={newMission.dataInicio || ""}
                  onChange={(e) =>
                    setNewMission({ ...newMission, dataInicio: e.target.value })
                  }
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-1">
                  Fim Previsto
                </label>
                <input
                  type="date"
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold"
                  value={newMission.dataFimPrevisa || ""}
                  onChange={(e) =>
                    setNewMission({
                      ...newMission,
                      dataFimPrevisa: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <textarea
            placeholder="Ementa e objetivos do curso..."
            className="w-full h-32 p-4 bg-slate-50 rounded-xl font-bold mb-6"
            value={newMission.descricao || ""}
            onChange={(e) =>
              setNewMission({ ...newMission, descricao: e.target.value })
            }
          />

          {/* Personnel Selection */}
          <div className="mb-8">
            <h4 className="text-sm font-black uppercase tracking-widest mb-4">
              Selecionar Efetivo ({selectedPersonnel.length})
            </h4>
            <div className="relative mb-4">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                className="w-full pl-12 p-3 bg-slate-50 rounded-xl font-bold text-sm"
                placeholder="Filtrar efetivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-48 overflow-y-auto custom-scrollbar border border-slate-100 rounded-xl bg-slate-50 p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredPersonnel.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleSelection(m.id)}
                  className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer border-2 transition-all ${selectedPersonnel.includes(m.id) ? "border-emerald-500 bg-emerald-50" : "border-transparent bg-white hover:bg-slate-200"}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                    {m.foto ? (
                      <img
                        src={m.foto}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={14} className="m-2 text-slate-400" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-xs truncate">{m.nome}</p>
                    <p className="text-[9px] font-black text-slate-400">
                      {m.patente}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCreate}
              className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black uppercase text-xs hover:bg-blue-700 transition-colors"
            >
              Criar Curso e Matricular Equipe
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="px-8 py-4 bg-slate-100 text-slate-500 rounded-xl font-black uppercase text-xs hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {missoes.map((m) => {
          // Calculate personnel in this mission
          const personnelInMission = militares.filter((mil) =>
            mil.historico.some(
              (h) => h.tipo === "MISSÃO" && h.descricao.includes(m.nome),
            ),
          );

          return (
            <div
              key={m.id}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row gap-8 items-start group hover:shadow-xl transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${m.status === "Em Curso" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    {m.status}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    {m.nome}
                  </h3>
                </div>
                <div className="flex gap-6 mb-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2">
                    <MapPin size={14} className="text-blue-500" /> {m.local}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />{" "}
                    {m.dataInicio
                      ? new Date(m.dataInicio).toLocaleDateString()
                      : "TBD"}
                  </span>
                </div>
                <p className="text-slate-500 font-medium mb-6 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {m.descricao}
                </p>

                {/* Team Preview */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {personnelInMission.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                        title={p.nome}
                      >
                        {p.foto ? (
                          <img
                            src={p.foto}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User
                            size={16}
                            className="m-auto mt-2 text-slate-400"
                          />
                        )}
                      </div>
                    ))}
                    {personnelInMission.length > 5 && (
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-950 text-white flex items-center justify-center text-[10px] font-black">
                        +{personnelInMission.length - 5}
                      </div>
                    )}
                  </div>
                  {personnelInMission.length > 0 ? (
                    <span className="text-xs font-bold text-slate-400 tracking-tight">
                      militares matriculados
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-300 italic">
                      Nenhum efetivo designado
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MissionsManager;
