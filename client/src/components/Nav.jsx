import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, Wallet, List, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Nav() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path
      ? "text-primary font-semibold"
      : "text-gray-600 hover:text-black transition";

  return (
    <nav className="w-full bg-white border-b shadow-sm py-3">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">

        {/* Left nav links */}
        <div className="flex items-center gap-6">

          <Link to="/" className={`flex items-center gap-2 ${isActive("/")}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/transactions" className={`flex items-center gap-2 ${isActive("/transactions")}`}>
            <List size={18} />
            Transactions
          </Link>

          <Link to="/budgets" className={`flex items-center gap-2 ${isActive("/budgets")}`}>
            <Wallet size={18} />
            Budgets
          </Link>

          <Link to="/insights" className={`flex items-center gap-2 ${isActive("/insights")}`}>
            <BarChart size={18} />
            Insights
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={logout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          )}
        </div>

      </div>
    </nav>
  );
}
