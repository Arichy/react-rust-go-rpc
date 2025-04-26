import {
  CreatePersonRequestSchema,
  GetPersonRequestSchema,
  Person,
  PersonBrief,
  UpdatePersonRequestSchema,
} from '@src/gen/person_pb';
import { CreatePersonForm, UpdatePersonForm } from './PersonForm';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PersonService } from '@src/services/PersonService';
import { create } from '@bufbuild/protobuf';
import { Center, Loader, Modal, Table } from '@mantine/core';
import { TimestampToDate } from '@src/utils';
import { notifications } from '@mantine/notifications';

interface PersonModalProps {
  id: string | null;
  personService: PersonService;
  opened: boolean;
  onClose: () => void;
  mode: 'view' | 'edit' | 'create';
}

function PersonModal({ id, opened, onClose, mode, personService }: PersonModalProps) {
  const title = mode === 'view' ? 'Person Details' : mode === 'edit' ? 'Edit Person' : 'Create Person';

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['people', id],
    queryFn: async () => {
      const response = await personService.getPerson(create(GetPersonRequestSchema, { id: id! }));
      return response;
    },
    enabled: mode !== 'create' && !!id,
  });

  const createPersonMutation = useMutation({
    mutationFn: async (newPerson: PersonBrief) => {
      const response = await personService.createPerson(
        create(CreatePersonRequestSchema, {
          name: newPerson.name,
          email: newPerson.email,
          age: newPerson.age,
        })
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['people'],
      });
    },
    onError: error => {
      notifications.show({
        title: 'Create Person Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  const updatePersonMutation = useMutation({
    mutationFn: async (updatedPerson: Person) => {
      const response = await personService.updatePerson(
        create(UpdatePersonRequestSchema, {
          id: updatedPerson.id,
          name: updatedPerson.name,
          email: updatedPerson.email,
          age: updatedPerson.age,
          address: updatedPerson.address,
        })
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['people'],
      });
    },
    onError: error => {
      notifications.show({
        title: 'Update Person Error',
        message: error.message,
        color: 'red',
      });
    },
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <Center>
          <Loader type="bars" />
        </Center>
      );
    }

    if (isError) {
      return <div>Error loading person: {error.message}</div>;
    }

    if (mode === 'view') {
      return (
        <Table withTableBorder={false} withRowBorders={false} withColumnBorders={false}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Td>{data?.person?.name}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Email</Table.Th>
              <Table.Td>{data?.person?.email}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Age</Table.Th>
              <Table.Td>{data?.person?.age}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Address</Table.Th>
              <Table.Td>{data?.person?.address}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Created At</Table.Th>
              <Table.Td>{data?.person?.createdAt && TimestampToDate(data.person.createdAt).toLocaleString()}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Updated At</Table.Th>
              <Table.Td>{data?.person?.updatedAt && TimestampToDate(data.person.updatedAt).toLocaleString()}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      );
    }

    if (mode === 'create') {
      return (
        <CreatePersonForm
          onSubmit={p => {
            createPersonMutation.mutate(p);
            onClose();
          }}
          onCancel={onClose}
        />
      );
    }

    return (
      data?.person && (
        <UpdatePersonForm
          person={data.person}
          onSubmit={p => {
            updatePersonMutation.mutate(p);
            onClose();
          }}
          onCancel={onClose}
        />
      )
    );
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      {renderContent()}
    </Modal>
  );
}

export default PersonModal;
