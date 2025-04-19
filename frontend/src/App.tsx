import { useState } from 'react';
import './App.css';
import PersonList from './components/PersonList';
import PersonForm from './components/PersonForm';
import { Person, PersonService } from './gen/person_pb';
import { personClient } from './proxy';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@connectrpc/connect-query';

function App() {
  // const { data: peopleData } = useQuery({
  //   queryKey: ['people'],
  //   queryFn: async () => {
  //     const response = await personClient.listPeople({ pageSize: 100, pageToken: 1 });
  //     return response.people;
  //   },
  // });

  const { data } = useQuery(PersonService.method.listPeople, { pageSize: 100, pageToken: 1 });
  const people = data?.people || [];

  const queryClient = useQueryClient();

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleAddPerson = async (person: Person) => {
    try {
      await personClient.createPerson({ person });
      queryClient.invalidateQueries({ queryKey: ['people'] });
      setSelectedPerson(null);
    } catch (err) {
      console.error('Error adding person:', err);
    }
  };

  const handleUpdatePerson = async (person: Person) => {
    try {
      await personClient.updatePerson({ person });
      queryClient.invalidateQueries({ queryKey: ['people'] });

      setSelectedPerson(null);
    } catch (err) {
      console.error('Error updating person:', err);
    }
  };

  const handleDeletePerson = async (id: string) => {
    try {
      await personClient.deletePerson({ id });
      queryClient.invalidateQueries({ queryKey: ['people'] });

      if (selectedPerson?.id === id) {
        setSelectedPerson(null);
      }
    } catch (err) {
      console.error('Error deleting person:', err);
    }
  };

  return (
    <div className="container">
      <h1>Person CRUD with gRPC</h1>
      <div className="app-container-vertical">
        <div className="person-form">
          <PersonForm
            selectedPerson={selectedPerson}
            onAddPerson={handleAddPerson}
            onUpdatePerson={handleUpdatePerson}
            onCancel={() => setSelectedPerson(null)}
          />
        </div>
        <div className="person-list">
          <PersonList people={people} onSelectPerson={setSelectedPerson} onDeletePerson={handleDeletePerson} />
        </div>
      </div>
    </div>
  );
}

export default App;
