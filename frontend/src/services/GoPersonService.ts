import { PersonService as PersonServiceType } from '../services/PersonService';
import {
  CreatePersonRequest,
  CreatePersonResponse,
  DeletePersonRequest,
  DeletePersonResponse,
  GetPersonRequest,
  GetPersonResponse,
  ListPeopleRequest,
  ListPeopleResponse,
  UpdatePersonRequest,
  UpdatePersonResponse,
} from '@src/gen/person_pb';
import { personClient } from '../components/go-connect/connect';

export class GoPersonService implements PersonServiceType {
  async listPeople(params: ListPeopleRequest): Promise<ListPeopleResponse> {
    const response = await personClient.listPeople(params);
    return response;
  }

  async getPerson(params: GetPersonRequest): Promise<GetPersonResponse> {
    const response = await personClient.getPerson(params);
    return response;
  }
  async createPerson(params: CreatePersonRequest): Promise<CreatePersonResponse> {
    const response = await personClient.createPerson(params);
    return response;
  }

  async updatePerson(params: UpdatePersonRequest): Promise<UpdatePersonResponse> {
    const response = await personClient.updatePerson(params);
    return response;
  }

  async deletePerson(params: DeletePersonRequest): Promise<DeletePersonResponse> {
    const response = await personClient.deletePerson(params);
    return response;
  }
}
