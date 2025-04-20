package main

import (
	"fmt"
	"sync"

	person "example.com/go-connect-backend/gen"
	"github.com/google/uuid"
)

type PeopleStorage struct {
	mu   sync.Mutex
	data map[string]*person.Person
}

func NewPeopleStorage() *PeopleStorage {
	return &PeopleStorage{
		data: make(map[string]*person.Person),
	}
}

func (s *PeopleStorage) Create(person *person.Person) (*person.Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.data[person.Id]; exists {
		return nil, fmt.Errorf("person with id %v already exists", person.Id)
	}

	if person.Id == "" {
		person.Id = uuid.NewString()
	}

	s.data[person.Id] = person

	return person, nil
}

func (s *PeopleStorage) Get(id string) (*person.Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	person, exists := s.data[id]

	if !exists {
		return nil, fmt.Errorf("person with id %v not found", person.Id)
	}

	return person, nil
}

func (s *PeopleStorage) Update(person *person.Person) (*person.Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	_, exists := s.data[person.Id]
	if !exists {
		return nil, fmt.Errorf("person with id %v not found", person.Id)
	}

	s.data[person.Id] = person
	fmt.Println("updated:", person)

	return person, nil
}

func (s *PeopleStorage) Delete(id string) (*person.Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	person, exists := s.data[id]

	if !exists {
		return nil, fmt.Errorf("person with id %v not found", person.Id)
	}

	delete(s.data, id)
	return person, nil
}

func (s *PeopleStorage) List() ([]*person.Person, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	list := make([]*person.Person, 0, len(s.data))
	for _, p := range s.data {
		list = append(list, p)
	}

	return list, nil
}
