import { useMemo, useState } from 'react';
import { computeTotals } from '../lib/calc.js';
import { formatCurrency, formatDate } from '../lib/format.js';

function statusClass(status) {
  const map = {
    Brouillon: 'st-draft',
    Confirmé: 'st-ok',
    'En préparation': 'st-prep',
    Livré: 'st-done',
    Annulé: 'st-cancel',
  };
  return map[status] || 'st-draft';
}

export default function HistoryList({
  orders,
  onNew,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}) {
  const [query, setQuery] = useState('');

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...orders]
      .filter((o) => {
        if (!q) return true;
        const haystack = [
          o.number,
          o.client?.company,
          o.client?.name,
          o.client?.city,
          o.status,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  }, [orders, query]);

  if (orders.length === 0) {
    return (
      <div className="empty">
        <div className="empty-mark" aria-hidden="true">≈</div>
        <h1>Aucun bon de commande</h1>
        <p>
          Créez votre premier bon de commande. Il sera enregistré
          automatiquement dans ce navigateur.
        </p>
        <button type="button" className="btn primary" onClick={onNew}>
          + Créer un bon de commande
        </button>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-head">
        <h1>Historique des bons de commande</h1>
        <input
          type="search"
          className="search"
          placeholder="Rechercher (n°, client, ville…)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {sorted.length === 0 ? (
        <p className="history-none">Aucun bon ne correspond à la recherche.</p>
      ) : (
        <ul className="order-list">
          {sorted.map((order) => {
            const totals = computeTotals(order);
            const client =
              order.client?.company ||
              order.client?.name ||
              'Client non renseigné';
            return (
              <li key={order.id} className="order-card">
                <div className="order-card-main">
                  <div className="order-card-top">
                    <span className="order-number">{order.number}</span>
                    <span className={`st-tag ${statusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-client">{client}</div>
                  <div className="order-meta">
                    <span>Commande : {formatDate(order.orderDate)}</span>
                    <span>·</span>
                    <span>
                      {order.items.length} ligne
                      {order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="order-card-total">
                  <span className="order-ttc">
                    {formatCurrency(totals.totalTTC)}
                  </span>
                  <span className="order-ttc-label">TTC</span>
                </div>
                <div className="order-card-actions">
                  <button
                    type="button"
                    className="btn small primary"
                    onClick={() => onEdit(order)}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => onPreview(order)}
                  >
                    Aperçu
                  </button>
                  <button
                    type="button"
                    className="btn small ghost"
                    onClick={() => onDuplicate(order)}
                  >
                    Dupliquer
                  </button>
                  <button
                    type="button"
                    className="btn small danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Supprimer le bon ${order.number} ? Cette action est définitive.`,
                        )
                      ) {
                        onDelete(order.id);
                      }
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
