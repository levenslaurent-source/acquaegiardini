import { computeTotals, lineTotalHT } from '../lib/calc.js';
import { formatCurrency, formatDate, formatNumber } from '../lib/format.js';

export default function OrderDocument({ order, company }) {
  const totals = computeTotals(order);
  const c = order.client || {};
  const hasClient = c.company || c.name || c.address || c.city;

  return (
    <article className="order-document">
      <header className="doc-head">
        <div className="doc-company">
          <div className="doc-company-name">
            {company.name || 'Acquae Giardini'}
          </div>
          {company.tagline && (
            <div className="doc-company-tag">{company.tagline}</div>
          )}
          <div className="doc-lines">
            {company.address && <div>{company.address}</div>}
            {(company.zip || company.city) && (
              <div>
                {company.zip} {company.city}
              </div>
            )}
            {company.phone && <div>Tél. {company.phone}</div>}
            {company.email && <div>{company.email}</div>}
            {company.website && <div>{company.website}</div>}
          </div>
        </div>
        <div className="doc-title-block">
          <div className="doc-title">Bon de commande</div>
          <table className="doc-meta">
            <tbody>
              <tr>
                <th>Numéro</th>
                <td>{order.number}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{formatDate(order.orderDate)}</td>
              </tr>
              <tr>
                <th>Livraison prévue</th>
                <td>{formatDate(order.deliveryDate)}</td>
              </tr>
              <tr>
                <th>Statut</th>
                <td>{order.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </header>

      <section className="doc-client">
        <div className="doc-section-label">Client</div>
        <div className="doc-client-body">
          {hasClient ? (
            <>
              {c.company && (
                <div className="doc-client-name">{c.company}</div>
              )}
              {c.name && <div>{c.name}</div>}
              {c.address && <div>{c.address}</div>}
              {(c.zip || c.city) && (
                <div>
                  {c.zip} {c.city}
                </div>
              )}
              {c.phone && <div>Tél. {c.phone}</div>}
              {c.email && <div>{c.email}</div>}
            </>
          ) : (
            <div className="doc-muted">Client non renseigné</div>
          )}
        </div>
      </section>

      <table className="doc-items">
        <thead>
          <tr>
            <th className="d-desc">Désignation</th>
            <th className="d-num">Qté</th>
            <th className="d-unit">Unité</th>
            <th className="d-num">P.U. HT</th>
            <th className="d-num">TVA</th>
            <th className="d-num">Total HT</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.designation || '—'}</td>
              <td className="d-num">{formatNumber(item.quantity)}</td>
              <td className="d-unit">{item.unit}</td>
              <td className="d-num">{formatCurrency(item.unitPrice)}</td>
              <td className="d-num">{formatNumber(item.vatRate)} %</td>
              <td className="d-num">{formatCurrency(lineTotalHT(item))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="doc-bottom">
        <div className="doc-conditions">
          <div className="doc-section-label">Conditions de règlement</div>
          <div className="doc-lines">
            <div>Mode de règlement : {order.paymentMethod}</div>
            {totals.depositRate > 0 && (
              <div>
                Acompte à la commande : {formatNumber(totals.depositRate)} % —{' '}
                {formatCurrency(totals.deposit)}
              </div>
            )}
          </div>
          {order.notes && (
            <div className="doc-notes">
              <div className="doc-section-label">Observations</div>
              <p>{order.notes}</p>
            </div>
          )}
        </div>

        <table className="doc-totals">
          <tbody>
            <tr>
              <th>Total HT</th>
              <td>{formatCurrency(totals.totalHT)}</td>
            </tr>
            {totals.vatGroups.length === 0 && (
              <tr>
                <th>TVA</th>
                <td>{formatCurrency(0)}</td>
              </tr>
            )}
            {totals.vatGroups.map((g) => (
              <tr key={g.rate}>
                <th>TVA {formatNumber(g.rate)} %</th>
                <td>{formatCurrency(g.amount)}</td>
              </tr>
            ))}
            <tr className="doc-ttc">
              <th>Total TTC</th>
              <td>{formatCurrency(totals.totalTTC)}</td>
            </tr>
            {totals.depositRate > 0 && (
              <>
                <tr>
                  <th>Acompte ({formatNumber(totals.depositRate)} %)</th>
                  <td>{formatCurrency(totals.deposit)}</td>
                </tr>
                <tr className="doc-remaining">
                  <th>Reste à payer</th>
                  <td>{formatCurrency(totals.remaining)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="doc-signatures">
        <div className="doc-sign">
          <div className="doc-sign-label">
            Le client — bon pour accord
            <span>(date et signature)</span>
          </div>
          <div className="doc-sign-space" />
        </div>
        <div className="doc-sign">
          <div className="doc-sign-label">
            {company.name || 'Acquae Giardini'}
            <span>(date et signature)</span>
          </div>
          <div className="doc-sign-space" />
        </div>
      </div>

      <footer className="doc-foot">
        {[
          company.name,
          company.siret && `SIRET ${company.siret}`,
          company.tvaNumber && `TVA ${company.tvaNumber}`,
        ]
          .filter(Boolean)
          .join('  ·  ')}
      </footer>
    </article>
  );
}
