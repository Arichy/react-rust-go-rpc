import { createClient, Transport } from '@connectrpc/connect';
import { createGrpcWebTransport } from '@connectrpc/connect-web';

import { PersonService } from '@src/gen/person_pb';

const apiUrl = 'http://localhost:8080';

export const transport: Transport = createGrpcWebTransport({
  baseUrl: apiUrl,
});

export const personClient = createClient(PersonService, transport);
