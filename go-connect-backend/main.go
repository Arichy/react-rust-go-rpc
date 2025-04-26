package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"connectrpc.com/connect"
	person "example.com/go-connect-backend/gen"
	"example.com/go-connect-backend/gen/personconnect"
	"github.com/google/uuid"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type PersonService struct {
	storage *PeopleStorage
	db      *gorm.DB
}

type ModelPerson struct {
	Id        string `gorm:"primaryKey;not null"`
	Name      string `gorm:"not null"`
	Email     string `gorm:"unique;not null"`
	Age       int32  `gorm:"not null"`
	Address   string
	CreatedAt time.Time `gorm:"autoCreateTime;type:timestamptz;default:now();not null"`
	UpdatedAt time.Time `gorm:"autoCreateTime;type:timestamptz;default:now();not null"`
}

func (ModelPerson) TableName() string {
	return "people"
}

func (p *ModelPerson) BeforeCreate(tx *gorm.DB) (err error) {
	id := uuid.NewString()
	p.Id = id

	return
}

// Create a new person
func (s *PersonService) CreatePerson(_ context.Context, req *connect.Request[person.CreatePersonRequest]) (*connect.Response[person.CreatePersonResponse], error) {
	var created *person.Person
	var err error

	if s.db != nil {
		toInsert := &ModelPerson{
			Name:  req.Msg.Name,
			Email: req.Msg.Email,
			Age:   req.Msg.Age,
		}

		err = s.db.Create(toInsert).Error

		created = ModelPersonToProtoPerson(toInsert)
	} else {
		p := &person.PersonBrief{
			Name:  req.Msg.Name,
			Email: req.Msg.Email,
			Age:   req.Msg.Age,
		}
		createdModel, err := s.storage.Create(p)
		if err != nil {
			return nil, connect.NewError(connect.CodeAlreadyExists, err)
		}
		created = ModelPersonToProtoPerson(createdModel)
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
		var modelPerson ModelPerson
		err = s.db.First(&modelPerson, "id = ?", id).Error
		p = ModelPersonToProtoPerson(&modelPerson)
	} else {
		modelPerson, err := s.storage.Get(id)
		if err != nil {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		p = ModelPersonToProtoPerson(modelPerson)
	}

	if err != nil {
		return nil, connect.NewError(connect.CodeNotFound, err)
	}

	return connect.NewResponse(&person.GetPersonResponse{Person: p}), nil
}

// Update an existing person
func (s *PersonService) UpdatePerson(_ context.Context, req *connect.Request[person.UpdatePersonRequest]) (_ *connect.Response[person.UpdatePersonResponse], _ error) {
	var updated *person.Person
	var err error

	if s.db != nil {
		updates := make(map[string]any)

		if req.Msg.Name != nil {
			updates["name"] = req.Msg.Name
		}

		if req.Msg.Email != nil {
			updates["email"] = req.Msg.Email
		}

		if req.Msg.Age != nil {
			updates["age"] = req.Msg.Age
		}

		if req.Msg.Address != nil {
			updates["address"] = req.Msg.Address
		}

		err = s.db.Model(&ModelPerson{}).Where("id = ?", req.Msg.Id).Updates(updates).Error
	} else {
		modelPerson, err := s.storage.Update(req.Msg)
		if err != nil {
			return nil, connect.NewError(connect.CodeNotFound, err)
		}
		updated = ModelPersonToProtoPerson(modelPerson)
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
		err = s.db.Delete(&ModelPerson{}, "id = ?", id).Error
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
	var modelList []*ModelPerson

	if s.db != nil {
		s.db.Order("created_at").Find(&modelList)
	} else {
		modelList, _ = s.storage.List()
	}

	var list []*person.PersonBrief
	for _, modelPerson := range modelList {
		list = append(list, ModelPersonToProtoPersonBrief(modelPerson))
	}

	slice := list[0:]

	return connect.NewResponse(&person.ListPeopleResponse{People: slice}), nil
}

func main() {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	if dbHost == "" {
		dbHost = "localhost"
	}
	if dbPort == "" {
		dbPort = "5432"
	}
	if dbUser == "" {
		dbUser = "user"
	}
	if dbPassword == "" {
		dbPassword = "password"
	}
	if dbName == "" {
		dbName = "person_db"
	}

	// dsn := "host=localhost user=user password=password dbname=person_db port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Shanghai", dbHost, dbUser, dbPassword, dbName, dbPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println(db)
		fmt.Println("Failed to open database connection, err:", err)
		return
	}

	db.AutoMigrate(&ModelPerson{})

	storage := NewPeopleStorage()
	svc := &PersonService{
		storage,
		db,
	}

	mux := http.NewServeMux()
	path, handler := personconnect.NewPersonServiceHandler(svc)
	mux.Handle(path, withCORS(handler))

	server := &http.Server{
		Addr:    ":8081",
		Handler: h2c.NewHandler(mux, &http2.Server{}),
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Println("🚀 Server listening on :8081")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server start failed: %v", err)
		}
	}()

	<-quit
	log.Println("Shutting down server...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.Close()
	}

	log.Println("Server gracefully stopped")

	// log.Println("🚀 Server listening on :8081")
	// err = http.ListenAndServe(":8081", h2c.NewHandler(mux, &http2.Server{}))

	// log.Fatalf("listen failed: %v", err)
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
