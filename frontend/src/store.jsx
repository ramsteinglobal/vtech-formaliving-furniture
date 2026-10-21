import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getProducts } from './api';
import { products as local } from './data/products';

/* ---------- Catalogue: shows bundled data instantly, swaps in API data when it arrives ---------- */
const CatalogueCtx = createContext({ products: local, loading: false });
export function CatalogueProvider({ children }) {
  const [state, setState] = useState({ products: local, loading: true });
  useEffect(() => {
    let live = true;
    getProducts().then((products) => live && setState({ products, loading: false }));
    return () => { live = false; };
  }, []);
  return <CatalogueCtx.Provider value={state}>{children}</CatalogueCtx.Provider>;
}
export const useCatalogue = () => useContext(CatalogueCtx);

/* ---------- Cart: kept in localStorage so it survives a refresh ---------- */
const KEY = 'forma-cart';
const CartCtx = createContext(null);
const MAX_QTY = 20;

function load() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ } }, [items]);

  const add = useCallback((p, qty = 1) => setItems((cur) => {
    const id = String(p.id);
    const found = cur.find((i) => i.id === id);
    if (found) return cur.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
    return [...cur, { id, name: p.name, price: p.price, mrp: p.mrp, image: p.image, pos: p.pos, qty }];
  }), []);
  const setQty = useCallback((id, qty) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : i))), []);
  const remove = useCallback((id) => setItems((cur) => cur.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items, add, setQty, remove, clear, MAX_QTY,
    count: items.reduce((n, i) => n + i.qty, 0),
    total: items.reduce((n, i) => n + i.price * i.qty, 0),
  }), [items, add, setQty, remove, clear]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
export const useCart = () => useContext(CartCtx);
