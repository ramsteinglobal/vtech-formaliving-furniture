import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import Img from '../components/Img';
import { useCart } from '../store';
import { createOrder, errorText } from '../api';
import { rememberOrder } from '../orders';
import { fmt } from '../data/site';
import { useTitle } from '../hooks/useTitle';

const blank = { name: '', phone: '', email: '', address: '', city: '', pincode: '' };

export default function Cart() {
  const { items, setQty, remove, clear, total, MAX_QTY } = useCart();
  const [form, setForm] = useState(blank);
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const [done, setDone] = useState(null);
  useTitle('Your cart');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', text: 'Placing your order…' });
    try {
      const res = await createOrder({ ...form, items: items.map((i) => ({ productId: i.id, qty: i.qty })) });
      rememberOrder({ code: res.code, phone: form.phone });
      setDone({ code: res.code, total: res.total });
      clear(); setForm(blank); setStatus({ state: 'idle', text: '' });
    } catch (err) {
      setStatus({ state: 'error', text: errorText(err, 'We couldn’t place your order right now. Please try again, or call us to order by phone.') });
    }
  };

  if (done) {
    return (
      <section className="nf"><div className="wrap">
        <div className="eyebrow">Order received</div><h1>Thank you!</h1>
        <p>Your order <b>#{done.code}</b> for {fmt(done.total)} is in. Our team will call you to confirm delivery and payment. Keep your order number to track it.</p>
        <Link className="btn" to="/orders">Track my order</Link>{' '}<Link className="btn ghost" to="/shop/all">Keep shopping</Link>
      </div></section>
    );
  }

  return (
    <>
      <PageHead page="cart" />
      <section><div className="wrap">
        {items.length === 0 ? (
          <div className="empty"><p>Your cart is empty.</p><Link className="btn" to="/shop/all">Browse furniture</Link></div>
        ) : (
          <div className="cartgrid">
            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: 18 }}>Your cart</h2>
              {items.map((i) => (
                <div className="crow" key={i.id}>
                  <Link className="cthumb" to={`/product/${i.id}`}><Img k={i.image} alt={i.name} pos={i.pos} /></Link>
                  <div className="cinfo">
                    <Link to={`/product/${i.id}`}><b>{i.name}</b></Link>
                    <span>{fmt(i.price)}</span>
                    <button className="link" type="button" onClick={() => remove(i.id)} aria-label={`Remove ${i.name}`}>Remove</button>
                  </div>
                  <div className="qty" role="group" aria-label={`Quantity of ${i.name}`}>
                    <button type="button" aria-label={`Decrease ${i.name}`} onClick={() => setQty(i.id, i.qty - 1)} disabled={i.qty <= 1}>−</button>
                    <output>{i.qty}</output>
                    <button type="button" aria-label={`Increase ${i.name}`} onClick={() => setQty(i.id, i.qty + 1)} disabled={i.qty >= MAX_QTY}>+</button>
                  </div>
                  <b className="ctotal">{fmt(i.price * i.qty)}</b>
                </div>
              ))}
              <div className="sum"><span>Subtotal</span><b>{fmt(total)}</b></div>
              <small style={{ color: 'var(--mute)' }}>Free delivery on orders above ₹25,000. For smaller orders our team confirms the delivery charge when they call. Payment is arranged on that call.</small>
            </div>
            <form className="checkout" onSubmit={submit}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: 18 }}>Delivery details</h2>
              <label>Name<input required autoComplete="name" value={form.name} onChange={set('name')} /></label>
              <div className="row">
                <label>Phone<input required type="tel" autoComplete="tel" placeholder="9XXXXXXXXX" value={form.phone} onChange={set('phone')} /></label>
                <label>Email<input required type="email" autoComplete="email" value={form.email} onChange={set('email')} /></label>
              </div>
              <label>Address<textarea required autoComplete="street-address" rows={3} value={form.address} onChange={set('address')} /></label>
              <div className="row">
                <label>City<input required autoComplete="address-level2" value={form.city} onChange={set('city')} /></label>
                <label>Pincode<input required inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.pincode} onChange={set('pincode')} /></label>
              </div>
              <button className="btn" type="submit" disabled={status.state === 'sending'}>Place order · {fmt(total)}</button>
              <div role="status" className={status.state === 'error' ? 'err-line' : 'ok-line'}>{status.text}</div>
            </form>
          </div>
        )}
      </div></section>
    </>
  );
}
