import { useState } from 'react';
import { emptyItem, uid } from '../lib/order.js';
import { lineTotalHT } from '../lib/calc.js';
import { formatCurrency } from '../lib/format.js';

const UNITS = ['u', 'm', 'ml', 'm²', 'm³', 'h', 'j', 'lot', 'forfait'];
const VAT_RATES = [20, 10, 5.5, 0];

export default function LineItemsTable({ items, catalog, onChange }) {
  const [showCatalog, setShowCatalog] = useState(false);

  function updateItem(id, fields) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...fields } : it)));
  }
  function removeItem(id) {
    onChange(items.filter((it) => it.id !== id));
  }
  function addItem() {
    onChange([...items, emptyItem()]);
  }
  function addFromCatalog(entry) {
    onChange([
      ...items,
      {
        id: uid(),
        designation: entry.designation,
        quantity: 1,
        unit: entry.unit,
        unitPrice: entry.unitPrice,
        vatRate: entry.vatRate,
      },
    ]);
  }

  return (
    <div className="items">
      <div className="items-scroll">
        <table className="items-table">
          <thead>
            <tr>
              <th className="col-desc">Désignation</th>
              <th className="col-num">Qté</th>
              <th className="col-unit">Unité</th>
              <th className="col-num">P.U. HT</th>
              <th className="col-vat">TVA</th>
              <th className="col-total">Total HT</th>
              <th className="col-act" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="7" className="items-empty">
                  Aucune ligne. Ajoutez un article ou choisissez dans le
                  catalogue.
                </td>
              </tr>
            )}
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    className="cell-input"
                    placeholder="Désignation de l’article ou de la prestation"
                    value={item.designation}
                    onChange={(e) =>
                      updateItem(item.id, { designation: e.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="cell-input num"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, { quantity: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    className="cell-input"
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(item.id, { unit: e.target.value })
                    }
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    className="cell-input num"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, { unitPrice: e.target.value })
                    }
                  />
                </td>
                <td>
                  <select
                    className="cell-input"
                    value={item.vatRate}
                    onChange={(e) =>
                      updateItem(item.id, { vatRate: e.target.value })
                    }
                  >
                    {VAT_RATES.map((r) => (
                      <option key={r} value={r}>
                        {r} %
                      </option>
                    ))}
                  </select>
                </td>
                <td className="cell-total">
                  {formatCurrency(lineTotalHT(item))}
                </td>
                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    title="Supprimer la ligne"
                    onClick={() => removeItem(item.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="items-toolbar">
        <button type="button" className="btn" onClick={addItem}>
          + Ajouter une ligne
        </button>
        <button
          type="button"
          className="btn ghost"
          onClick={() => setShowCatalog((v) => !v)}
        >
          {showCatalog ? 'Masquer le catalogue' : 'Catalogue rapide'}
        </button>
      </div>

      {showCatalog && (
        <div className="catalog">
          {catalog.map((entry) => (
            <button
              type="button"
              key={entry.designation}
              className="catalog-chip"
              onClick={() => addFromCatalog(entry)}
              title={`${formatCurrency(entry.unitPrice)} / ${entry.unit}`}
            >
              {entry.designation}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
