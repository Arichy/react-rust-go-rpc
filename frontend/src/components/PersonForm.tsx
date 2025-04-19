import { useState, useEffect } from 'react'
import { Person } from '../generated/person'

interface PersonFormProps {
  selectedPerson: Person | null
  onAddPerson: (person: Person) => void
  onUpdatePerson: (person: Person) => void
  onCancel: () => void
}

function PersonForm({ selectedPerson, onAddPerson, onUpdatePerson, onCancel }: PersonFormProps) {
  const [person, setPerson] = useState<Person>({
    id: '',
    name: '',
    email: '',
    age: 0
  })

  useEffect(() => {
    if (selectedPerson) {
      setPerson({ ...selectedPerson })
    } else {
      setPerson({ id: '', name: '', email: '', age: 0 })
    }
  }, [selectedPerson])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPerson({
      ...person,
      [name]: name === 'age' ? parseInt(value, 10) || 0 : value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPerson) {
      onUpdatePerson(person)
    } else {
      onAddPerson(person)
    }
    setPerson({ id: '', name: '', email: '', age: 0 })
  }

  return (
    <div>
      <h2>{selectedPerson ? 'Edit Person' : 'Add New Person'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={person.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={person.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={person.age}
            onChange={handleChange}
            required
            min={0}
          />
        </div>
        <div className="button-group">
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="primary">
            {selectedPerson ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm