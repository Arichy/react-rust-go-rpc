package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"connectrpc.com/connect"
	person "example.com/go-connect-backend/gen"
	"example.com/go-connect-backend/gen/personconnect"
	"github.com/google/uuid"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type PersonService struct {
	storage *PeopleStorage
	db      *gorm.DB
}

type Person struct {
	Id        string `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	Name      string
	Email     string
	Age       int
}

func (p *Person) BeforeCreate(tx *gorm.DB) (err error) {
	id := uuid.NewString()
	fmt.Println(id)
	p.Id = id

	return
}

// Create a new person
func (s *PersonService) CreatePerson(_ context.Context, req *connect.Request[person.CreatePersonRequest]) (*connect.Response[person.CreatePersonResponse], error) {
	p := req.Msg.Person
	var created *person.Person
	var err error

	if s.db != nil {
		err = s.db.Create(ProtoToModel(p)).Error
		created = p
	} else {
		created, err = s.storage.Create(p)
	}

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

	var p *person.Person
	var err error

	if s.db != nil {
		var modelPerson Person
		err = s.db.First(&modelPerson, "id = ?", id).Error
		p = ModelToProto(&modelPerson)
	} else {
		p, err = s.storage.Get(id)
	}

	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	return connect.NewResponse(&person.GetPersonResponse{Person: p}), nil
}

// Update an existing person
func (s *PersonService) UpdatePerson(_ context.Context, req *connect.Request[person.UpdatePersonRequest]) (_ *connect.Response[person.UpdatePersonResponse], _ error) {
	p := req.Msg.Person

	var updated *person.Person
	var err error

	if s.db != nil {
		modelPerson := ProtoToModel(p)
		err = s.db.Save(modelPerson).Error
	} else {
		updated, err = s.storage.Update(p)
	}

	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}
	return connect.NewResponse(&person.UpdatePersonResponse{Person: updated}), nil
}

// Delete a person by ID
func (s *PersonService) DeletePerson(_ context.Context, req *connect.Request[person.DeletePersonRequest]) (_ *connect.Response[person.DeletePersonResponse], _ error) {
	id := req.Msg.Id

	var err error

	if s.db != nil {
		err = s.db.Delete(&Person{}, "id = ?", id).Error
	} else {
		_, err = s.storage.Delete(id)
	}

	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	return connect.NewResponse(&person.DeletePersonResponse{Success: true}), nil
}

// List all people with optional pagination
func (s *PersonService) ListPeople(_ context.Context, req *connect.Request[person.ListPeopleRequest]) (_ *connect.Response[person.ListPeopleResponse], _ error) {
	var list []*person.Person

	if s.db != nil {
		s.db.Find(&list)
	} else {
		list, _ = s.storage.List()
	}

	slice := list[0:]

	return connect.NewResponse(&person.ListPeopleResponse{People: slice}), nil
}

func main() {
	db, err := gorm.Open(sqlite.Open("../person.db"), &gorm.Config{})

	if err != nil {
		fmt.Println(db)
		fmt.Println("Failed to open person.db")
	}

	db.AutoMigrate(&Person{})

	storage := NewPeopleStorage()
	svc := &PersonService{
		storage,
		db,
	}

	mux := http.NewServeMux()
	path, handler := personconnect.NewPersonServiceHandler(svc)
	mux.Handle(path, withCORS(handler))

	log.Println("🚀 Server listening on :8081")
	err = http.ListenAndServe(":8081", h2c.NewHandler(mux, &http2.Server{}))

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
