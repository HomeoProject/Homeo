#!/bin/bash

# Load authentication data from .env file
source .env

POSTGRES_CONTAINER_NAME="homeo-postgres"

drop_database() {
    local db_name="$1"
    echo "Dropping the $db_name database..."
    docker exec -i "$POSTGRES_CONTAINER_NAME" psql -U "$POSTGRES_USER" -c "DROP DATABASE IF EXISTS $db_name;"
    echo "The $db_name database has been dropped."
}

create_database() {
    local db_name="$1"
    echo "Creating the $db_name database..."
    docker exec -i "$POSTGRES_CONTAINER_NAME" psql -U "$POSTGRES_USER" -c "CREATE DATABASE $db_name;"
    echo "The $db_name database has been created."
}

if ! docker ps | grep -q "$POSTGRES_CONTAINER_NAME"; then
    echo "The Docker PostgreSQL container is not running."
    exit 1
fi

# Drop and recreate databases
drop_database "userservice"
drop_database "constructorservice"
drop_database "reviewservice"
drop_database "searchservice"
drop_database "chatservice"

create_database "userservice"
create_database "constructorservice"
create_database "reviewservice"
create_database "searchservice"
create_database "chatservice"

echo "All databases have been dropped and recreated."
