const ORDERS_KEY = 'acquaegiardini.orders.v1';
const COMPANY_KEY = 'acquaegiardini.company.v1';

export function loadOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* quota dépassé ou stockage indisponible : on ignore silencieusement */
  }
}

export function loadCompany() {
  try {
    const raw = localStorage.getItem(COMPANY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCompany(company) {
  try {
    localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
  } catch {
    /* idem */
  }
}
