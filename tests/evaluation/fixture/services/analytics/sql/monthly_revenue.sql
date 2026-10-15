-- PostgreSQL 16; orders has ~40M rows; no index besides the primary key
SELECT date_trunc('month', placed_at) AS month, customer_id, sum(total) AS revenue
FROM orders
WHERE to_char(placed_at, 'YYYY') = '2026' AND status <> 'cancelled'
GROUP BY 1, 2 ORDER BY 1, 3 DESC;
