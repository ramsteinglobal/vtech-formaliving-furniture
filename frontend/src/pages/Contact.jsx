import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import { categories, contact } from '../data/site';
import { sendEnquiry } from '../api';

const interests = [...categories.map((c) => c.label), 'Kalpa 3-Seater Sofa'];

export default function Contact() {
  const [params] = useSearchParams();
  const product = params.get('product');
  const blank = { name: '', phone: '', email: '', interest: interests[0], message: product ? `I’d like to order: ${product}.` : '' };
  const [form, setForm] = useState(blank);
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', text: 'Sending…' });
    try {
      await sendEnquiry(form);
      setForm(blank);
      setStatus({ state: 'ok', text: 'Thank you! We’ll be in touch shortly.' });
    } catch (err) {
      const fix = err.details?.map((d) => d.message).join(' ');
      const text = err.status === 400 && fix ? fix
        : err.status === 429 ? 'Too many enquiries from this device. Please try again in a few minutes.'
        : `We couldn’t send your enquiry. Email us at ${contact.email} instead.`;
      setStatus({ state: 'error', text });
    }
  };

  return (
    <>
      <PageHead page="contact" />
      <section className="contact" style={{ background: 'var(--alt)' }}><div className="wrap">
        <Reveal>
          <div className="eyebrow">Get in touch</div><h2 style={{ marginBottom: 18 }}>Let’s furnish your space</h2>
          <p>Tell us what you’re dreaming of and our team will reply within one working day.</p>
          <ul>
            <li>✉ <a href={`mailto:${contact.email}`}>{contact.email}</a></li>
            <li>☎ <a href={`tel:+91${contact.phone}`}>{contact.phone}</a></li>
            <li>⌚ {contact.hours}</li>
          </ul>
        </Reveal>
        <Reveal as="form" onSubmit={submit}>
          <div className="row">
            <label>Name<input required placeholder="Your name" value={form.name} onChange={set('name')} /></label>
            <label>Phone<input type="tel" placeholder="9XXXXXXXXX" value={form.phone} onChange={set('phone')} /></label>
          </div>
          <label>Email<input type="email" required placeholder="you@example.com" value={form.email} onChange={set('email')} /></label>
          <label>Interested in
            <select value={form.interest} onChange={set('interest')}>{interests.map((o) => <option key={o}>{o}</option>)}</select>
          </label>
          <label>Message<textarea placeholder="Room size, style, budget…" value={form.message} onChange={set('message')} /></label>
          <button className="btn" type="submit" disabled={status.state === 'sending'}>Send enquiry</button>
          <div id="ok" role="status" style={status.state === 'error' ? { color: '#c0392b' } : undefined}>{status.text}</div>
        </Reveal>
      </div></section>
    </>
  );
}
