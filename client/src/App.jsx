import { Routes, Route, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Nav from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Insights from "./pages/Insights";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

function Guard({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="text-center py-10 text-lg">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function Login() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (isRegister) await register(form.name, form.email, form.password);
    else await login(form.email, form.password);
  };

  useEffect(() => { if (user) navigate("/"); }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <Card className="shadow-lg border border-gray-200 backdrop-blur bg-white/80">
          <CardHeader className="pb-2"><CardTitle className="text-center text-2xl font-bold">{isRegister ? "Create Account" : "Welcome Back"}</CardTitle>
          
          {!isRegister && (
    <p className="text-center text-gray-600 text-sm mt-1">
      Track your money smartly. Stay in control.
    </p>
  )}

  {isRegister && (
    <p className="text-center text-gray-600 text-sm mt-1">
      Let’s get you started in under a minute.
    </p>
  )}
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              {isRegister && <Input placeholder="Full Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />}
              <Input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
              <Input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
              <Button type="submit" className="w-full flex items-center gap-2">
                {isRegister ? <UserPlus size={18}/> : <LogIn size={18}/>}
                {isRegister ? "Register" : "Login"}
              </Button>
            </form>
            <Button variant="link" className="w-full mt-2" onClick={()=>setIsRegister(s=>!s)}>
              {isRegister ? "Already have an account? Sign in" : "New user? Create an account"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const hideNav = pathname === "/login";

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNav && <Nav />}
      <main className="max-w-6xl mx-auto px-4 pt-6">
        {!hideNav && user && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-semibold mb-4 text-gray-700">
            Hello, {user.name}
          </motion.div>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Guard><Outlet /></Guard>}>
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="insights" element={<Insights />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
