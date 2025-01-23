import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import { setupStore } from './store';
import { Provider } from 'react-redux';
import process from 'process';

window.process = process;

const root = ReactDOM.createRoot(
  document.getElementById('app') as HTMLElement
);

const store = setupStore();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);


