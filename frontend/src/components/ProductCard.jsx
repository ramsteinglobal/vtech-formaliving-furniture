import { Link } from 'react-router-dom';
import Img from './Img';
import { catLabel, fmt } from '../data/site';

export default function ProductCard({ p }) {
  return (
    <div className="pc in">
      <div className="pi">
        <Img k={p.image} alt={p.name} pos={p.pos} />
        {p.mrp > 0 && <em>Save {Math.round((1 - p.price / p.mrp) * 100)}%</em>}
      </div>
      <div className="pb">
        <small>{catLabel[p.category]}</small>
        <h3>{p.name}</h3>
        <div className="pp">{fmt(p.price)}{p.mrp > 0 && <s>{fmt(p.mrp)}</s>}</div>
        <Link className="btn" to={`/contact?product=${encodeURIComponent(p.name)}`}>Order now</Link>
      </div>
    </div>
  );
}
