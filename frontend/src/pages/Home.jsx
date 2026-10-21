import { Hero, Trust, Categories, Gallery } from '../components/Sections';

import { useTitle } from '../hooks/useTitle';

export default function Home() {
  useTitle('', 'Warm, honest furniture in solid wood and natural fabrics, designed to be lived in and loved for decades.');
  return <><Hero /><Trust /><Categories /><Gallery /></>;
}
