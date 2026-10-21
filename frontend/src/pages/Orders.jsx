import { useEffect, useState } from 'react';
import PageHead from '../components/PageHead';
import { trackOrder, errorText } from '../api';
import { rememberOrder, savedOrders } from '../orders';
import { fmt } from '../data/site';
import { useTitle } from '../hooks/useTitle';

const STEPS = [['new', 'Received'], ['confirmed', 'Confirmed'], ['shipped', 'Shipped'], ['delivered', 'Delivered']];

function OrderCard({ o }) {
  const at = STEPS.findIndex(([k]) => k === o.status);
  return (
    <article className="ocard">
      <header>
        <div><small>Order number</small><b>#{o.code}</b></div>
        <div><small>Placed</small><b>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</b></div>
        <div><small>Total</small><b>{fmt(o.total)}</b></div>
      </header>
      {o.status === 'cancelled'
        ? <p className="err-line">This order was cancelled.</p>
        : <ol className="steps" aria-label={`Status: ${STEPS[at]?.[1]}`}>
            {STEPS.map(([k, label], i) => <li key={k} className={i <= at ? 'done' : ''} aria-current={i === at ? 'step' : undefined}>{label}</li>)}
          </ol>}
      <ul>{o.items.map((i) => <li key={i.name}>{i.qty} × {i.name} <span>{fmt(i.price * i.qty)}</span></li>)}</ul>
    </article>
  );
}

export default function Orders() {
  useTitle('Track your order');
  const [mine, setMine] = useState([]);
  const [loading, setLoading] = useState(() => savedOrders().length > 0);
  const [form, setForm] = useState({ code: '', phone: '' });
  const [found, setFound] = useState(null);
  const [status, setStatus] = useState({ state: 'idle', text: '' });

  useEffect(() => {
    const saved = savedOrders();
    if (!saved.length) return;
    let live = true;
    Promise.allSettled(saved.map((s) => trackOrder(s))).then((rs) => {
      if (!live) return;
      setMine(rs.filter((r) => r.status === 'fulfilled').map((r) => r.value));
      setLoading(false);
    });
    return () => { live = false; };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', text: 'Looking up your order…' });
    try {
      const o = await trackOrder(form);
      rememberOrder({ code: o.code, phone: form.phone });
      setFound(o); setStatus({ state: 'idle', text: '' });
    } catch (err) {
      setFound(null);
      setStatus({ state: 'error', text: errorText(err, 'We couldn’t reach the server. Please try again in a moment.') });
    }
  };

  const others = found && !mine.some((m) => m.code === found.code) ? [found] : [];
  const list = [...others, ...mine];

  return (
    <>
      <PageHead page="orders" />
      <section><div className="wrap otrack">
        <form className="checkout" onSubmit={submit}>
          <h2 style={{ fontSize: '1.6rem' }}>Find an order</h2>
          <label>Order number<input required placeholder="e.g. 3F9A12BC" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></label>
          <label>Phone number<input required type="tel" placeholder="Phone used for the order" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <button className="btn" type="submit" disabled={status.state === 'sending'}>Track order</button>
          <div role="status" className={status.state === 'error' ? 'err-line' : 'ok-line'}>{status.text}</div>
        </form>
        <div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: 18 }}>Your orders</h2>
          {loading && <p className="empty">Loading your orders…</p>}
          {!loading && list.length === 0 && <p className="empty">Orders you place on this device appear here. You can also find any order with its number and phone.</p>}
          {list.map((o) => <OrderCard key={o.code} o={o} />)}
        </div>
      </div></section>
    </>
  );
}
