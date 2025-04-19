import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport';
import { PersonServiceClient } from './generated/person.client';

// Get the API URL from environment variables
const apiUrl = 'http://localhost:8080';

// Create a gRPC-web transport
const transport = new GrpcWebFetchTransport({
  baseUrl: apiUrl,
});

// Create the gRPC client for the PersonService
export const personClient = new PersonServiceClient(transport);