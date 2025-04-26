use std::env;

use crate::person::{
    CreatePersonRequest, DeletePersonRequest, GetPersonRequest, ListPeopleRequest,
    UpdatePersonRequest,
};

use sqlx::{types::time::OffsetDateTime, PgPool, QueryBuilder, Row};
use tonic::async_trait;
use uuid::Uuid;

use super::{ModelPerson, PersonRepository, RepositoryError};

pub struct DbRepository {
    pool: PgPool,
}

impl DbRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait]
impl PersonRepository for DbRepository {
    async fn create(&self, req: &CreatePersonRequest) -> Result<ModelPerson, RepositoryError> {
        let id = Uuid::new_v4().to_string();

        let now = OffsetDateTime::now_utc();

        let inserted = sqlx::query_as!(
            ModelPerson,
            r#"
        INSERT INTO people (id, name, email, age, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            name,
            email,
            age,
            address,
            created_at,
            updated_at
        "#,
            id,
            req.name,
            req.email,
            req.age,
            now,
            now,
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|err| RepositoryError::DbError(err.to_string()))?;

        Ok(inserted)
    }

    async fn get(&self, req: &GetPersonRequest) -> Result<ModelPerson, RepositoryError> {
        let record = sqlx::query_as!(
            ModelPerson,
            r#"
SELECT * FROM people WHERE id = $1
        "#,
            req.id
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|err| RepositoryError::DbError(err.to_string()))?;

        Ok(record)
    }

    async fn update(&self, req: &UpdatePersonRequest) -> Result<ModelPerson, RepositoryError> {
        let now = chrono::Local::now();
        let ts = OffsetDateTime::now_utc();
        println!("{req:?}");

        let mut builder = QueryBuilder::new("UPDATE people SET ");

        if let Some(name) = req.name.as_ref() {
            builder.push("name = ").push_bind(name);
        }

        if let Some(email) = req.email.as_ref() {
            builder.push(", ");
            builder.push("email = ").push_bind(email);
        }

        if let Some(age) = req.age.as_ref() {
            builder.push(", ");
            builder.push("age = ").push_bind(age);
        }

        if let Some(address) = req.address.as_ref() {
            builder.push(", ");
            builder.push("address = ").push_bind(address);
        }

        builder.push(", updated_at = ").push_bind(ts);

        builder.push(" WHERE id = ").push_bind(req.id.clone());
        builder.push(" RETURNING *");

        let row = builder
            .build()
            .fetch_one(&self.pool)
            .await
            .map_err(|err| RepositoryError::DbError(err.to_string()))?;

        Ok(ModelPerson {
            id: row
                .try_get("id")
                .map_err(|err| RepositoryError::DbError(err.to_string()))?,
            name: row
                .try_get("name")
                .map_err(|err| RepositoryError::DbError(err.to_string()))?,
            email: row
                .try_get("email")
                .map_err(|err| RepositoryError::DbError(err.to_string()))?,
            age: row
                .try_get("age")
                .map_err(|err| RepositoryError::DbError(err.to_string()))?,
            address: row
                .try_get("address")
                .map_err(|err| RepositoryError::DbError(err.to_string()))?,
            created_at: row
                .try_get("created_at")
                .map_err(|err| RepositoryError::DbError(err.to_string()))?,
            updated_at: row
                .try_get("updated_at")
                .map_err(|err| RepositoryError::DbError(err.to_string()))?,
        })
    }

    async fn delete(&self, req: &DeletePersonRequest) -> Result<(), RepositoryError> {
        let res = sqlx::query!(
            r#"
delete from people where id = $1
        "#,
            req.id
        )
        .execute(&self.pool)
        .await
        .map_err(|err| RepositoryError::DbError(err.to_string()))?;

        match res.rows_affected() {
            1 => Ok(()),
            _ => Err(RepositoryError::DbError("Delete failed.".to_string())),
        }
    }

    async fn list(&self, _req: &ListPeopleRequest) -> Result<Vec<ModelPerson>, RepositoryError> {
        let list = sqlx::query_as!(
            ModelPerson,
            r#"
        select * from people ORDER BY created_at
                "#,
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|err| RepositoryError::DbError(err.to_string()))?;

        Ok(list)
    }
}

pub async fn init_db() -> Result<PgPool, RepositoryError> {
    let db_url = env::var("DATABASE_URL").unwrap();

    let pool = PgPool::connect(&db_url)
        .await
        .map_err(|err| RepositoryError::DbError(err.to_string()))?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS people (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            age INTEGER NOT NULL,
            address TEXT,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )
        "#,
    )
    .execute(&pool)
    .await
    .map_err(|err| RepositoryError::DbError(err.to_string()))?;

    Ok(pool)
}
