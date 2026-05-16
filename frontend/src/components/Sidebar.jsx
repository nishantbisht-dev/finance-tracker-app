import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
  },
  {
    to: "/budgets",
    label: "Budgets",
    icon: Wallet,
  },
  {
    to: "/goals",
    label: "Goals",
    icon: Target,
  },
];

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (onClose) onClose();
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FinTrack</h1>
          <p className="mt-1 text-sm text-slate-400">Finance Dashboard</p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white md:hidden"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );
}

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-slate-950 px-4 py-6 md:flex">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 bg-black/60"
          />

          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-slate-950 px-4 py-6 shadow-2xl">
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;