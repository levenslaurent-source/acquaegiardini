import { todayISO } from './format.js';

export function uid() {
  return 'o' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function generateNumber(orders) {
  const year = new Date().getFullYear();
  const prefix = `BC-${year}-`;
  const seqs = (orders || [])
    .map((o) => o.number)
    .filter((n) => typeof n === 'string' && n.startsWith(prefix))
    .map((n) => parseInt(n.slice(prefix.length), 10))
    .filter((n) => Number.isFinite(n));
  const next = (seqs.length ? Math.max(...seqs) : 0) + 1;
  return prefix + String(next).padStart(3, '0');
}

export function emptyItem() {
  return {
    id: uid(),
    designation: '',
    quantity: 1,
    unit: 'u',
    unitPrice: 0,
    vatRate: 20,
  };
}

export function createOrder(orders) {
  const now = new Date().toISOString();
  return {
    id: uid(),
    number: generateNumber(orders),
    status: 'Brouillon',
    orderDate: todayISO(),
    deliveryDate: '',
    client: {
      company: '',
      name: '',
      address: '',
      zip: '',
      city: '',
      phone: '',
      email: '',
    },
    items: [emptyItem()],
    depositRate: 30,
    paymentMethod: 'Virement bancaire',
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function duplicateOrder(order, orders) {
  const fresh = createOrder(orders);
  return {
    ...fresh,
    status: 'Brouillon',
    client: { ...order.client },
    items: (order.items || []).map((it) => ({ ...it, id: uid() })),
    depositRate: order.depositRate,
    paymentMethod: order.paymentMethod,
    notes: order.notes,
  };
}
