import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, FileText, Filter } from "lucide-react";
import { Militar, Patente } from "../types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PATENTES_LIST } from "../constants";

interface ReportsDashboardProps {
  militares: Militar[];
}

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
  "#0f172a",
  "#1e293b",
  "#334155",
];

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ militares }) => {
  const [activeTab, setActiveTab] = useState<"ranks" | "time" | "service">(
    "ranks",
  );

  // 1. Rank Distribution Data
  const rankData = useMemo(() => {
    const counts: Record<string, number> = {};
    militares.forEach((m) => {
      counts[m.patente] = (counts[m.patente] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      value: counts[key],
    }));
  }, [militares]);

  // 2. Time in Current Rank Data
  const timeInRankData = useMemo(() => {
    const today = new Date();
    const buckets = {
      "0-2 Anos": 0,
      "2-5 Anos": 0,
      "5-10 Anos": 0,
      "10+ Anos": 0,
    };

    militares.forEach((m) => {
      const promotionDate = new Date(m.dataUltimaPromocao);
      const years =
        (today.getTime() - promotionDate.getTime()) /
        (1000 * 60 * 60 * 24 * 365);

      if (years < 2) buckets["0-2 Anos"]++;
      else if (years < 5) buckets["2-5 Anos"]++;
      else if (years < 10) buckets["5-10 Anos"]++;
      else buckets["10+ Anos"]++;
    });

    return Object.keys(buckets).map((key) => ({
      name: key,
      value: buckets[key as keyof typeof buckets],
    }));
  }, [militares]);

  // 3. Service Time Distribution (from Incorporation Date)
  const serviceTimeData = useMemo(() => {
    const today = new Date();
    const buckets = {
      "0-5 Anos": 0,
      "5-15 Anos": 0,
      "15-25 Anos": 0,
      "25+ Anos": 0,
    };

    militares.forEach((m) => {
      const incDate = new Date(m.dataIncorporacao);
      const years =
        (today.getTime() - incDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

      if (years < 5) buckets["0-5 Anos"]++;
      else if (years < 15) buckets["5-15 Anos"]++;
      else if (years < 25) buckets["15-25 Anos"]++;
      else buckets["25+ Anos"]++;
    });

    return Object.keys(buckets).map((key) => ({
      name: key,
      value: buckets[key as keyof typeof buckets],
    }));
  }, [militares]);

  const exportPDF = (title: string, data: any[], columns: string[]) => {
    const doc = new jsPDF();
    doc.text(title, 20, 20);

    // Add logic to add chart image if possible, simplified for now
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 20, 30);

    autoTable(doc, {
      head: [columns],
      body: data,
      startY: 40,
    });

    doc.save(`${title.toLowerCase().replace(/ /g, "_")}.pdf`);
  };

  const exportPromotionsCSV = () => {
    const headers = [
      "NIP",
      "Nome",
      "Patente",
      "Data Última Promoção",
      "Tempo no Posto",
    ];
    const rows = militares.map((m) => {
      const today = new Date();
      const promotionDate = new Date(m.dataUltimaPromocao);
      const years = (
        (today.getTime() - promotionDate.getTime()) /
        (1000 * 60 * 60 * 24 * 365)
      ).toFixed(1);
      return [
        m.nip,
        m.nome,
        m.patente,
        new Date(m.dataUltimaPromocao).toLocaleDateString(),
        `${years} anos`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "relatorio_promocoes.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
          Relatórios Estratégicos
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("ranks")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "ranks" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-400"}`}
          >
            Patentes
          </button>
          <button
            onClick={() => setActiveTab("time")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "time" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-400"}`}
          >
            Tempo Posto
          </button>
          <button
            onClick={() => setActiveTab("service")}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === "service" ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-400"}`}
          >
            Tempo Serviço
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-10">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {activeTab === "ranks" && "Distribuição de Patentes"}
              {activeTab === "time" && "Tempo no Posto Atual"}
              {activeTab === "service" && "Tempo Total de Serviço"}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={exportPromotionsCSV}
                className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
              >
                <FileText size={18} />
              </button>
              <button className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "ranks" ? (
                <PieChart>
                  <Pie
                    data={rankData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {rankData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart
                  data={activeTab === "time" ? timeInRankData : serviceTimeData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 30px -10px rgba(0,0,0,0.2)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#2563eb"
                    radius={[10, 10, 0, 0]}
                    barSize={60}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Details / Summary Section */}
        <div className="space-y-8">
          <div className="bg-slate-950 text-white p-10 rounded-[3rem] relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2">
                Total Analisado
              </p>
              <p className="text-6xl font-black tracking-tighter">
                {militares.length}
              </p>
              <p className="mt-6 text-sm text-slate-400 leading-relaxed max-w-[80%]">
                Efetivos ativos e na reserva contabilizados para análise
                estatística.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 p-10 opacity-10">
              <Filter size={140} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">
              Destaques
            </h4>
            <div className="space-y-4">
              {rankData.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                >
                  <span className="text-xs font-bold text-slate-600">
                    {item.name}
                  </span>
                  <span className="text-sm font-black text-blue-600">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
