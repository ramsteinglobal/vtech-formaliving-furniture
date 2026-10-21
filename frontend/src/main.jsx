import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider, CatalogueProvider } from './store';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><CatalogueProvider><CartProvider><App /></CartProvider></CatalogueProvider></BrowserRouter></React.StrictMode>
);
