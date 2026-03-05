import React, { useMemo } from "react";
import {
  Users,
  Ship,
  Flag,
  AlertCircle,
  Zap,
  Shield,
  Target,
  Activity,
} from "lucide-react";
import StatCard from "../components/StatCard";
import { Militar, Missao, Situacao } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

interface DashboardProps {
  militares: Militar[];
  missoes: Missao[];
  insights: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  militares,
  missoes,
  insights,
}) => {
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    militares.forEach((m) => {
      counts[m.situacao] = (counts[m.situacao] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [militares]);

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="military-card group border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              Efetivo Total
            </span>
          </div>
          <p className="text-4xl font-black text-white font-mono">
            {militares.length}
          </p>
          <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-full opacity-50"></div>
          </div>
        </div>

        <div className="military-card group border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              Em Formação
            </span>
          </div>
          <p className="text-4xl font-black text-white font-mono">
            {militares.filter((m) => m.situacao === Situacao.FORMACAO).length}
          </p>
          <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{
                width: `${(militares.filter((m) => m.situacao === Situacao.FORMACAO).length / militares.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="military-card group border-l-4 border-l-blue-600">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform">
              <Target size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              Cursos Ativos
            </span>
          </div>
          <p className="text-4xl font-black text-white font-mono">
            {missoes.filter((m) => m.status === "Em Curso").length}
          </p>
          <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 opacity-80"
              style={{ width: "65%" }}
            ></div>
          </div>
        </div>

        <div className="military-card group border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform">
              <AlertCircle size={24} />
            </div>
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">
              Alertas Ativos
            </span>
          </div>
          <p className="text-4xl font-black text-white font-mono">12</p>
          <div className="mt-4 h-1 w-full bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 animate-pulse w-[40%]"></div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 military-card relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
            <Activity size={240} />
          </div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                <Target size={18} className="text-blue-400" />
              </div>
              <h3 className="font-black uppercase tracking-widest text-sm text-slate-200">
                Distribuição Operacional
              </h3>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val.toUpperCase()}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  fontWeight="bold"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    fontSize: "10px",
                  }}
                  itemStyle={{ fontWeight: "bold" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="military-card flex flex-col items-center justify-center technical-border">
          <div className="mb-8 text-center">
            <h3 className="font-black uppercase tracking-widest text-sm text-slate-200 mb-2">
              Composição Técnica
            </h3>
            <p className="text-[10px] text-slate-500 font-bold">
              Resumo por Categoria
            </p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                      fillOpacity={0.8}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    fontSize: "10px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8 w-full">
            {statusData.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                ></div>
                <span className="text-[10px] font-black text-slate-400 uppercase truncate">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Terminal Section */}
      <div className="glass-dark p-12 rounded-[3rem] relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] transform group-hover:rotate-12 transition-transform duration-1000">
          <Zap size={200} />
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
            <Zap size={20} className="text-blue-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              INTEL-AI Terminal
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-black rounded-full border border-blue-500/30">
                SECURE_LINK V2
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Processando Análise Estratégica...
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 rounded-full"></div>
          <p className="text-slate-300 italic font-mono leading-[1.8] pl-8 text-lg md:text-xl">
            <span className="text-blue-500 mr-3 opacity-50 font-black">
              {">"}
            </span>
            "{insights}"
          </p>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase">
                Análise Concluída
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span className="text-[9px] font-black text-slate-500 uppercase">
                Hardware Accel: ON
              </span>
            </div>
          </div>
          <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors">
            Solicitar Deep Intel {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
