import { useMemo, useState } from 'react';
import LineItemsTable from './LineItemsTable.jsx';
import TotalsPanel from './TotalsPanel.jsx';
import { computeTotals } from '../lib/calc.js';
import { catalog } from '../data/catalog.js';

const STATUSES = ['Brouillon', 'Confirmé', 'En préparation', 'Livré', 'Annulé'];
const PAYMENTS = [
  'Virement bancaire',
  'Chèque',
  'Espèces',
  'Carte bancaire',
  'À réception de facture',
];

export default function OrderEditor({
  order,
  company,
  isSaved,
  onChange,
  onSave,
  onPreview,
  onBack,
}) {
  const [savedFlash, setSavedFlash] = useState(false);
  const totals = useMemo(() => computeTotals(order), [order]);

  function patch(fields) {
    onChange({ ...order, ...fields });
  }
  function patchClient(fields) {
    onChange({ ...order, client: { ...order.client, ...fields } });
  }

  function handleSave() {
    onSave(order);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2200);
  }

  const clientLabel =
    order.client.company || order.client.name || 'Client non renseigné';

  return (
    <div className="editor">
      <div className="editor-head no-print">
        <button type="button" className="btn ghost" onClick={onBack}>
          ← Historique
        </button>
        <div className="editor-title">
          <h1>Bon de commande {order.number}</h1>
          <span className={isSaved ? 'tag saved' : 'tag draft'}>
            {isSaved ? 'Enregistré' : 'Non enregistré'}
          </span>
        </div>
        <div className="editor-actions">
          <button
            type="button"
            className="btn"
            onClick={() => onPreview(order)}
          >
            Aperçu / Imprimer
          </button>
          <button type="button" className="btn primary" onClick={handleSave}>
            {savedFlash ? '✓ Enregistré' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <div className="editor-grid">
        <div className="editor-main">
          <section className="card">
            <h2 className="card-title">Informations du bon</h2>
            <div className="grid grid-3">
              <label className="field">
                <span>Numéro</span>
                <input
                  type="text"
                  value={order.number}
                  onChange={(e) => patch({ number: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Statut</span>
                <select
                  value={order.status}
                  onChange={(e) => patch({ status: e.target.value })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <span />
              <label className="field">
                <span>Date de commande</span>
                <input
                  type="date"
                  value={order.orderDate}
                  onChange={(e) => patch({ orderDate: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Livraison / installation prévue</span>
                <input
                  type="date"
                  value={order.deliveryDate}
                  onChange={(e) => patch({ deliveryDate: e.target.value })}
                />
              </label>
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">Client</h2>
            <div className="grid grid-2">
              <label className="field">
                <span>Société</span>
                <input
                  type="text"
                  placeholder="Nom de la société (facultatif)"
                  value={order.client.company}
                  onChange={(e) => patchClient({ company: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Contact</span>
                <input
                  type="text"
                  placeholder="Nom et prénom"
                  value={order.client.name}
                  onChange={(e) => patchClient({ name: e.target.value })}
                />
              </label>
              <label className="field field-wide">
                <span>Adresse</span>
                <input
                  type="text"
                  placeholder="N° et rue"
                  value={order.client.address}
                  onChange={(e) => patchClient({ address: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Code postal</span>
                <input
                  type="text"
                  value={order.client.zip}
                  onChange={(e) => patchClient({ zip: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Ville</span>
                <input
                  type="text"
                  value={order.client.city}
                  onChange={(e) => patchClient({ city: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Téléphone</span>
                <input
                  type="tel"
                  value={order.client.phone}
                  onChange={(e) => patchClient({ phone: e.target.value })}
                />
              </label>
              <label className="field">
                <span>E-mail</span>
                <input
                  type="email"
                  value={order.client.email}
                  onChange={(e) => patchClient({ email: e.target.value })}
                />
              </label>
            </div>
          </section>

          <section className="card">
            <h2 className="card-title">Articles et prestations</h2>
            <LineItemsTable
              items={order.items}
              catalog={catalog}
              onChange={(items) => patch({ items })}
            />
          </section>

          <section className="card">
            <h2 className="card-title">Conditions</h2>
            <div className="grid grid-2">
              <label className="field">
                <span>Mode de règlement</span>
                <select
                  value={order.paymentMethod}
                  onChange={(e) => patch({ paymentMethod: e.target.value })}
                >
                  {PAYMENTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Acompte à la commande (%)</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={order.depositRate}
                  onChange={(e) => patch({ depositRate: e.target.value })}
                />
              </label>
              <label className="field field-wide">
                <span>Notes / observations</span>
                <textarea
                  rows="3"
                  placeholder="Conditions particulières, délais, garanties…"
                  value={order.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="editor-aside no-print">
          <TotalsPanel totals={totals} />
          <div className="aside-summary">
            <div className="aside-line">
              <span>Client</span>
              <strong>{clientLabel}</strong>
            </div>
            <div className="aside-line">
              <span>Articles</span>
              <strong>{order.items.length}</strong>
            </div>
          </div>
          <div className="aside-actions">
            <button
              type="button"
              className="btn block"
              onClick={() => onPreview(order)}
            >
              Aperçu / Imprimer
            </button>
            <button
              type="button"
              className="btn primary block"
              onClick={handleSave}
            >
              {savedFlash ? '✓ Enregistré' : 'Enregistrer le bon'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
