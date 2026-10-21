import { Link } from 'react-router-dom';
import { useTitle } from '../hooks/useTitle';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <section className="nf"><div className="wrap">
      <div className="eyebrow">404</div><h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist or has moved.</p>
      <Link className="btn" to="/shop">Browse the collection</Link>
    </div></section>
  );
}
