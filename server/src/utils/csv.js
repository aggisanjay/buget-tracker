import Papa from "papaparse";

export function parseCSV(buffer) {
  const text = buffer.toString("utf-8");
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
  // Expected headers: date,amount,category,merchant,note
  return data.map(r => ({
    date: new Date(r.date),
    amount: Number(r.amount),
    category: (r.category || "Uncategorized").trim(),
    merchant: (r.merchant || "").trim(),
    note: (r.note || "").trim()
  })).filter(x => !Number.isNaN(x.amount) && x.date.toString() !== "Invalid Date");
}
