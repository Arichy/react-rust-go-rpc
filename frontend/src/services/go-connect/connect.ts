import { createClient, Transport } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';

import { PersonService } from '@src/gen/person_pb';

const apiUrl = 'http://localhost:8081';

export const transport: Transport = createConnectTransport({
  baseUrl: apiUrl,
  // useBinaryFormat: true, // if set to true, the client will use binary format
});

export const personClient = createClient(PersonService, transport);
