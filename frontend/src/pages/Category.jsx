import { NavLink, useParams } from 'react-router-dom';
import PageHead from '../components/PageHead';
import ProductGrid from '../components/ProductGrid';
import NotFound from './NotFound';
import { categories, pageMeta } from '../data/site';
import { useCatalogue } from '../store';
import { useTitle } from '../hooks/useTitle';

export default function Category() {
  const { slug } = useParams();
  const { products } = useCatalogue();
  const valid = slug === 'all' || categories.some((c) => c.slug === slug);
  useTitle(valid ? pageMeta[slug][1] : 'Page not found', valid ? pageMeta[slug][2] : undefined);
  if (!valid) return <NotFound />;
  const items = slug === 'all' ? products : products.filter((p) => p.category === slug);
  return (
    <>
      <PageHead page={slug} />
      <section><div className="wrap">
        <div className="tabs">
          <NavLink to="/shop/all" className={({ isActive }) => (isActive ? 'on' : '')}>All</NavLink>
          {categories.map((c) => <NavLink key={c.slug} to={`/shop/${c.slug}`} className={({ isActive }) => (isActive ? 'on' : '')}>{c.label}</NavLink>)}
        </div>
        <ProductGrid key={slug} items={items} />
      </div></section>
    </>
  );
}
