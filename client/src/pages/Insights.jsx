import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";

export default function Insights() {
  const [month, setMonth] = useState("");
  const [data, setData] = useState(null);

  const load = async () => {
    const params = month ? { month } : {};
    const { data } = await api.get("/insights/summary", { params });
    setData(data);
  };

  useEffect(() => {
    load();
  }, [month]);

  const suggestions = useMemo(() => {
    if (!data) return [];
    const out = [];

    if (data.totalExpense > data.totalIncome) {
      out.push("You’re spending more than you earn this month. Cut variable costs by 10–15%.");
    }

    (data.budgets || []).forEach((b) => {
      if (b.status === "over") {
        out.push(
          `Overspent on ${b.category}. Reduce next month’s budget or curb spend by ₹${(
            b.spent - b.budget
          ).toFixed(0)}.`
        );
      }
    });

    if (data.net > 0) {
      out.push(`Good job — projected savings ₹${data.net.toFixed(0)}. Consider auto-investing 20–30%.`);
    }

    return out;
  }, [data]);

  if (!data)
    return <div className="p-6 text-center text-gray-500">Loading insights...</div>;

  return (
    <div className="space-y-8">

      {/* ✅ Page Title */}
      <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
        Insights <Sparkles className="text-yellow-500" />
      </h2>

      {/* ✅ Month Filter */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Filter by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="YYYY-MM"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {/* ✅ Suggestions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Financial Suggestions</CardTitle>
        </CardHeader>

        <CardContent>
          {suggestions.length ? (
            <ul className="space-y-3">
              {suggestions.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 bg-gray-50 rounded-md border text-gray-700"
                >
                  {s}
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No alerts. You’re managing money well!</p>
          )}
        </CardContent>
      </Card>

      {/* ✅ Top Categories */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Top Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {data.topCategories.map((c, i) => (
              <motion.li
                key={c.category}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center p-2 bg-gray-50 rounded-md border"
              >
                <span className="font-medium">{c.category}</span>

                <span className="flex items-center gap-2 text-red-600">
                  ₹{c.spent}
                  <TrendingDown size={16} />
                </span>
              </motion.li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
