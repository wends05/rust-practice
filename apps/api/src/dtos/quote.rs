use serde::{Deserialize, Serialize};

use crate::models::quote::Quote;

#[derive(Debug, Deserialize)]
pub struct CreateQuote {
    pub text: String,
    pub author: String,
}

#[derive(Debug, Serialize)]
pub struct CreateQuoteResponse {
    pub id: String,
    pub text: String,
    pub author: String,
}

impl From<Quote> for CreateQuoteResponse {
    fn from(quote: Quote) -> Self {
        Self {
            id: quote.id.unwrap_or_default().to_string(),
            text: quote.text,
            author: quote.author,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct RandomQuoteResponse {
    pub id: String,
    pub text: String,
    pub author: String,
}

impl From<Quote> for RandomQuoteResponse {
    fn from(quote: Quote) -> Self {
        Self {
            id: quote.id.unwrap_or_default().to_string(),
            text: quote.text,
            author: quote.author,
        }
    }
}
