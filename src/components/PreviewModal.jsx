import { useEffect } from 'react';
import OrderDocument from './OrderDocument.jsx';

export default function PreviewModal({ order, company, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-toolbar no-print">
        <span className="preview-title">Aperçu — {order.number}</span>
        <div className="preview-toolbar-actions">
          <button
            type="button"
            className="btn primary"
            onClick={() => window.print()}
          >
            Imprimer / Enregistrer en PDF
          </button>
          <button type="button" className="btn ghost light" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
      <div className="preview-scroll" onClick={(e) => e.stopPropagation()}>
        <OrderDocument order={order} company={company} />
      </div>
    </div>
  );
}
