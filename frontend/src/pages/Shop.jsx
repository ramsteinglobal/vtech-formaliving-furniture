import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import ProductCard from '../components/ProductCard';
import { Categories, Gallery } from '../components/Sections';
import { useCatalogue } from '../store';
import { useTitle } from '../hooks/useTitle';

export default function Shop() {
  const { products } = useCatalogue();
  useTitle('Shop', 'Browse sofas, beds, dining and office furniture in solid wood and natural fabrics.');
  const best = products.filter((p) => p.bestSeller);
  return (
    <>
      <PageHead page="shop" />
      <Categories />
      <section><div className="wrap">
        <div className="eyebrow">All furniture</div><h2>Best-selling pieces</h2>
        <div className="pg">{best.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        <p style={{ marginTop: 36 }}><Link className="btn ghost" to="/shop/all">View all {products.length} products →</Link></p>
      </div></section>
      <Gallery />
    </>
  );
}
