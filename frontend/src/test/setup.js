import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

globalThis.IntersectionObserver = class { observe() {} disconnect() {} unobserve() {} };
window.matchMedia = window.matchMedia || ((q) => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
window.scrollTo = () => {};
afterEach(() => { cleanup(); localStorage.clear(); });
