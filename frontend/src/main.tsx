import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TransportProvider } from '@connectrpc/connect-query';
import { transport } from './grpc.ts';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TransportProvider>
  </React.StrictMode>
);
