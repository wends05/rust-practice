use crate::services::quote::QuoteService;
use std::sync::Arc;

#[derive(Clone)]
pub struct AppState {
    pub quotes_service: Arc<QuoteService>,
}
