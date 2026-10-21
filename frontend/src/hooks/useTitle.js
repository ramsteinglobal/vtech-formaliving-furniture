import { useEffect } from 'react';

export function useTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · Forma Living` : 'Forma Living — Furniture for slower, warmer homes';
    if (description) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = description;
    }
  }, [title, description]);
}
