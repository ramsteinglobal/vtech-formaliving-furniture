import PageHead from '../components/PageHead';
import Reveal from '../components/Reveal';
import { reviews } from '../data/site';

export default function Reviews() {
  return (
    <>
      <PageHead page="reviews" />
      <section id="reviews"><div className="wrap">
        <Reveal className="eyebrow">Loved by customers</Reveal><Reveal as="h2">Homes we’ve helped finish</Reveal>
        <div className="tg">
          {reviews.map((r, i) => (
            <Reveal key={r.name} className="t" delay={i * 80}>
              <div className="av">{r.name.split(' ').map((x) => x[0]).join('')}</div>
              <div className="stars" aria-label={`${r.stars} out of 5`}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
              <p>{r.text}</p><b>{r.name}</b><span>{r.city}</span>
            </Reveal>
          ))}
        </div>
      </div></section>
    </>
  );
}
