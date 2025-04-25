import { Button, Table, Text, Modal, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PersonBrief } from '@src/gen/person_pb';
import { useState } from 'react';

interface PersonListProps {
  people: PersonBrief[];
  onEdit: (person: PersonBrief) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

function PersonList({ people, onEdit, onDelete, onViewDetails }: PersonListProps) {
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [personToDelete, setPersonToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPersonToDelete(id);
    openDeleteModal();
  };

  const handleConfirmDelete = () => {
    if (personToDelete) {
      onDelete(personToDelete);
      closeDeleteModal();
      setPersonToDelete(null);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-primary pb-3 mb-4 border-b border-border">People</h2>
      {people.length === 0 ? (
        <Text fs="italic">No people found. Add a new person.</Text>
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Age</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {people.map(person => (
              <Table.Tr key={person.id}>
                <Table.Td>{person.name}</Table.Td>
                <Table.Td>{person.email}</Table.Td>
                <Table.Td>{person.age}</Table.Td>
                <Table.Td className="flex gap-2">
                  <Button size="xs" onClick={() => onViewDetails(person.id)}>
                    View Details
                  </Button>
                  <Button size="xs" onClick={() => onEdit(person)}>
                    Edit
                  </Button>
                  <Button size="xs" color="red" onClick={() => handleDeleteClick(person.id)}>
                    Delete
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={deleteModalOpen} onClose={closeDeleteModal} title="Confirm Deletion">
        <Text mb="md">Are you sure you want to delete this person? This action cannot be undone.</Text>
        <Group justify="flex-end">
          <Button variant="outline" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button color="red" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
}

export default PersonList;
