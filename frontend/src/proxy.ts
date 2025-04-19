import { createClient, Interceptor, Transport } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';
import { devtoolsInterceptor } from 'connect-devtools';

import { PersonService } from './gen/person_pb';

const apiUrl = 'http://localhost:8080';

const interceptors: Interceptor[] = [
  // whatever other interceptors you want
];

// Only install the devtools interceptor if the gRPC-Web Devtools extension is available
if ('window' in globalThis && '__CONNECT_WEB_DEVTOOLS__' in globalThis.window) {
  interceptors.push(devtoolsInterceptor);
}

// // Now we can use the interceptors in our transport
export const transport: Transport = createGrpcWebTransport({
  baseUrl: apiUrl,
  interceptors,
});

export const personClient = createClient(PersonService, transport);
