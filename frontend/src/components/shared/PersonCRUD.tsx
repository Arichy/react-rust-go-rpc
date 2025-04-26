import { useState } from 'react';
import { PersonBrief, ListPeopleRequestSchema, DeletePersonRequestSchema } from '@src/gen/person_pb';
import { PersonService } from '../../services/PersonService';
import PersonList from './PersonList';
import PersonModal from './PersonModal';
import { create } from '@bufbuild/protobuf';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Center, Loader, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface PersonCRUDProps {
  title: string;
  personService: PersonService;
  serviceName: 'go' | 'rust';
}

function PersonCRUD({ title, personService, serviceName }: PersonCRUDProps) {
  const queryClient = useQueryClient();

  const peopleQueryKey = ['people'];
  // const { data, fetchNextPage, isFetching } = useInfiniteQuery({
  //   queryKey: peopleQueryKey,
  //   queryFn: async ({ pageParam }) => {
  //     const response = await personService.listPeople(create(ListPeopleRequestSchema, pageParam));
  //     return response;
  //   },
  //   initialPageParam: {
  //     pageSize: 10,
  //     pageToken: undefined,
  //   } as ListPeopleRequest,
  //   getNextPageParam: (lastPage, allPages) => {
  //     return {
  //       pageSize: 10,
  //       pageToken: lastPage.nextPageToken,
  //     } as ListPeopleRequest;
  //   },
  // });

  const {
    data: people,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [...peopleQueryKey, serviceName],
    queryFn: async () => {
      const response = await personService.listPeople(create(ListPeopleRequestSchema, { pageSize: 100 }));
      return response.people;
    },
  });

  const handleViewPerson = async (id: string) => {
    setSelectedId(id);
    setMode('view');
    open();
  };

  // This function now handles PersonBrief objects from the list
  const handleEditPerson = async (personBrief: PersonBrief) => {
    setSelectedId(personBrief.id);
    setMode('edit');
    open();
  };

  const handleDeletePerson = async (id: string) => {
    try {
      await personService.deletePerson(create(DeletePersonRequestSchema, { id }));
      queryClient.invalidateQueries({ queryKey: peopleQueryKey });
    } catch (err) {
      console.error('Error deleting person:', err);
      // setError('Failed to delete person');
    }
  };

  const [opened, { close, open }] = useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');

  return (
    <Box>
      <Text fw="bold" fz="h2" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
        {title}
      </Text>

      <Button
        mt="md"
        onClick={() => {
          setMode('create');
          setSelectedId(null);
          open();
        }}
      >
        Add Person
      </Button>
      <Box mt="xl">
        {(() => {
          if (isLoading) {
            return (
              <Center>
                <Loader type="bars" />
              </Center>
            );
          }

          if (isError) {
            return (
              <div>
                <p>Error: {error.message}</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            );
          }

          return (
            people && (
              <PersonList
                people={people}
                onEdit={handleEditPerson}
                onDelete={handleDeletePerson}
                onViewDetails={handleViewPerson}
              />
            )
          );
        })()}
      </Box>

      <PersonModal id={selectedId} opened={opened} onClose={close} personService={personService} mode={mode} />
    </Box>
  );
}

export default PersonCRUD;
