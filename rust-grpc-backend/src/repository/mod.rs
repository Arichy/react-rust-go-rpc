pub mod in_memory_repository;
pub mod sqlite_repository;

use crate::person::{
    CreatePersonRequest, DeletePersonRequest, GetPersonRequest, ListPeopleRequest, Person,
    PersonBrief, UpdatePersonRequest,
};
use async_trait::async_trait;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum RepositoryError {
    #[error("Person with ID {0} not found")]
    NotFound(String),

    #[error("Invalid person data: {0}")]
    InvalidData(String),

    #[error("Db error: {0}")]
    DbError(String),
}

#[derive(Debug, Default, Clone)]
pub struct ModelPerson {
    pub id: String,
    pub name: String,
    pub email: String,
    pub age: i64,
    pub address: Option<String>,
    pub created_at: i64,
    pub updated_at: i64,
}

impl ModelPerson {
    pub fn to_proto_person_brief(self) -> PersonBrief {
        PersonBrief {
            id: self.id,
            name: self.name,
            email: self.email,
            age: self.age as i32,
        }
    }
}

#[async_trait]
pub trait PersonRepository: Send + Sync + 'static {
    async fn create(&self, req: &CreatePersonRequest) -> Result<ModelPerson, RepositoryError>;
    async fn get(&self, req: &GetPersonRequest) -> Result<ModelPerson, RepositoryError>;
    async fn update(&self, req: &UpdatePersonRequest) -> Result<ModelPerson, RepositoryError>;
    async fn delete(&self, req: &DeletePersonRequest) -> Result<(), RepositoryError>;
    async fn list(&self, req: &ListPeopleRequest) -> Result<Vec<ModelPerson>, RepositoryError>;
}

impl PersonBrief {
    pub fn from_person(person: Person) -> Self {
        Self {
            id: person.id,
            name: person.name,
            email: person.email,
            age: person.age,
        }
    }
}
