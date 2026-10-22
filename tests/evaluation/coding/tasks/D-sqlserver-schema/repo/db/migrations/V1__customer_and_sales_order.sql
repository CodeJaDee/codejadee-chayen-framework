CREATE TABLE dbo.customer (
    customer_id   INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_customer PRIMARY KEY,
    display_name  NVARCHAR(200)     NOT NULL,
    created_at    DATETIME2(0)      NOT NULL CONSTRAINT df_customer_created_at DEFAULT SYSUTCDATETIME()
);

CREATE TABLE dbo.sales_order (
    sales_order_id INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_sales_order PRIMARY KEY,
    customer_id    INT               NOT NULL CONSTRAINT fk_sales_order_customer REFERENCES dbo.customer (customer_id),
    ordered_at     DATETIME2(0)      NOT NULL,
    order_status   VARCHAR(20)       NOT NULL CONSTRAINT ck_sales_order_status CHECK (order_status IN ('Open', 'Shipped', 'Cancelled')),
    total_amount   DECIMAL(12, 2)    NOT NULL
);

CREATE INDEX ix_sales_order_customer_ordered_at ON dbo.sales_order (customer_id, ordered_at);
