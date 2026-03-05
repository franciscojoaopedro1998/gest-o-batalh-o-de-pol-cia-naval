import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AlertCircle, Shield } from "lucide-react";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PersonnelList from "./pages/PersonnelList";
import MissionsPage from "./pages/MissionsPage";
import PromotionsPage from "./pages/PromotionsPage";
import CalendarView from "./components/CalendarView";
import ReportsDashboard from "./components/ReportsDashboard";
import MilitarDetailsPage from "./pages/MilitarDetailsPage";
import MilitarForm from "./components/MilitarForm";

import { Militar, Situacao, Patente, Missao, HistoricoEvento } from "./types";
import { MOCK_MILITARES } from "./constants";
import { getTroopInsights } from "./geminiService";
import Toast, { ToastType } from "./components/Toast";

// --- Main App Component ---
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem("auth_session") === "active",
  );

  // --- Global State ---
  const [militares, setMilitares] = useState<Militar[]>(() => {
    const saved = localStorage.getItem("militares_db");
    return saved ? JSON.parse(saved) : MOCK_MILITARES;
  });

  const [missoes, setMissoes] = useState<Missao[]>(() => {
    const saved = localStorage.getItem("missoes_db");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: "m1",
            nome: "Operação Mar Manso",
            local: "Porto de Luanda",
            dataInicio: "2024-05-01",
            dataFimPrevisa: "2024-07-01",
            status: "Em Curso",
            descricao: "Vigilância costeira e fiscalização.",
          },
        ];
  });

  const [insights, setInsights] = useState<string>(
    "Analistas AI em prontidão...",
  );
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem("militares_db", JSON.stringify(militares));
    localStorage.setItem("missoes_db", JSON.stringify(missoes));
  }, [militares, missoes]);

  useEffect(() => {
    if (isAuthenticated) {
      getTroopInsights(militares).then(setInsights);
    }
  }, [militares, isAuthenticated]);

  // --- Logic & Handlers ---
  const handleSaveMilitar = (data: Omit<Militar, "id">, id?: string) => {
    if (id) {
      setMilitares((prev) =>
        prev.map((m) => (m.id === id ? ({ ...data, id: m.id } as Militar) : m)),
      );
    } else {
      setMilitares((prev) => [
        ...prev,
        { ...data, id: Date.now().toString() } as Militar,
      ]);
    }
    setToast({ message: "Efetivo atualizado com sucesso.", type: "success" });
  };

  const handleMissionAdd = (missao: Missao) => {
    setMissoes((prev) => [...prev, missao]);
    setToast({ message: "Missão estratégica criada.", type: "success" });
  };

  const assignMilitarToMissao = (militarId: string, missao: Missao) => {
    setMilitares((prev) =>
      prev.map((m) => {
        if (m.id === militarId) {
          const novoEvento: HistoricoEvento = {
            id: Date.now().toString(),
            tipo: "MISSÃO",
            data: new Date().toISOString(),
            descricao: `Designado para: ${missao.nome}`,
            detalhes: `Local: ${missao.local}`,
          };
          return {
            ...m,
            situacao: Situacao.MISSAO,
            historico: [novoEvento, ...m.historico],
          };
        }
        return m;
      }),
    );
    setToast({ message: "Militar escalado para missão.", type: "success" });
  };

  const handlePromoteMilitar = (
    militarId: string,
    novaPatente: Patente,
    data: string,
    documento: string,
  ) => {
    setMilitares((prev) =>
      prev.map((m) => {
        if (m.id === militarId) {
          const novoEvento: HistoricoEvento = {
            id: Date.now().toString(),
            tipo: "PROMOÇÃO",
            data: new Date(data).toISOString(),
            descricao: `Promovido a ${novaPatente}`,
            detalhes: `Ref: ${documento}`,
          };
          return {
            ...m,
            patente: novaPatente,
            dataUltimaPromocao: new Date(data).toISOString(),
            historico: [novoEvento, ...m.historico],
          };
        }
        return m;
      }),
    );
    setToast({ message: "Promoção registrada com sucesso.", type: "success" });
  };

  const notifications = useMemo(() => {
    const alerts: any[] = [];
    const today = new Date();
    missoes.forEach((m) => {
      if (m.status === "Em Curso" && m.dataFimPrevisa) {
        const endDate = new Date(m.dataFimPrevisa);
        const diffDays = Math.ceil(
          (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays >= 0 && diffDays <= 7) {
          alerts.push({
            title: "Retorno de Missão",
            desc: `"${m.nome}" retorna em ${diffDays} dias.`,
            type: "warning",
          });
        }
      }
    });
    return alerts;
  }, [missoes]);

  // --- Auth View ---
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  // --- Main App Structure ---
  return (
    <BrowserRouter>
      <Layout
        onLogout={() => setIsAuthenticated(false)}
        notifications={notifications}
        viewName="Gestão de Pessoal e Quadros"
      >
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                militares={militares}
                missoes={missoes}
                insights={insights}
              />
            }
          />

          <Route
            path="/missoes"
            element={
              <MissionsPage
                missoes={missoes}
                militares={militares}
                onAddMission={handleMissionAdd}
                onAssignMilitar={assignMilitarToMissao}
              />
            }
          />

          <Route
            path="/efetivos"
            element={
              <PersonnelList
                militares={militares}
                onEdit={(m) => {
                  if (m && m.id) {
                    // Edit logic if needed
                  }
                }}
              />
            }
          />

          <Route
            path="/efetivos/missao"
            element={
              <PersonnelList
                militares={militares}
                forcedStatus={Situacao.MISSAO}
                titleOverride="Em Missão"
                onEdit={() => {}}
              />
            }
          />

          <Route
            path="/efetivos/ferias"
            element={
              <PersonnelList
                militares={militares}
                forcedStatus={Situacao.FERIAS}
                titleOverride="De Férias"
                onEdit={() => {}}
              />
            }
          />

          <Route
            path="/promocoes"
            element={<Navigate to="/promocoes/lista" replace />}
          />
          <Route
            path="/promocoes/criar"
            element={
              <PromotionsPage
                militares={militares}
                onPromote={handlePromoteMilitar}
                viewMode="create"
              />
            }
          />

          <Route
            path="/promocoes/lista"
            element={
              <PromotionsPage
                militares={militares}
                onPromote={handlePromoteMilitar}
                viewMode="list"
              />
            }
          />

          <Route
            path="/relatorios"
            element={<ReportsDashboard militares={militares} />}
          />
          <Route
            path="/calendario"
            element={<CalendarView missoes={missoes} militares={militares} />}
          />

          <Route
            path="/militar/:id"
            element={
              <MilitarDetailsPage
                militares={militares}
                onUpdate={(d) => handleSaveMilitar(d, d.id)}
              />
            }
          />

          <Route
            path="/adicionar"
            element={
              <div className="bg-white p-12 rounded-[3rem] shadow-sm">
                <h2 className="text-2xl font-black mb-6">
                  Cadastrar Novo Efetivo
                </h2>
                <MilitarForm
                  onSubmit={handleSaveMilitar}
                  onCancel={() => window.history.back()}
                />
              </div>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

// --- Login Component (Internal) ---
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "1234") {
      localStorage.setItem("auth_session", "active");
      onLogin();
    } else {
      setError("Credenciais de acesso inválidas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Outfit'] relative overflow-hidden">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-md w-full glass-dark rounded-[3rem] p-12 shadow-2xl border border-white/5 relative z-10 technical-border">
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8 relative group">
            <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <img
              src="/logo.jpeg"
              alt="Logo MGA"
              className="w-28 h-28 object-contain relative z-10 brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-500 scale-100 group-hover:scale-110"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase text-center leading-tight">
            Gestão de <span className="text-blue-500">Pessoal e Quadros</span>
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-[1px] w-4 bg-blue-500/50"></div>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">
              Marinha de Guerra de Angola
            </p>
            <div className="h-[1px] w-4 bg-blue-500/50"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
              Codename / User
            </label>
            <input
              type="text"
              autoFocus
              className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-slate-700"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
              Access Protocol
            </label>
            <input
              type="password"
              className="w-full px-6 py-5 bg-white/5 border border-white/5 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-slate-700"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl animate-in shake">
              <AlertCircle size={14} className="text-red-500" />
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">
                {error}
              </p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-blue-900/40 transition-all active:scale-[0.98] border border-blue-400/20"
            >
              Autenticar / Entrar
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[8px] font-black font-mono text-slate-700 uppercase tracking-[0.5em]">
            Gestão de <span className="text-blue-500">Pessoal e Quadros</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
