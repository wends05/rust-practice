use axum::http::StatusCode;
use axum::{Json, extract::State};
use serde_json::json;

use crate::dtos::quote::{CreateQuote, CreateQuoteResponse, RandomQuoteResponse};
use crate::state::AppState;

pub async fn create_quote(
    State(state): State<AppState>,
    Json(payload): Json<CreateQuote>,
) -> Result<Json<CreateQuoteResponse>, (StatusCode, Json<serde_json::Value>)> {
    let quote = state
        .quotes_service
        .create_quote(payload)
        .await
        .map_err(|error| {
            eprintln!("Error: {:#?}", error);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Internal server error"
                })),
            )
        })?;

    Ok(Json(quote.into()))
}

pub async fn get_random_quote(
    State(state): State<AppState>,
) -> Result<Json<RandomQuoteResponse>, (StatusCode, Json<serde_json::Value>)> {
    match state.quotes_service.get_random_quote().await {
        Ok(Some(quote)) => Ok(Json(quote.into())),
        Ok(None) => Err((
            StatusCode::NOT_FOUND,
            Json(json!({
                "error": "No quote found"
            })),
        )),
        Err(error) => {
            eprintln!("Error: {:#?}", error);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Internal server error"
                })),
            ))
        }
    }
}
