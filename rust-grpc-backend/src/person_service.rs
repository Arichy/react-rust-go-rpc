use crate::person::{
    person_service_server::PersonService, CreatePersonRequest, CreatePersonResponse,
    DeletePersonRequest, DeletePersonResponse, GetPersonRequest, GetPersonResponse,
    ListPeopleRequest, ListPeopleResponse, UpdatePersonRequest, UpdatePersonResponse,
};
use crate::repository::{PersonRepository, RepositoryError};
use tonic::{Request, Response, Status};

pub struct PersonServiceImpl<R: PersonRepository> {
    repository: R,
}

impl<R: PersonRepository> PersonServiceImpl<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }
}

#[tonic::async_trait]
impl<R: PersonRepository> PersonService for PersonServiceImpl<R> {
    async fn create_person(
        &self,
        request: Request<CreatePersonRequest>,
    ) -> Result<Response<CreatePersonResponse>, Status> {
        let req = request.into_inner();

        let created_person = self.repository.create(&req).await.map_err(|e| match e {
            RepositoryError::InvalidData(msg) => Status::invalid_argument(msg),
            _ => Status::internal("Failed to create person"),
        })?;

        Ok(Response::new(CreatePersonResponse {
            person: Some(created_person.into()),
        }))
    }

    async fn get_person(
        &self,
        request: Request<GetPersonRequest>,
    ) -> Result<Response<GetPersonResponse>, Status> {
        let req = request.into_inner();
        let id = &req.id;

        if id.is_empty() {
            return Err(Status::invalid_argument("Person ID is required"));
        }

        let person = self.repository.get(&req).await.map_err(|e| match e {
            RepositoryError::NotFound(_) => Status::not_found("Person not found"),
            _ => Status::internal("Failed to get person"),
        })?;

        Ok(Response::new(GetPersonResponse {
            person: Some(person.into()),
        }))
    }

    async fn update_person(
        &self,
        request: Request<UpdatePersonRequest>,
    ) -> Result<Response<UpdatePersonResponse>, Status> {
        let req = request.into_inner();

        if req.id.is_empty() {
            return Err(Status::invalid_argument("Person ID is required for update"));
        }

        let updated_person = self.repository.update(&req).await.map_err(|e| match e {
            RepositoryError::NotFound(_) => Status::not_found("Person not found"),
            RepositoryError::InvalidData(msg) => Status::invalid_argument(msg),
            _ => {
                println!("{e}");
                Status::internal("Failed to update person")
            }
        })?;

        println!("{updated_person:?}");

        Ok(Response::new(UpdatePersonResponse {
            person: Some(updated_person.into()),
        }))
    }

    async fn delete_person(
        &self,
        request: Request<DeletePersonRequest>,
    ) -> Result<Response<DeletePersonResponse>, Status> {
        let req = request.into_inner();
        let id = &req.id;

        if id.is_empty() {
            return Err(Status::invalid_argument("Person ID is required"));
        }

        self.repository.delete(&req).await.map_err(|e| match e {
            RepositoryError::NotFound(_) => Status::not_found("Person not found"),
            _ => Status::internal("Failed to delete person"),
        })?;

        Ok(Response::new(DeletePersonResponse { success: true }))
    }

    async fn list_people(
        &self,
        request: Request<ListPeopleRequest>,
    ) -> Result<Response<ListPeopleResponse>, Status> {
        let req = request.into_inner();

        let people = self
            .repository
            .list(&req)
            .await
            .map_err(|_| Status::internal("Failed to list people"))?
            .into_iter()
            .map(|p| p.into())
            .collect();

        Ok(Response::new(ListPeopleResponse {
            people,
            next_page_token: "".to_string(), // Simple implementation without pagination
        }))
    }
}
