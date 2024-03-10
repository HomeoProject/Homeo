# A script to create databases in the local docker postgres instance, when any is not there, via volume.

#!/bin/bash

# Load authentication data from .env file
source .env

# Check if the Docker PostgreSQL container is running
if ! docker ps | grep -q "homeo-postgres"; then
    echo "The Docker PostgreSQL container is not running."
    exit 1
fi

# Check if the userservice database exists
if docker exec -it homeo-postgres psql -U "$POSTGRES_USER" -c '\l' | grep -q "userservice"; then
    echo "The userservice database already exists."
else
    echo "Creating the userservice database..."
    docker exec -it homeo-postgres psql -U "$POSTGRES_USER" -c "CREATE DATABASE userservice;"
    echo "The userservice database has been created."
fi

# Check if the constructorservice database exists
if docker exec -it homeo-postgres psql -U "$POSTGRES_USER" -c '\l' | grep -q "constructorservice"; then
    echo "The constructorservice database already exists."
else
    echo "Creating the constructorservice database..."
    docker exec -it homeo-postgres psql -U "$POSTGRES_USER" -c "CREATE DATABASE constructorservice;"
    echo "The constructorservice database has been created."
fi