// Resolves a short key ("liv", "i7"…) to its bundled image URL.
const files = import.meta.glob('../assets/img/*.jpg', { eager: true, import: 'default' });
const map = Object.fromEntries(
  Object.entries(files).map(([p, url]) => [p.split('/').pop().replace('.jpg', ''), url])
);
export const imageUrl = (key) => map[key];
