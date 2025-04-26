package main

import (
	person "example.com/go-connect-backend/gen"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func ProtoPersonBriefToModelPerson(p *person.PersonBrief) *ModelPerson {

	return &ModelPerson{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   p.Age,
	}
}

func ModelPersonToProtoPersonBrief(p *ModelPerson) *person.PersonBrief {
	return &person.PersonBrief{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   p.Age,
	}
}

func ModelPersonToProtoPerson(p *ModelPerson) *person.Person {
	return &person.Person{
		Id:        p.Id,
		Name:      p.Name,
		Email:     p.Email,
		Age:       p.Age,
		Address:   p.Address,
		CreatedAt: timestamppb.New(p.CreatedAt),
		UpdatedAt: timestamppb.New(p.UpdatedAt),
	}
}

func createModelPerson(p *person.Person) *ModelPerson {
	return &ModelPerson{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   p.Age,
	}
}

func updateModelPerson(p *person.Person) *ModelPerson {

	return &ModelPerson{
		Id:      p.Id,
		Name:    p.Name,
		Email:   p.Email,
		Age:     p.Age,
		Address: p.Address,
	}
}
