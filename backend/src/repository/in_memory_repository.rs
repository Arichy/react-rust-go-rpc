use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use async_trait::async_trait;
use uuid::Uuid;
use crate::person::Person;
use super::{PersonRepository, RepositoryError};

pub struct InMemoryRepository {
    data: Arc<Mutex<HashMap<String, Person>>>,
}

impl InMemoryRepository {
    pub fn new() -> Self {
        Self {
            data: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

#[async_trait]
impl PersonRepository for InMemoryRepository {
    async fn create(&self, mut person: Person) -> Result<Person, RepositoryError> {
        let mut data = self.data.lock().unwrap();
        
        // Generate a UUID if one doesn't exist
        if person.id.is_empty() {
            person.id = Uuid::new_v4().to_string();
        }
        
        // Validate required fields
        if person.name.is_empty() {
            return Err(RepositoryError::InvalidData("Name is required".into()));
        }
        if person.email.is_empty() {
            return Err(RepositoryError::InvalidData("Email is required".into()));
        }
        
        // Store the person
        data.insert(person.id.clone(), person.clone());
        Ok(person)
    }
    
    async fn get(&self, id: &str) -> Result<Person, RepositoryError> {
        let data = self.data.lock().unwrap();
        
        data.get(id)
            .cloned()
            .ok_or_else(|| RepositoryError::NotFound(id.to_string()))
    }
    
    async fn update(&self, person: Person) -> Result<Person, RepositoryError> {
        let mut data = self.data.lock().unwrap();
        
        // Ensure the person exists
        if !data.contains_key(&person.id) {
            return Err(RepositoryError::NotFound(person.id));
        }
        
        // Validate required fields
        if person.name.is_empty() {
            return Err(RepositoryError::InvalidData("Name is required".into()));
        }
        if person.email.is_empty() {
            return Err(RepositoryError::InvalidData("Email is required".into()));
        }
        
        // Update the person
        data.insert(person.id.clone(), person.clone());
        Ok(person)
    }
    
    async fn delete(&self, id: &str) -> Result<(), RepositoryError> {
        let mut data = self.data.lock().unwrap();
        
        if data.remove(id).is_none() {
            return Err(RepositoryError::NotFound(id.to_string()));
        }
        
        Ok(())
    }
    
    async fn list(&self) -> Result<Vec<Person>, RepositoryError> {
        let data = self.data.lock().unwrap();
        let people = data.values().cloned().collect();
        Ok(people)
    }
}