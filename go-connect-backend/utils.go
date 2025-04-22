package main

import person "example.com/go-connect-backend/gen"

func ProtoToModel(p *person.Person) *Person {
	return &Person{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   int(p.Age),
	}
}

func ModelToProto(p *Person) *person.Person {
	return &person.Person{
		Id:    p.Id,
		Name:  p.Name,
		Email: p.Email,
		Age:   int32(p.Age),
	}
}
