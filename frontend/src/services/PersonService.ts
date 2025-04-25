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

export interface PersonService {
  listPeople(params: ListPeopleRequest): Promise<ListPeopleResponse>;
  getPerson(params: GetPersonRequest): Promise<GetPersonResponse>;
  createPerson(params: CreatePersonRequest): Promise<CreatePersonResponse>;
  updatePerson(params: UpdatePersonRequest): Promise<UpdatePersonResponse>;
  deletePerson(params: DeletePersonRequest): Promise<DeletePersonResponse>;
}
