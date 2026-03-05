import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  Flag,
  Ship,
  Sun,
  UserPlus,
  Award,
  FileText,
  Calendar as CalendarIcon,
  Bell,
  LogOut,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  notifications: any[]; // Define proper type if needed
  viewName: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onLogout,
  notifications,
  viewName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Centro de Comando",
    },
    {
      path: "/missoes",
      id: "gestao_missoes",
      icon: Award,
      label: "Gestão Cursos",
    },
    {
      path: "/efetivos",
      id: "efetivos_todos",
      icon: Users,
      label: "Todo Efetivo",
    },
    {
      path: "/efetivos/missao",
      id: "efetivos_missao",
      icon: Ship,
      label: "Em Formação",
    },
    {
      path: "/efetivos/ferias",
      id: "efetivos_ferias",
      icon: Sun,
      label: "De Férias",
    },
    {
      path: "/promocoes/criar",
      id: "promocoes_criar",
      icon: UserPlus,
      label: "Criar Promoção",
    },
    {
      path: "/promocoes/lista",
      id: "promocoes_lista",
      icon: Award,
      label: "Promovidos",
    },
    {
      path: "/relatorios",
      id: "relatorios",
      icon: FileText,
      label: "Relatórios Intel",
    },
    {
      path: "/calendario",
      id: "calendario",
      icon: CalendarIcon,
      label: "Calendário",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] font-['Outfit'] text-white">
      {/* Sidebar */}
      <aside className="w-80 glass-dark flex flex-col border-r border-white/5 h-screen sticky top-0 z-50">
        <div className="p-10 border-b border-white/5 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-500/30 group">
            <Ship
              size={40}
              className="text-blue-400 group-hover:scale-110 transition-transform"
            />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase text-center leading-tight">
            Gestão <br /> <span className="text-blue-500">BPNav</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-3">
            Comando Central
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-8 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_20px_rgba(37,99,235,0.1)]"
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"></div>
                )}
                <item.icon
                  size={18}
                  className={
                    isActive
                      ? "text-blue-400"
                      : "group-hover:text-blue-400 transition-colors"
                  }
                />
                <span className="font-extrabold text-[11px] uppercase tracking-widest">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {notifications.length > 0 && (
          <div className="px-6 pb-6 mt-4">
            <div className="bg-slate-900/40 p-5 rounded-3xl border border-white/5 technical-border">
              <div className="flex items-center gap-3 mb-4 text-blue-400">
                <Bell size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Intel Alerts ({notifications.length})
                </span>
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((note, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-default"
                  >
                    <p className="text-[9px] font-black text-blue-400 mb-0.5 truncate uppercase">
                      {note.title}
                    </p>
                    <p className="text-[9px] text-slate-400 leading-tight">
                      {note.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-8 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-white/5 hover:border-red-500/20"
          >
            <LogOut size={16} /> Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-8 md:p-16 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-8 bg-blue-500"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">
                  System.Protocol / {location.pathname.split("/")[1] || "root"}
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-mono leading-none">
                {viewName === "BPNav Comando" ? "Command Terminal" : viewName}
              </h2>
            </div>
            <div className="flex items-center gap-6 text-right">
              <div className="hidden lg:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Status Operacional
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-[11px] font-bold text-emerald-500 uppercase">
                    Online / Secured
                  </span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                </div>
              </div>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
