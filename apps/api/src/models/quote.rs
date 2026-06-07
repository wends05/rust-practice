use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Quote {
    #[serde(rename = "_id")]
    pub id: Option<ObjectId>,
    pub text: String,
    pub author: String,
}
