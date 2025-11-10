import { useState } from "react";
import api from "../api/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";

export default function BudgetForm({ onSaved }) {
  const [form, setForm] = useState({
    month: "",
    category: "",
    amount: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/budgets", {
      ...form,
      amount: Number(form.amount),
    });

    setForm({ month: "", category: "", amount: "" });
    onSaved?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="shadow-sm mb-4">
        <CardContent className="p-4">
          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <Input
              placeholder="YYYY-MM"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              required
            />

            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            />

            <Input
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              className="flex items-center gap-2"
            >
              <Wallet size={18} />
              Save
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
