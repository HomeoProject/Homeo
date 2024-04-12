# A script to create databases in the local docker postgres instance, when any is not there, via volume.

#!/bin/bash

# Load authentication data from .env file
source .env

POSTGRES_CONTAINER_NAME="homeo-postgres"

check_database() {
    local db_name="$1"
    if docker exec -i "$POSTGRES_CONTAINER_NAME" psql -U "$POSTGRES_USER" -lqt | cut -d \| -f 1 | grep -qw "$db_name"; then
        echo "The $db_name database already exists."
    else
        echo "Creating the $db_name database..."
        docker exec -i "$POSTGRES_CONTAINER_NAME" psql -U "$POSTGRES_USER" -c "CREATE DATABASE $db_name;"
        echo "The $db_name database has been created."
    fi
}

if ! docker ps | grep -q "$POSTGRES_CONTAINER_NAME"; then
    echo "The Docker PostgreSQL container is not running."
    exit 1
fi

# Create databases if they don't exist
check_database "userservice"
check_database "constructorservice"
check_database "reviewservice"
check_database "searchservice"
check_database "chatservice"
