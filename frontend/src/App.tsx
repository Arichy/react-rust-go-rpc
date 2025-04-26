import '@mantine/core/styles.css';
import './App.css';

import { TransportProvider } from '@connectrpc/connect-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { transport as rustGrpcTransport } from './services/rust-grpc/grpc';
import { transport as goConnectTransport } from './services/go-connect/connect';
import PersonCRUD from './components/shared/PersonCRUD';
import { RustPersonService } from './services/RustPersonService';
import { GoPersonService } from './services/GoPersonService';
import { MantineProvider } from '@mantine/core';

const rustPersonService = new RustPersonService();
const goPersonService = new GoPersonService();

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto overflow-hidden">
          <h1 className="text-4xl font-bold text-center my-8 px-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            gRPC Client Comparison
          </h1>
          <div className="flex flex-col xl:flex-row gap-8 px-4 w-full">
            <div className="w-full xl:w-1/2">
              <TransportProvider transport={rustGrpcTransport}>
                <PersonCRUD title="Person CRUD with Rust gRPC" personService={rustPersonService} serviceName="rust" />
              </TransportProvider>
            </div>
            <div className="w-full xl:w-1/2">
              <TransportProvider transport={goConnectTransport}>
                <PersonCRUD title="Person CRUD with Go Connect" personService={goPersonService} serviceName="go" />
              </TransportProvider>
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
