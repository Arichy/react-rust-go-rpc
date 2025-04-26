package main

import (
	"fmt"
	"sync"

	person "example.com/go-connect-backend/gen"
	"github.com/google/uuid"
)

type PeopleStorage struct {
	mu   sync.Mutex
	data map[string]*ModelPerson
}

func NewPeopleStorage() *PeopleStorage {
	return &PeopleStorage{
		data: make(map[string]*ModelPerson),
	}
}

func (s *PeopleStorage) Create(person *person.PersonBrief) (*ModelPerson, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.data[person.Id]; exists {
		return nil, fmt.Errorf("person with id %v already exists", person.Id)
	}

	if person.Id == "" {
		person.Id = uuid.NewString()
	}

	modelPerson := ProtoPersonBriefToModelPerson(person)

	s.data[person.Id] = modelPerson

	return modelPerson, nil
}

func (s *PeopleStorage) Get(id string) (*ModelPerson, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	person, exists := s.data[id]

	if !exists {
		return nil, fmt.Errorf("person with id %v not found", person.Id)
	}

	return person, nil
}

func (s *PeopleStorage) Update(req *person.UpdatePersonRequest) (*ModelPerson, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	p, exists := s.data[req.Id]
	if !exists {
		return nil, fmt.Errorf("person with id %v not found", req.Id)
	}

	if req.Name != nil {
		p.Name = *req.Name
	}

	if req.Email != nil {
		p.Email = *req.Email
	}
	if req.Age != nil {
		p.Age = *req.Age
	}
	if req.Address != nil {
		p.Address = *req.Address
	}

	return p, nil
}

func (s *PeopleStorage) Delete(id string) (*ModelPerson, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	person, exists := s.data[id]

	if !exists {
		return nil, fmt.Errorf("person with id %v not found", id)
	}

	delete(s.data, id)
	return person, nil
}

func (s *PeopleStorage) List() ([]*ModelPerson, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	list := make([]*ModelPerson, 0, len(s.data))
	for _, p := range s.data {
		list = append(list, p)
	}

	return list, nil
}
