import { useState } from 'react';
import PersonList from './PersonList';
import PersonForm from './PersonForm';
import { Person, PersonBrief, PersonBriefSchema, PersonService } from '@src/gen/person_pb';
import { personClient } from './connect';
import { useQueryClient } from '@tanstack/react-query';
import { createConnectQueryKey, useQuery, useTransport } from '@connectrpc/connect-query';

function GoConnect() {
  const transport = useTransport();
  const peopleQueryKey = createConnectQueryKey({
    schema: PersonService.method.listPeople,
    transport,
    input: { pageSize: 100, pageToken: 1 },
    cardinality: 'finite',
  });
  const { data, error } = useQuery(PersonService.method.listPeople, { pageSize: 100, pageToken: 1 });
  const people = data?.people || [];

  const queryClient = useQueryClient();

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleAddPerson = async (person: PersonBrief) => {
    try {
      await personClient.createPerson({ person });
      queryClient.invalidateQueries({ queryKey: peopleQueryKey });
      setSelectedPerson(null);
    } catch (err) {
      console.error('Error adding person:', err);
    }
  };

  const handleUpdatePerson = async (person: Person) => {
    try {
      await personClient.updatePerson({ person });
      queryClient.invalidateQueries({ queryKey: peopleQueryKey });
      setSelectedPerson(null);
    } catch (err) {
      console.error('Error updating person:', err);
    }
  };

  const handleDeletePerson = async (id: string) => {
    try {
      await personClient.deletePerson({ id });
      queryClient.invalidateQueries({ queryKey: peopleQueryKey });
      if (selectedPerson?.id === id) {
        setSelectedPerson(null);
      }
    } catch (err) {
      console.error('Error deleting person:', err);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
        Person CRUD with Go Connect
      </h1>
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full">
        <div className="bg-card rounded-xl shadow-lg p-4 sm:p-6 transition-all hover:shadow-xl transform hover:-translate-y-1">
          <PersonForm
            selectedPerson={selectedPerson}
            onAddPerson={handleAddPerson}
            onUpdatePerson={handleUpdatePerson}
            onCancel={() => setSelectedPerson(null)}
          />
        </div>
        <div className="bg-card rounded-xl shadow-lg p-6 transition-all hover:shadow-xl transform hover:-translate-y-1">
          <PersonList people={people} onSelectPerson={setSelectedPerson} onDeletePerson={handleDeletePerson} />
        </div>
      </div>
    </div>
  );
}

export default GoConnect;
