use super::{ModelPerson, PersonRepository, RepositoryError};
use crate::person::{
    CreatePersonRequest, DeletePersonRequest, GetPersonRequest, ListPeopleRequest,
    UpdatePersonRequest,
};

use async_trait::async_trait;
use sqlx::types::time::OffsetDateTime;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use uuid::Uuid;

pub struct InMemoryRepository {
    data: Arc<Mutex<HashMap<String, ModelPerson>>>,
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
    async fn create(&self, req: &CreatePersonRequest) -> Result<ModelPerson, RepositoryError> {
        // Generate a UUID if one doesn't exist

        let now = OffsetDateTime::now_utc();

        let mut p: ModelPerson = ModelPerson {
            created_at: now,
            updated_at: now,
            ..Default::default()
        };

        p.id = Uuid::new_v4().to_string();

        // Validate required fields
        if req.name.is_empty() {
            return Err(RepositoryError::InvalidData("Name is required".into()));
        }
        if req.email.is_empty() {
            return Err(RepositoryError::InvalidData("Email is required".into()));
        }

        let id = p.id.clone();

        let mut data = self.data.lock().unwrap();
        // Store the person
        data.insert(id, p.clone());

        Ok(p)
    }

    async fn get(&self, req: &GetPersonRequest) -> Result<ModelPerson, RepositoryError> {
        let data = self.data.lock().unwrap();

        data.get(&req.id)
            .cloned()
            .ok_or_else(|| RepositoryError::NotFound(req.id.to_string()))
    }

    async fn update(&self, req: &UpdatePersonRequest) -> Result<ModelPerson, RepositoryError> {
        // Validate required fields
        if req.name.is_none() || req.name.as_ref().unwrap().is_empty() {
            return Err(RepositoryError::InvalidData("Name is required".into()));
        }
        if req.email.is_none() || req.email.as_ref().unwrap().is_empty() {
            return Err(RepositoryError::InvalidData("Email is required".into()));
        }

        let id = req.id.clone();

        let mut data = self.data.lock().unwrap();
        // Update the person

        match data.get_mut(&id) {
            Some(entry) => {
                if let Some(name) = req.name.as_ref() {
                    entry.name = name.clone()
                }

                if let Some(email) = req.email.as_ref() {
                    entry.email = email.clone();
                }

                if let Some(age) = req.age.as_ref() {
                    entry.age = *age;
                }

                if let Some(address) = req.address.as_ref() {
                    entry.address = Some(address.clone());
                }

                Ok(entry.clone())
            }
            None => Err(RepositoryError::NotFound(id)),
        }
    }

    async fn delete(&self, req: &DeletePersonRequest) -> Result<(), RepositoryError> {
        let mut data = self.data.lock().unwrap();

        if data.remove(&req.id).is_none() {
            return Err(RepositoryError::NotFound(req.id.to_string()));
        }

        Ok(())
    }

    async fn list(&self, _req: &ListPeopleRequest) -> Result<Vec<ModelPerson>, RepositoryError> {
        let data = self.data.lock().unwrap();
        let people = data.values().cloned().collect();

        Ok(people)
    }
}
