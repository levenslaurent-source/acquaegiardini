import { useEffect, useState } from 'react';
import OrderEditor from './components/OrderEditor.jsx';
import HistoryList from './components/HistoryList.jsx';
import CompanySettings from './components/CompanySettings.jsx';
import PreviewModal from './components/PreviewModal.jsx';
import { loadOrders, saveOrders, loadCompany, saveCompany } from './lib/storage.js';
import { defaultCompany } from './lib/company.js';
import { createOrder, duplicateOrder } from './lib/order.js';

export default function App() {
  const [orders, setOrders] = useState(() => loadOrders());
  const [company, setCompany] = useState(() => ({
    ...defaultCompany,
    ...(loadCompany() || {}),
  }));
  const [view, setView] = useState('history');
  const [current, setCurrent] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveCompany(company);
  }, [company]);

  function handleNew() {
    setCurrent(createOrder(orders));
    setView('editor');
  }

  function handleEdit(order) {
    setCurrent(JSON.parse(JSON.stringify(order)));
    setView('editor');
  }

  function handleSave(order) {
    const stamped = { ...order, updatedAt: new Date().toISOString() };
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === stamped.id);
      if (idx === -1) return [stamped, ...prev];
      const copy = prev.slice();
      copy[idx] = stamped;
      return copy;
    });
    setCurrent(stamped);
  }

  function handleDelete(id) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (current && current.id === id) {
      setCurrent(null);
      setView('history');
    }
  }

  function handleDuplicate(order) {
    const copy = duplicateOrder(order, orders);
    setOrders((prev) => [copy, ...prev]);
    setCurrent(JSON.parse(JSON.stringify(copy)));
    setView('editor');
  }

  const isSavedCurrent = current && orders.some((o) => o.id === current.id);

  return (
    <div className="app">
      <header className="topbar no-print">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">≈</span>
          <div className="brand-text">
            <strong>{company.name || 'Acquae Giardini'}</strong>
            <span>Bons de commande</span>
          </div>
        </div>
        <nav className="topnav">
          <button
            type="button"
            className={view === 'history' ? 'navbtn active' : 'navbtn'}
            onClick={() => setView('history')}
          >
            Historique
            {orders.length > 0 && <span className="badge">{orders.length}</span>}
          </button>
          <button
            type="button"
            className={view === 'editor' ? 'navbtn active' : 'navbtn'}
            onClick={() => (current ? setView('editor') : handleNew())}
          >
            Éditeur
          </button>
          <button
            type="button"
            className={view === 'settings' ? 'navbtn active' : 'navbtn'}
            onClick={() => setView('settings')}
          >
            Entreprise
          </button>
          <button type="button" className="navbtn primary" onClick={handleNew}>
            + Nouveau bon
          </button>
        </nav>
      </header>

      <main className="content">
        {view === 'history' && (
          <HistoryList
            orders={orders}
            onNew={handleNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onPreview={setPreview}
          />
        )}

        {view === 'editor' && current && (
          <OrderEditor
            key={current.id}
            order={current}
            company={company}
            isSaved={isSavedCurrent}
            onChange={setCurrent}
            onSave={handleSave}
            onPreview={setPreview}
            onBack={() => setView('history')}
          />
        )}

        {view === 'editor' && !current && (
          <div className="empty">
            <p>Aucun bon de commande en cours d’édition.</p>
            <button type="button" className="btn primary" onClick={handleNew}>
              Créer un bon de commande
            </button>
          </div>
        )}

        {view === 'settings' && (
          <CompanySettings company={company} onChange={setCompany} />
        )}
      </main>

      {preview && (
        <PreviewModal
          order={preview}
          company={company}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
