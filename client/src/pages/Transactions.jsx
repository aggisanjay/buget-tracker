import { useEffect, useState } from "react";
import api from "../api/client";
import TransactionForm from "../components/TransactionForm";
import UploadCSV from "../components/UploadCSV";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Upload, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Transactions() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  const load = async () => {
    const { data } = await api.get("/transactions", {
      params: { q, page, limit: 10 },
    });
    setItems(data.items);
    setMeta({ total: data.total, pages: data.pages });
  };

  useEffect(() => {
    load();
  }, [q, page]);

  const remove = async (id) => {
    await api.delete(`/transactions/${id}`);
    load();
  };

  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold text-gray-800">Transactions</h2>

      {/* ✅ Search + CSV Upload */}
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">

          {/* Search Input */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-2 top-2.5 text-gray-500" size={18} />
            <Input
              placeholder="Search merchant, note or category"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* CSV Upload */}
          <div className="flex items-center gap-3">
            <UploadCSV
              onDone={load}
              component={
                <Button variant="secondary" className="flex items-center gap-2">
                  <Upload size={16} />
                  Import CSV
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* ✅ Form */}
      <TransactionForm onCreated={load} />

      {/* ✅ Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Transaction History</CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Merchant</th>
                <th className="p-3 text-left">Note</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}

              {items.map((t, i) => (
                <motion.tr
                  key={t._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-t"
                >
                  <td className="p-3">{new Date(t.date).toLocaleDateString()}</td>

                  {/* Amount with color */}
                  <td className="p-3">
                    <Badge
                      className="px-3 py-1"
                      variant={t.amount < 0 ? "destructive" : "secondary"}
                    >
                      ₹{t.amount}
                    </Badge>
                  </td>

                  <td className="p-3">{t.category}</td>
                  <td className="p-3">{t.merchant}</td>
                  <td className="p-3">{t.note}</td>

                  <td className="p-3 text-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(t._id)}
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

      {/* ✅ Pagination */}
      <div className="flex items-center justify-center gap-4 py-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          variant="outline"
        >
          Prev
        </Button>

        <span className="font-medium text-gray-700">
          Page {page} / {meta.pages}
        </span>

        <Button
          disabled={page >= meta.pages}
          onClick={() => setPage((p) => p + 1)}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
