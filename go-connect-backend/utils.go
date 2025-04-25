package main

import (
	"time"

	person "example.com/go-connect-backend/gen"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func ProtoPersonBriefToModelPerson(p *person.PersonBrief) *ModelPerson {

	return &ModelPerson{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   int(p.Age),
	}
}

func ModelPersonToProtoPersonBrief(p *ModelPerson) *person.PersonBrief {
	return &person.PersonBrief{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   int32(p.Age),
	}
}

func ModelPersonToProtoPerson(p *ModelPerson) *person.Person {
	return &person.Person{
		Id:        p.Id,
		Name:      p.Name,
		Email:     p.Email,
		Age:       int32(p.Age),
		Address:   p.Address,
		CreatedAt: timestamppb.New(time.Unix(p.CreatedAt, 0).UTC()),
		UpdatedAt: timestamppb.New(time.Unix(p.UpdatedAt, 0).UTC()),
	}
}

func createModelPerson(p *person.Person) *ModelPerson {
	return &ModelPerson{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   int(p.Age),
	}
}

func updateModelPerson(p *person.Person) *ModelPerson {

	return &ModelPerson{
		Id:      p.Id,
		Name:    p.Name,
		Email:   p.Email,
		Age:     int(p.Age),
		Address: p.Address,
	}
}
