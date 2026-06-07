use std::env;

pub struct Config {
    pub mongo_uri: String,
    pub port: u16,
    pub database_name: String,
}

impl Config {
    pub fn new() -> Self {
        dotenvy::dotenv().ok();
        Self {
            mongo_uri: env::var("MONGODB_URI").expect("MONGO_URI not set"),
            port: env::var("PORT")
                .unwrap_or_else(|_| "8000".into())
                .parse::<u16>()
                .expect("PORT must be a valid u16"),
            database_name: env::var("DATABASE_NAME").unwrap_or_else(|_| "default".to_string()),
        }
    }
}
