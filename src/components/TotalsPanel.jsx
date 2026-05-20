import { formatCurrency, formatNumber } from '../lib/format.js';

export default function TotalsPanel({ totals }) {
  const { totalHT, vatGroups, totalTTC, depositRate, deposit, remaining } =
    totals;

  return (
    <div className="totals-panel">
      <h2 className="card-title">Totaux</h2>
      <div className="totals-rows">
        <div className="totals-row">
          <span>Total HT</span>
          <span>{formatCurrency(totalHT)}</span>
        </div>
        {vatGroups.length === 0 && (
          <div className="totals-row muted">
            <span>TVA</span>
            <span>{formatCurrency(0)}</span>
          </div>
        )}
        {vatGroups.map((g) => (
          <div className="totals-row muted" key={g.rate}>
            <span>
              TVA {formatNumber(g.rate)} %{' '}
              <em>(sur {formatCurrency(g.base)})</em>
            </span>
            <span>{formatCurrency(g.amount)}</span>
          </div>
        ))}
        <div className="totals-row grand">
          <span>Total TTC</span>
          <span>{formatCurrency(totalTTC)}</span>
        </div>
        {depositRate > 0 && (
          <>
            <div className="totals-row">
              <span>Acompte ({formatNumber(depositRate)} %)</span>
              <span>{formatCurrency(deposit)}</span>
            </div>
            <div className="totals-row remaining">
              <span>Reste à payer</span>
              <span>{formatCurrency(remaining)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
