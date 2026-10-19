import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import Img from './Img';
import { categories, gallery, trust, fmt } from '../data/site';

function Stat({ end, decimals = 0, post = '', label }) {
  const ref = useRef(null);
  const [v, setV] = useState(end);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        setV(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      setV(0); requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [end]);
  return <div ref={ref}><b>{v.toFixed(decimals)}{post}</b><span>{label}</span></div>;
}

export function Hero() {
  const art = useRef(null);
  const tilt = (e) => {
    if (!matchMedia('(hover:hover)').matches) return;
    const r = art.current.getBoundingClientRect();
    art.current.style.transform = `perspective(900px) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 6}deg) rotateX(${(0.5 - (e.clientY - r.top) / r.height) * 6}deg)`;
  };
  const words = [['Furniture'], ['that'], ['makes'], ['a'], ['house'], ['feel', 'em'], ['like', 'em'], ['home.', 'em']];
  let i = 0;
  const w = (t) => <span className="w" key={t + i}><i style={{ animationDelay: `${i++ * 70 + 200}ms` }}>{t}</i></span>;
  return (
    <section className="hero"><div className="wrap">
      <Reveal>
        <div className="eyebrow">Autumn Collection 2026</div>
        <h1>
          {w('Furniture')} {w('that')} {w('makes')} {w('a')} {w('house')}{' '}
          <em>{w('feel')} {w('like')} {w('home.')}</em>
        </h1>
        <p>Warm, honest pieces in solid wood and natural fabrics—designed to be lived in, passed down and loved for decades.</p>
        <div className="cta"><Link className="btn" to="/shop">Shop collection</Link><Link className="btn ghost" to="/contact">Book a design visit</Link></div>
        <div className="stats">
          <Stat end={12} post="k+" label="Happy homes" /><Stat end={4.9} decimals={1} post="★" label="Average rating" /><Stat end={10} post=" yr" label="Warranty" />
        </div>
      </Reveal>
      <Reveal className="art" >
        <div ref={art} onMouseMove={tilt} onMouseLeave={() => (art.current.style.transform = '')} style={{ position: 'relative', height: '100%', transition: 'transform .2s ease-out' }}>
          <Img k="liv" alt="Modern living room with grey sofa and wooden tables" pos="center 62%" />
          <div className="badge"><b>Free assembly</b>On every order</div>
        </div>
      </Reveal>
    </div></section>
  );
}

export function Trust() {
  return (
    <div className="trust"><div className="wrap">
      {trust.map(([b, s], i) => (
        <Reveal key={b} delay={i * 80}><i>✓</i><span><b>{b}</b>{s}</span></Reveal>
      ))}
    </div></div>
  );
}

export function Categories() {
  return (
    <section id="shop"><div className="wrap">
      <Reveal className="eyebrow">Shop by room</Reveal><Reveal as="h2">Find your corner of calm</Reveal>
      <div className="cats">
        {categories.map((c, i) => (
          <Reveal as={Link} key={c.slug} to={`/shop/${c.slug}`} className="cat" delay={i * 80}>
            <div className="thumb"><Img k={c.img} alt={c.label} pos={c.pos} /></div>
            <div><h3>{c.label}</h3><small>{c.blurb}</small></div>
            <span className="go">Explore →</span>
            <b className="from">From {fmt(c.from)}</b>
          </Reveal>
        ))}
      </div>
    </div></section>
  );
}

export function Gallery() {
  return (
    <section style={{ background: 'var(--surface)' }}><div className="wrap">
      <Reveal className="eyebrow">Inspiration</Reveal><Reveal as="h2">Rooms we love</Reveal>
      <div className="gal">
        {gallery.map((g, i) => (
          <Reveal key={g.title} className="shot" delay={i * 80}><Img k={g.img} alt={g.title} pos={g.pos} /><span>{g.title}</span></Reveal>
        ))}
      </div>
    </div></section>
  );
}
