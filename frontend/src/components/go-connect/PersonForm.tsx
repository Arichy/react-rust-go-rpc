import { useState, useEffect } from 'react';
import { Person, PersonSchema } from '@src/gen/person_pb';
import { create } from '@bufbuild/protobuf';

interface PersonFormProps {
  selectedPerson: Person | null;
  onAddPerson: (person: Person) => void;
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
      onAddPerson(person);
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

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary pb-3 mb-4 border-b border-border">
        {selectedPerson ? 'Edit Person' : 'Add New Person'}
      </h2>
      <form onSubmit={handleSubmit}>
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
    </div>
  );
}

export default PersonForm;
