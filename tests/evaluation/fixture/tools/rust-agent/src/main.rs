use axum::{routing::get, Router, extract::Path};
async fn order(Path(id): Path<u32>) -> String { format!("order {id}") }
#[tokio::main] async fn main() {
    let app = Router::new().route("/orders/:id", get(order));
    let l = tokio::net::TcpListener::bind("127.0.0.1:3001").await.unwrap();
    axum::serve(l, app).await.unwrap();
}
