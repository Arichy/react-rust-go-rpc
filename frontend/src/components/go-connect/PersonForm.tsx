import { useState, useEffect } from 'react';
import { Person, PersonBrief, PersonBriefSchema, PersonSchema } from '@src/gen/person_pb';
import { create } from '@bufbuild/protobuf';
import { personClient } from './connect';
import PersonModal from './PersonModal';

interface PersonFormProps {
  selectedPerson: Person | null;
  onAddPerson: (person: PersonBrief) => void;
  onUpdatePerson: (person: Person) => void;
  onCancel: () => void;
}

function PersonForm({ selectedPerson, onAddPerson, onUpdatePerson, onCancel }: PersonFormProps) {
  const [person, setPerson] = useState<Person>(
    create(PersonSchema, {
      id: '',
      name: '',
      email: '',
      age: 0,
    })
  );
  const [showModal, setShowModal] = useState(false);
  const [personDetails, setPersonDetails] = useState<Person | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPerson) {
      setPerson({ ...selectedPerson });
    } else {
      setPerson(
        create(PersonSchema, {
          id: '',
          name: '',
          email: '',
          age: 0,
        })
      );
    }
  }, [selectedPerson]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPerson({
      ...person,
      [name]: name === 'age' ? parseInt(value, 10) || 0 : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPerson) {
      onUpdatePerson(person);
    } else {
      onAddPerson(
        create(PersonBriefSchema, {
          id: person.id,
          name: person.name,
          email: person.email,
          age: person.age,
        })
      );
    }
    setPerson(
      create(PersonSchema, {
        id: '',
        name: '',
        email: '',
        age: 0,
      })
    );
  };

  const fetchPersonDetails = async (id: string) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await personClient.getPerson({ id });
      if (response.person) {
        setPersonDetails(response.person);
        setShowModal(true);
      } else {
        setError('Person details not found');
      }
    } catch (err) {
      console.error('Error fetching person details:', err);
      setError('Failed to load person details');
    } finally {
      setLoading(false);
    }
  };

  const handleIdClick = () => {
    if (person.id) {
      fetchPersonDetails(person.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPersonDetails(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary pb-3 mb-4 border-b border-border">
        {selectedPerson ? 'Edit Person' : 'Add New Person'}
      </h2>
      <form onSubmit={handleSubmit}>
        {selectedPerson && (
          <div className="mb-4">
            <label className="block mb-1 font-medium text-text" htmlFor="id">
              ID
            </label>
            <div className="flex items-center">
              <input
                className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-400 bg-gray-50"
                type="text"
                id="id"
                name="id"
                value={person.id}
                readOnly
              />
              <button
                type="button"
                className="ml-2 text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm flex items-center"
                onClick={handleIdClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                View Details
              </button>
            </div>
          </div>
        )}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-text" htmlFor="name">
            Name
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-400"
            type="text"
            id="name"
            name="name"
            value={person.name}
            onChange={handleChange}
            required
            placeholder="Enter name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-text" htmlFor="email">
            Email
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-400"
            type="email"
            id="email"
            name="email"
            value={person.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-text" htmlFor="age">
            Age
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors hover:border-gray-400"
            type="number"
            id="age"
            name="age"
            value={person.age}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button
            type="button"
            className="bg-secondary hover:bg-secondary-hover text-black font-medium px-4 py-2 rounded-lg shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-black font-medium px-4 py-2 rounded-lg shadow-sm transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            {selectedPerson ? 'Update' : 'Add'}
          </button>
        </div>
      </form>

      <PersonModal
        isOpen={showModal}
        onClose={closeModal}
        personDetails={personDetails}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default PersonForm;
