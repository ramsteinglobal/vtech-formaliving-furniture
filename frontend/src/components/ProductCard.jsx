import { useState } from 'react';
import { Link } from 'react-router-dom';
import Img from './Img';
import { useCart } from '../store';
import { catLabel, fmt } from '../data/site';

export default function ProductCard({ p }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const onAdd = () => { add(p); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  return (
    <div className="pc in">
      <Link className="pi" to={`/product/${p.id}`} aria-label={`View ${p.name}`}>
        <Img k={p.image} alt={p.name} pos={p.pos} />
        {p.mrp > 0 && <em>Save {Math.round((1 - p.price / p.mrp) * 100)}%</em>}
      </Link>
      <div className="pb">
        <small>{catLabel[p.category]}</small>
        <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
        <div className="pp">{fmt(p.price)}{p.mrp > 0 && <s>{fmt(p.mrp)}</s>}</div>
        <button className="btn" type="button" onClick={onAdd}>{added ? 'Added ✓' : 'Add to cart'}</button>
      </div>
    </div>
  );
}
