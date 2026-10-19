import { useEffect, useState } from 'react';

// Shows `initial` immediately, swaps in the API result when it arrives.
export function useApi(loader, initial) {
  const [data, setData] = useState(initial);
  useEffect(() => {
    let live = true;
    loader().then((d) => live && setData(d));
    return () => { live = false; };
  }, [loader]);
  return data;
}
