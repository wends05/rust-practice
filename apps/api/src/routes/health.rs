use axum::{Json, Router, routing::get};

use crate::{models::health::Health, state::AppState};

pub fn router() -> Router<AppState> {
    Router::new().route(
        "/",
        get(|| async {
            Json(Health {
                status: "ok".to_string(),
            })
        }),
    )
}
