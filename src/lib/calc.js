export function lineTotalHT(item) {
  const qty = parseFloat(item.quantity) || 0;
  const price = parseFloat(item.unitPrice) || 0;
  return qty * price;
}

export function computeTotals(order) {
  const items = order?.items || [];
  let totalHT = 0;
  const vatByRate = new Map();

  for (const item of items) {
    const ht = lineTotalHT(item);
    totalHT += ht;
    const rate = parseFloat(item.vatRate) || 0;
    vatByRate.set(rate, (vatByRate.get(rate) || 0) + ht);
  }

  const vatGroups = [...vatByRate.entries()]
    .filter(([, base]) => base !== 0)
    .sort((a, b) => b[0] - a[0])
    .map(([rate, base]) => ({ rate, base, amount: (base * rate) / 100 }));

  const totalVAT = vatGroups.reduce((sum, g) => sum + g.amount, 0);
  const totalTTC = totalHT + totalVAT;

  const depositRate = parseFloat(order?.depositRate) || 0;
  const deposit = (totalTTC * depositRate) / 100;
  const remaining = totalTTC - deposit;

  return {
    totalHT,
    vatGroups,
    totalVAT,
    totalTTC,
    depositRate,
    deposit,
    remaining,
  };
}
