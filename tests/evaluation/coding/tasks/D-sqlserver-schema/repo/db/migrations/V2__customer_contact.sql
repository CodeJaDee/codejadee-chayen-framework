-- Email addresses and phone numbers live here, not on dbo.customer.
CREATE TABLE dbo.customer_contact (
    customer_contact_id INT IDENTITY(1,1) NOT NULL CONSTRAINT pk_customer_contact PRIMARY KEY,
    customer_id         INT               NOT NULL CONSTRAINT fk_customer_contact_customer REFERENCES dbo.customer (customer_id),
    contact_type        VARCHAR(10)       NOT NULL CONSTRAINT ck_customer_contact_type CHECK (contact_type IN ('email', 'phone')),
    contact_value       NVARCHAR(320)     NOT NULL,
    is_primary          BIT               NOT NULL CONSTRAINT df_customer_contact_is_primary DEFAULT 0
);
