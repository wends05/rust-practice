use axum::{
    Router,
    routing::{get, post},
};

use crate::{
    handlers::quote::{create_quote, get_random_quote},
    state::AppState,
};

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/", post(create_quote))
        .route("/random", get(get_random_quote))
}
