import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

const sorts = {
  featured: ['Featured', null],
  low: ['Price: low to high', (a, b) => a.price - b.price],
  high: ['Price: high to low', (a, b) => b.price - a.price],
  name: ['Name: A to Z', (a, b) => a.name.localeCompare(b.name)],
};

export default function ProductGrid({ items }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = items.filter((p) => !term || p.name.toLowerCase().includes(term));
    const cmp = sorts[sort][1];
    return cmp ? [...list].sort(cmp) : list;
  }, [items, q, sort]);

  return (
    <>
      <div className="tools">
        <input type="search" aria-label="Search products" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}>
          {Object.entries(sorts).map(([k, [label]]) => <option key={k} value={k}>{label}</option>)}
        </select>
        <span className="count" aria-live="polite">{shown.length} {shown.length === 1 ? 'product' : 'products'}</span>
      </div>
      {shown.length ? <div className="pg">{shown.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        : <p className="empty">{q.trim() ? `No products match “${q.trim()}”. Try a different word.` : 'No products here yet.'}</p>}
    </>
  );
}