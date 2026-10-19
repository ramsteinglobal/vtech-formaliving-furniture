import { imageUrl } from '../data/images';

export default function Img({ k, alt, pos = 'center' }) {
  return <img className="ph" src={imageUrl(k)} alt={alt} loading="lazy" style={{ objectPosition: pos }} />;
}
