import PageHead from '../components/PageHead';
import ProductCard from '../components/ProductCard';
import { Categories, Gallery } from '../components/Sections';
import { getBestSellers } from '../api';
import { bestSellers } from '../data/products';
import { useApi } from '../hooks/useApi';

export default function Shop() {
  const items = useApi(getBestSellers, bestSellers);
  return (
    <>
      <PageHead page="shop" />
      <Categories />
      <section><div className="wrap">
        <div className="eyebrow">All furniture</div><h2>Best-selling pieces</h2>
        <div className="pg">{items.map((p) => <ProductCard key={p.name} p={p} />)}</div>
      </div></section>
      <Gallery />
    </>
  );
}
