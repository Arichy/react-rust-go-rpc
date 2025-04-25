import { Person, PersonBrief } from '../../gen/person_pb';

interface PersonListProps {
  people: PersonBrief[];
  onSelectPerson: (person: Person) => void;
  onDeletePerson: (id: string) => void;
}

function PersonList({ people, onSelectPerson, onDeletePerson }: PersonListProps) {
  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-xl font-semibold text-primary pb-3 mb-4 border-b border-border">People</h2>
      {people.length === 0 ? (
        <p className="text-text-muted py-4 text-center italic">No people found. Add a new person.</p>
      ) : (
        <div className="rounded-lg shadow-md overflow-hidden">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-1 py-2 text-left text-xs  tracking-wider font-medium w-[10%] hidden lg:table-cell text-black">
                  ID
                </th>
                <th className="px-1 sm:px-2 py-2 text-left text-xs  tracking-wider font-medium w-[25%] max-w-[120px] truncate text-black">
                  Name
                </th>
                <th className="px-1 sm:px-2 py-2 text-left text-xs  tracking-wider font-medium w-[30%] hidden md:table-cell truncate text-black">
                  Email
                </th>
                <th className="px-1 sm:px-2 py-2 text-left text-xs  tracking-wider font-medium w-[10%] text-black">
                  Age
                </th>
                <th className="px-1 sm:px-2 py-2 text-left text-xs  tracking-wider font-medium w-[35%] text-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {people.map(person => {
                return (
                  <tr
                    key={person.id}
                    className="border-b border-border hover:bg-primary/5 transition-colors last:border-b-0 even:bg-gray-50"
                  >
                    <td className="px-1 py-2 text-left hidden lg:table-cell text-xs">{person.id}</td>
                    <td className="px-1 sm:px-2 py-2 text-left text-xs max-w-[120px] truncate">{person.name}</td>
                    <td className="px-1 sm:px-2 py-2 text-left hidden md:table-cell text-xs truncate">
                      {person.email}
                    </td>
                    <td className="px-1 sm:px-2 py-2 text-left text-xs">{person.age}</td>
                    <td className="px-1 sm:px-2 py-2 text-left">
                      <div className="flex flex-nowrap gap-1 justify-start">
                        <button
                          className="bg-secondary hover:bg-secondary-hover text-black text-xs font-medium px-2 py-1 rounded shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
                          onClick={() => onSelectPerson(person)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-danger hover:bg-danger-hover text-black text-xs font-medium px-2 py-1 rounded shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer whitespace-nowrap"
                          onClick={() => onDeletePerson(person.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PersonList;
