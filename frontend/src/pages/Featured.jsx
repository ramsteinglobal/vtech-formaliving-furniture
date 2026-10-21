import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import Img from '../components/Img';
import { useCart, useCatalogue } from '../store';
import { fmt } from '../data/site';
import { useTitle } from '../hooks/useTitle';

const colours = [['Terracotta', '#b5694a'], ['Oat', '#e9d9c2'], ['Sage', '#8a9a7b'], ['Walnut', '#4a3426']];
const specs = [['Frame', 'Solid sheesham'], ['Fabric', 'Performance bouclé'], ['Size', '218 × 92 × 82 cm'], ['Delivery', '7–10 working days']];

export default function Featured() {
  const [colour, setColour] = useState(0);
  const { products } = useCatalogue();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const p = products.find((x) => x.name === 'Kalpa 3-Seater Sofa');
  useTitle('Kalpa 3-Seater Sofa');
  return (
    <>
      <PageHead page="featured" />
      <section className="feat"><div className="wrap">
        <Reveal className="art"><Img k="sofa" alt="Beige three-seater sofa" pos="72% 60%" /></Reveal>
        <Reveal>
          <div className="eyebrow">Bestseller</div>
          <h2 style={{ marginBottom: 10 }}>The Kalpa 3-Seater Sofa</h2>
          <div className="rate"><b>★★★★★</b> 4.9 · 482 reviews · In stock</div>
          {p && <div className="price">{fmt(p.price)}{p.mrp > 0 && <s>{fmt(p.mrp)}</s>}</div>}
          <small style={{ color: 'var(--mute)' }}>Inclusive of GST · Free delivery &amp; assembly</small>
          <ul className="specs">{specs.map(([k, v]) => <li key={k}><span>{k}</span>{v}</li>)}</ul>
          <div className="swatches" role="radiogroup" aria-label="Colour">
            Colour: {colours.map(([name, hex], i) => (
              <i key={name} role="radio" tabIndex={0} aria-checked={colour === i} aria-label={name}
                 className={`sw ${colour === i ? 'on' : ''}`} style={{ background: hex }}
                 onClick={() => setColour(i)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setColour(i)} />
            ))}
            <span>{colours[colour][0]}</span>
          </div>
          {p && <button className="btn" type="button" onClick={() => { add(p); setAdded(true); }}>{added ? 'Added ✓ · View cart below' : 'Add to cart'}</button>}{' '}
          {added && <p className="ok-line"><Link to="/cart">Go to cart →</Link></p>}
          <Link className="btn ghost" to="/contact">Request fabric swatches</Link>
        </Reveal>
      </div></section>
    </>
  );
}
