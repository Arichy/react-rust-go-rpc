import { Person } from '../generated/person'

interface PersonListProps {
  people: Person[]
  onSelectPerson: (person: Person) => void
  onDeletePerson: (id: string) => void
}

function PersonList({ people, onSelectPerson, onDeletePerson }: PersonListProps) {
  return (
    <div>
      <h2>People</h2>
      {people.length === 0 ? (
        <p>No people found. Add a new person.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.id}>
                <td>{person.id}</td>
                <td>{person.name}</td>
                <td>{person.email}</td>
                <td>{person.age}</td>
                <td>
                  <div className="button-group">
                    <button onClick={() => onSelectPerson(person)}>Edit</button>
                    <button 
                      className="danger" 
                      onClick={() => onDeletePerson(person.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PersonList