mod config;
mod dtos;
mod handlers;
mod models;
mod routes;
mod services;
mod state;

use std::{panic, sync::Arc};

use axum::{Router, serve};
use config::Config;
use mongodb::Client;
use tower_http::cors::{Any, CorsLayer};
use axum::http::{HeaderValue, Method};

#[tokio::main]
async fn main() -> mongodb::error::Result<()> {
    // configure app states
    let config = Arc::new(Config::new());

    // database connection
    let client = Client::with_uri_str(&config.mongo_uri).await?;
    let database = client.database(&config.database_name);

    let quotes_collection = database.collection::<models::quote::Quote>("quotes");
    let quotes_service = Arc::new(services::quote::QuoteService::new(quotes_collection));

    let app_state = state::AppState { quotes_service };

    // axum server
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    let app = Router::new()
        .nest("/quotes", routes::quote::router())
        .nest("/health", routes::health::router())
        .with_state(app_state)
        .layer(cors);
    let addr = format!("0.0.0.0:{}", config.port);

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|_| panic!("Failed to bind to address: {}", addr));

    println!("Server is running on {}. yay", addr);
    serve(listener, app).await.unwrap();

    Ok(())
}
