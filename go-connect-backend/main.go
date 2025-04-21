package main

import (
	"context"
	"log"
	"net/http"

	"connectrpc.com/connect"
	person "example.com/go-connect-backend/gen"
	"example.com/go-connect-backend/gen/personconnect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

type PersonService struct {
	storage *PeopleStorage
}

// Create a new person
func (s *PersonService) CreatePerson(_ context.Context, req *connect.Request[person.CreatePersonRequest]) (*connect.Response[person.CreatePersonResponse], error) {
	p := req.Msg.Person
	created, err := s.storage.Create(p)

	if err != nil {
		return nil, connect.NewError(connect.CodeAlreadyExists, err)
	}

	return connect.NewResponse(&person.CreatePersonResponse{
			Person: created,
		}),
		nil
}

// Get a person by ID
func (s *PersonService) GetPerson(_ context.Context, req *connect.Request[person.GetPersonRequest]) (_ *connect.Response[person.GetPersonResponse], _ error) {
	id := req.Msg.Id

	p, err := s.storage.Get(id)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	return connect.NewResponse(&person.GetPersonResponse{Person: p}), nil
}

// Update an existing person
func (s *PersonService) UpdatePerson(_ context.Context, req *connect.Request[person.UpdatePersonRequest]) (_ *connect.Response[person.UpdatePersonResponse], _ error) {
	p := req.Msg.Person
	updated, err := s.storage.Update(p)
	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}
	return connect.NewResponse(&person.UpdatePersonResponse{Person: updated}), nil
}

// Delete a person by ID
func (s *PersonService) DeletePerson(_ context.Context, req *connect.Request[person.DeletePersonRequest]) (_ *connect.Response[person.DeletePersonResponse], _ error) {
	id := req.Msg.Id
	_, err := s.storage.Delete(id)

	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	return connect.NewResponse(&person.DeletePersonResponse{Success: true}), nil
}

// List all people with optional pagination
func (s *PersonService) ListPeople(_ context.Context, req *connect.Request[person.ListPeopleRequest]) (_ *connect.Response[person.ListPeopleResponse], _ error) {
	list, _ := s.storage.List()

	slice := list[0:]

	return connect.NewResponse(&person.ListPeopleResponse{People: slice}), nil
}

func main() {
	storage := NewPeopleStorage()
	svc := &PersonService{
		storage,
	}
	mux := http.NewServeMux()
	path, handler := personconnect.NewPersonServiceHandler(svc)
	mux.Handle(path, withCORS(handler))

	log.Println("🚀 Server listening on :8081")
	err := http.ListenAndServe(":8081", h2c.NewHandler(mux, &http2.Server{}))

	log.Fatalf("listen failed: %v", err)
}

func withCORS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers",
			"Content-Type, Connect-Protocol-Version, Connect-Timeout-Ms, X-User-Agent, X-Grpc-Web")

		// return 200 for preflight request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		h.ServeHTTP(w, r)
	})
}
