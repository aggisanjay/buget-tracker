import { useEffect, useState } from "react";
import api from "../api/client";
import BudgetForm from "../components/BudgetForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Budgets() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await api.get("/budgets");
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await api.delete(`/budgets/${id}`);
    load();
  };

  return (
    <div className="space-y-6">

      <h2 className="text-3xl font-bold text-gray-800">Budgets</h2>

      {/* ✅ Add Budget Form */}
      <BudgetForm onSaved={load} />

      {/* ✅ Budget Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Existing Budgets</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No budgets added yet.
                  </td>
                </tr>
              )}

              {items.map((b, index) => (
                <motion.tr
                  key={b._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t"
                >
                  <td className="p-3">{b.month}</td>
                  <td className="p-3">{b.category}</td>
                  <td className="p-3">₹{b.amount}</td>

                  <td className="p-3 text-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(b._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

