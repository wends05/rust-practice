use futures::TryStreamExt;
use mongodb::Collection;
use mongodb::bson::doc;

use crate::dtos::quote::CreateQuote;
use crate::models::quote::Quote;

pub struct QuoteService {
    collection: Collection<Quote>,
}

impl QuoteService {
    pub fn new(collection: Collection<Quote>) -> Self {
        Self { collection }
    }

    pub async fn create_quote(&self, quote: CreateQuote) -> mongodb::error::Result<Quote> {
        let new_quote = Quote {
            id: None,
            ..quote.into()
        };

        let result = self.collection.insert_one(&new_quote).await?;

        Ok(Quote {
            id: result.inserted_id.as_object_id(),
            text: new_quote.text,
            author: new_quote.author,
        })
    }

    pub async fn get_random_quote(&self) -> mongodb::error::Result<Option<Quote>> {
        let mut cursor = self
            .collection
            .aggregate(vec![doc! { "$sample": { "size": 1, } }])
            .await?;
        match cursor.try_next().await? {
            Some(doc) => {
                let quote: Quote = mongodb::bson::from_document(doc)?;
                Ok(Some(quote))
            }
            None => Ok(None),
        }
    }
}
