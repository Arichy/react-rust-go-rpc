import './App.css';

import RustGRPC from './components/rust-grpc/RustGrpc';
import GoConnect from './components/go-connect/GoConnect';
import { TransportProvider } from '@connectrpc/connect-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { transport as rustGrpcTransport } from './components/rust-grpc/grpc';
import { transport as goConnectTransport } from './components/go-connect/connect';

const rustGrpcClient = new QueryClient();

const goConnectClient = new QueryClient();

function App() {
  return (
    <div className="container mx-auto overflow-hidden">
      <h1 className="text-4xl font-bold text-center my-8 px-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        gRPC Client Comparison
      </h1>
      <div className="flex flex-col xl:flex-row gap-8 px-4 w-full">
        <div className="w-full xl:w-1/2">
          <TransportProvider transport={rustGrpcTransport}>
            <QueryClientProvider client={rustGrpcClient}>
              <RustGRPC />
            </QueryClientProvider>
          </TransportProvider>
        </div>
        <div className="w-full xl:w-1/2">
          <TransportProvider transport={goConnectTransport}>
            <QueryClientProvider client={goConnectClient}>
              <GoConnect />
            </QueryClientProvider>
          </TransportProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
