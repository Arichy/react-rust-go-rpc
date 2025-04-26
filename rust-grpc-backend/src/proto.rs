use crate::{
    person::{Person, PersonBrief},
    repository::ModelPerson,
    utils::{i64_to_ts, offsetdatetime_to_ts},
};

impl From<ModelPerson> for Person {
    fn from(value: ModelPerson) -> Self {
        Self {
            id: value.id,
            name: value.name,
            email: value.email,
            age: value.age as i32,
            created_at: Some(offsetdatetime_to_ts(value.created_at)),
            updated_at: Some(offsetdatetime_to_ts(value.updated_at)),
            address: value.address.unwrap_or_default(),
        }
    }
}

impl From<ModelPerson> for PersonBrief {
    fn from(value: ModelPerson) -> Self {
        Self {
            id: value.id,
            name: value.name,
            email: value.email,
            age: value.age as i32,
        }
    }
}
