import { useState } from "react";
import api from "../api/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TransactionForm({ onCreated }) {
  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    merchant: "",
    note: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };

    await api.post("/transactions", payload);

    setForm({
      date: "",
      amount: "",
      category: "",
      merchant: "",
      note: "",
    });

    onCreated?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="mb-4 shadow-sm">
        <CardContent className="p-4">
          <form
            onSubmit={submit}
            className="grid grid-cols-1 md:grid-cols-6 gap-3"
          >
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />

            <Input
              placeholder="Amount (negative = expense)"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
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
              placeholder="Merchant"
              value={form.merchant}
              onChange={(e) =>
                setForm({ ...form, merchant: e.target.value })
              }
            />

            <Input
              placeholder="Note"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />

            <Button type="submit" className="flex items-center gap-2">
              <PlusCircle size={18} />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
