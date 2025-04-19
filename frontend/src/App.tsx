import { useState, useEffect } from 'react';
import './App.css';
import PersonList from './components/PersonList';
import PersonForm from './components/PersonForm';
import { Person } from './generated/person';
import { personClient } from './proxy';

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const fetchPeople = async () => {
    try {
      const response = await personClient.listPeople({ pageSize: 100, pageToken: 1 });
      console.log('Fetched people:', response);
      setPeople(response.response.people);
    } catch (err) {
      console.error('Error fetching people:', err);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  const handleAddPerson = async (person: Person) => {
    try {
      await personClient.createPerson({ person });
      fetchPeople();
      setSelectedPerson(null);
    } catch (err) {
      console.error('Error adding person:', err);
    }
  };

  const handleUpdatePerson = async (person: Person) => {
    try {
      await personClient.updatePerson({ person });
      fetchPeople();
      setSelectedPerson(null);
    } catch (err) {
      console.error('Error updating person:', err);
    }
  };

  const handleDeletePerson = async (id: string) => {
    try {
      await personClient.deletePerson({ id });
      fetchPeople();
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
