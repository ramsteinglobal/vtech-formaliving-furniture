import { Navigate, NavLink, useParams } from 'react-router-dom';
import PageHead from '../components/PageHead';
import ProductCard from '../components/ProductCard';
import { categories, pageMeta } from '../data/site';
import { getProducts } from '../api';
import { products } from '../data/products';
import { useApi } from '../hooks/useApi';

export default function Category() {
  const { slug } = useParams();
  const all = useApi(getProducts, products);
  if (!pageMeta[slug] || !categories.some((c) => c.slug === slug)) return <Navigate to="/shop" replace />;
  const items = all.filter((p) => p.category === slug);
  return (
    <>
      <PageHead page={slug} />
      <section><div className="wrap">
        <div className="tabs">
          <NavLink to="/shop" end>All</NavLink>
          {categories.map((c) => <NavLink key={c.slug} to={`/shop/${c.slug}`} className={({ isActive }) => (isActive ? 'on' : '')}>{c.label}</NavLink>)}
        </div>
        <div className="pg">{items.map((p) => <ProductCard key={p.id ?? p.name} p={p} />)}</div>
      </div></section>
    </>
  );
}
