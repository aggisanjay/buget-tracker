/**
 * Pluggable aggregator service. Start with a dummy provider.
 * Later, replace fetchLatestTransactions with real API calls (e.g., Salt/Finbox/Plaid).
 */
import Transaction from "../../models/Transaction.js";

export async function importFromAggregator(userId) {
  // Dummy data — replace with real provider results
  const incoming = [
    { externalId: "ext_001", date: new Date(), amount: -199.0, category: "Food", merchant: "Swiggy", note: "Aggregator" }
  ];

  for (const t of incoming) {
    const exists = await Transaction.findOne({ user: userId, externalId: t.externalId });
    if (exists) continue;
    await Transaction.create({ ...t, user: userId, source: "aggregator" });
  }
  return { imported: incoming.length };
}
