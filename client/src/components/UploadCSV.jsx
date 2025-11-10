import api from "../api/client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function UploadCSV({ onDone }) {
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await api.post("/transactions/import/csv", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    onDone?.();
  };

  return (
    <label className="cursor-pointer">
      {/* ✅ Styled button */}
      <Button
        variant="secondary"
        type="button"
        className="flex items-center gap-2"
      >
        <Upload size={18} /> Import CSV
      </Button>

      {/* ✅ Hidden file input */}
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={upload}
      />
    </label>
  );
}
