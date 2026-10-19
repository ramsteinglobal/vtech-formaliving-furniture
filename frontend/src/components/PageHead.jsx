import { Link } from 'react-router-dom';
import { pageMeta } from '../data/site';

export default function PageHead({ page }) {
  const [crumb, title, text] = pageMeta[page];
  return (
    <div className="phead"><div className="wrap">
      <div className="crumb"><Link to="/">Home</Link> / {crumb}</div>
      <h1>{title}</h1><p>{text}</p>
    </div></div>
  );
}
