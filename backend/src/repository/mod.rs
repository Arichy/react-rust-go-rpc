pub mod in_memory_repository;

use crate::person::Person;
use async_trait::async_trait;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum RepositoryError {
    #[error("Person with ID {0} not found")]
    NotFound(String),
    #[error("Invalid person data: {0}")]
    InvalidData(String),
}

#[async_trait]
pub trait PersonRepository: Send + Sync + 'static {
    async fn create(&self, person: Person) -> Result<Person, RepositoryError>;
    async fn get(&self, id: &str) -> Result<Person, RepositoryError>;
    async fn update(&self, person: Person) -> Result<Person, RepositoryError>;
    async fn delete(&self, id: &str) -> Result<(), RepositoryError>;
    async fn list(&self) -> Result<Vec<Person>, RepositoryError>;
}
