import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Img from '../components/Img';
import ProductCard from '../components/ProductCard';
import NotFound from './NotFound';
import { useCart, useCatalogue } from '../store';
import { catLabel, fmt, trust } from '../data/site';
import { useTitle } from '../hooks/useTitle';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, loading } = useCatalogue();
  const { add, MAX_QTY } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const p = products.find((x) => String(x.id) === id);
  useTitle(p ? p.name : loading ? 'Loading…' : 'Product not found');

  if (!p) return loading ? <section><div className="wrap"><p>Loading…</p></div></section> : <NotFound />;
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const onAdd = () => { add(p, qty); setAdded(true); };

  return (
    <>
      <section className="pdet"><div className="wrap">
        <div className="art"><Img k={p.image} alt={p.name} pos={p.pos} /></div>
        <div>
          <div className="crumb"><Link to="/">Home</Link> / <Link to={`/shop/${p.category}`}>{catLabel[p.category]}</Link></div>
          <h1>{p.name}</h1>
          <div className="price">{fmt(p.price)}{p.mrp > 0 && <s>{fmt(p.mrp)}</s>}</div>
          {p.mrp > 0 && <small className="save">You save {fmt(p.mrp - p.price)} ({Math.round((1 - p.price / p.mrp) * 100)}% off)</small>}
          <small style={{ display: 'block', color: 'var(--mute)', margin: '6px 0 22px' }}>Inclusive of GST</small>
          <div className="buy">
            <div className="qty" role="group" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <output aria-live="polite">{qty}</output>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty(Math.min(MAX_QTY, qty + 1))}>+</button>
            </div>
            <button className="btn" type="button" onClick={onAdd}>Add to cart</button>
          </div>
          {added && <p className="ok-line">Added to your cart. <Link to="/cart">View cart →</Link></p>}
          <p><Link className="btn ghost" to={`/contact?product=${encodeURIComponent(p.name)}`}>Ask about this piece</Link></p>
          <ul className="perks">{trust.map(([b, s]) => <li key={b}><b>{b}</b> {s}</li>)}</ul>
        </div>
      </div></section>
      {related.length > 0 && (
        <section style={{ paddingTop: 0 }}><div className="wrap">
          <h2>You may also like</h2>
          <div className="pg">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </div></section>
      )}
    </>
  );
}
