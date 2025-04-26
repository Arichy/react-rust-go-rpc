mod person_service;
mod repository;

use std::env;

use person_service::PersonServiceImpl;
use repository::{
    db_repository::{init_db, DbRepository},
    in_memory_repository::InMemoryRepository,
};

use tokio::signal;
use tonic::transport::Server;
use tonic_web::GrpcWebLayer;
use tower_http::cors::CorsLayer;

// Import the generated proto code
pub mod person {
    tonic::include_proto!("person");
}

pub mod proto;
pub mod utils;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let _ = dotenvy::dotenv();

    let db_url = env::var("DATABASE_URL")?;

    let pool = init_db().await?;

    println!("Using database at:{db_url}");

    // Create a new in-memory repository
    // let repository = InMemoryRepository::new();
    let repository = DbRepository::new(pool);

    // Create the gRPC service
    let person_service = PersonServiceImpl::new(repository);

    // Define the address to listen on
    let addr = "0.0.0.0:50051".parse()?;

    println!("Person service server listening on {}", addr);

    // Build and start the server
    Server::builder()
        .accept_http1(true)
        .layer(GrpcWebLayer::new())
        .layer(CorsLayer::permissive())
        .add_service(person::person_service_server::PersonServiceServer::new(
            person_service,
        ))
        .serve_with_shutdown(addr, shutdown_signal())
        .await?;

    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    println!("Signal received, shutting down immediately");
}
