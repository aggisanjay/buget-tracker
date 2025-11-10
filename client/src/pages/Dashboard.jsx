
import { useEffect, useState } from "react";
import api from "../api/client";
import OverviewChart from "../components/charts/OverviewChart";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    api.get("/insights/summary", ).then((r) => setSummary(r.data));
    api.get("/insights/trend", { params: { months: 6 } }).then((r) => setTrend(r.data));
  }, []);

  if (!summary) return <div className="p-6 text-center text-gray-600">Loading...</div>;

  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h2>

      {/* ✅ Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-4 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <ArrowUpCircle size={22} />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{summary.totalIncome.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <ArrowDownCircle size={22} />
                Total Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">₹{summary.totalExpense.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Wallet size={22} />
                Net Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₹{summary.net.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ✅ Chart */}
      <div>
        <h3 className="text-xl font-semibold mb-2">6-Month Trend</h3>

        <Card className="p-4">
          <OverviewChart data={trend} />
        </Card>
      </div>

      {/* ✅ Budgets */}
      {summary.budgets?.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3">Budgets (This Month)</h3>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Budget</th>
                    <th className="p-3 text-left">Spent</th>
                    <th className="p-3 text-left">Remaining</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {summary.budgets.map((b) => (
                    <tr key={b.category} className="border-t">
                      <td className="p-3">{b.category}</td>
                      <td className="p-3">₹{b.budget}</td>
                      <td className="p-3 text-red-600">₹{b.spent}</td>
                      <td className="p-3 text-green-600">₹{b.remaining}</td>
                      <td className="p-3">
                        <Badge
                          variant={b.status === "over" ? "destructive" : "default"}
                        >
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

