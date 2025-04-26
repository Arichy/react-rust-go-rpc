import { Person, PersonBrief, PersonBriefSchema, PersonSchema } from '@src/gen/person_pb';
import { useForm } from '@mantine/form';
import { Button, Group, TextInput } from '@mantine/core';
import { create } from '@bufbuild/protobuf';

export function CreatePersonForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (person: PersonBrief) => void;
  onCancel: () => void;
}) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      age: 0,
    },
    transformValues(values) {
      return {
        ...values,
        age: Number(values.age),
      };
    },
    validate: {
      name: (value: string) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value: string) => (!/\S+@\S+\.\S+/.test(value) ? 'Invalid email' : null),
      age: (value: number) => (value < 0 ? 'Age must be a positive number' : null),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(values => {
        console.log(values);
        onSubmit(create(PersonBriefSchema, values));
      })}
    >
      <TextInput required label="Name" placeholder="Enter name" {...form.getInputProps('name')} />
      <TextInput required label="Email" placeholder="Enter email" {...form.getInputProps('email')} />
      <TextInput required label="Age" type="number" placeholder="Enter age" {...form.getInputProps('age')} />

      <Group mt="md" justify="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}

export function UpdatePersonForm({
  person,
  onSubmit,
  onCancel,
}: {
  person: Person;
  onSubmit: (person: Person) => void;
  onCancel: () => void;
}) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: person.name,
      email: person.email,
      age: person.age,
      address: person.address,
    },
    transformValues(values) {
      return {
        ...values,
        age: Number(values.age),
      };
    },
    validate: {
      name: (value: string) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      email: (value: string) => (!/\S+@\S+\.\S+/.test(value) ? 'Invalid email' : null),
      age: (value: number) => (value < 0 ? 'Age must be a positive number' : null),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(values => {
        onSubmit(create(PersonSchema, { ...values, id: person.id }));
      })}
    >
      <TextInput required label="Name" placeholder="Enter name" {...form.getInputProps('name')} />
      <TextInput required label="Email" placeholder="Enter email" {...form.getInputProps('email')} />
      <TextInput required label="Age" type="number" placeholder="Enter age" {...form.getInputProps('age')} />
      <TextInput label="Address" placeholder="Enter address" {...form.getInputProps('address')} />
      <Group mt="md" justify="flex-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
