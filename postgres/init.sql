CREATE TABLE lists
(
    id SERIAL PRIMARY KEY,
    list_id VARCHAR(50) NOT NULL,
    list_name VARCHAR(50) NOT NULL,
    list_type VARCHAR(50) NOT NULL,
    user_uid VARCHAR(50),
    owner BOOLEAN
);
