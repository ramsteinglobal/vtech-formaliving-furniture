import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ticker, contact } from '../data/site';
import { useCart } from '../store';

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => setP(scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return <div className="bar" style={{ transform: `scaleX(${p})` }} />;
}

const links = [['/', 'Home'], ['/shop', 'Shop'], ['/featured', 'Featured'], ['/reviews', 'Reviews'], ['/contact', 'Contact'], ['/orders', 'My orders']];

export default function Layout() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <ScrollProgress />
      <div className="ticker"><div>{[...ticker, ...ticker].map((t, i) => <span key={i}>{t}</span>)}</div></div>
      <header className={`hd ${open ? 'open' : ''}`}>
        <nav>
          <Link className="logo" to="/">Forma<b>Living</b></Link>
          <ul>
            {links.map(([to, label]) => (
              <li key={to}><NavLink to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>{label}</NavLink></li>
            ))}
          </ul>
          <Link className="cartlink" to="/cart" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>Cart{count > 0 && <span className="cartbadge">{count}</span>}</Link>
          <Link className="btn ghost" to="/featured" style={{ padding: '11px 22px' }}>Order now</Link>
          <button className="menu" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
        </nav>
      </header>

      <main key={pathname} style={{ animation: 'pg .6s ease' }}><Outlet /></main>

      <footer>
        <div className="wrap">
          <div className="col" style={{ maxWidth: 300 }}>
            <span className="logo" style={{ fontSize: '1.8rem' }}>Forma<b>Living</b></span>
            <span style={{ opacity: 0.75 }}>Warm, honest furniture for slower, softer homes.</span>
          </div>
          <div className="col"><b>Shop</b>
            <Link to="/shop/all">All products</Link><Link to="/shop/living">Living Room</Link><Link to="/shop/bedroom">Bedroom</Link>
            <Link to="/shop/dining">Dining</Link><Link to="/shop/office">Office</Link>
          </div>
          <div className="col"><b>Contact</b>
            <a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`tel:+91${contact.phone}`}>{contact.phone}</a>
          </div>
        </div>
        <div className="copy">© 2026 Forma Living · Demo site designed &amp; built by V-Tech</div>
      </footer>
    </>
  );
}
