import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Track money, budgets, and goals",
  },
  "/transactions": {
    title: "Transactions",
    subtitle: "Manage income and expenses",
  },
  "/budgets": {
    title: "Budgets",
    subtitle: "Control monthly spending limits",
  },
  "/goals": {
    title: "Goals",
    subtitle: "Track your savings targets",
  },
};

function Header({ onMenuClick }) {
  const location = useLocation();
  const { user } = useAuth();

  const currentPage = pageTitles[location.pathname] || {
    title: "FinTrack",
    subtitle: "Finance dashboard",
  };

  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl border border-white/10 bg-white/5 p-2 md:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-lg font-semibold md:text-xl">{currentPage.title}</h2>
          <p className="hidden text-sm text-slate-400 sm:block">
            {currentPage.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 lg:flex">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
        </div>

        <button className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10">
          <Bell size={18} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 font-semibold">
          {firstLetter}
        </div>
      </div>
    </header>
  );
}

export default Header;