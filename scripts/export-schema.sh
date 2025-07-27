#!/bin/bash

# Script to backup the PostgreSQL database

# Default values
CONTAINER_NAME="annahwi-postgres"
BACKUP_DIR="../database/backups"
DB_NAME="annahwi"
DB_USER="annahwi_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SCHEMA_FILE="${BACKUP_DIR}/V1__schema_${TIMESTAMP}.sql"
SAMPLE_DATA_FILE="${BACKUP_DIR}/V2__sample_data_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Display backup information
echo "Backing up database schema ${DB_NAME} from container ${CONTAINER_NAME}..."
echo "Schema file: ${SCHEMA_FILE}"

# Execute the backup
docker exec ${CONTAINER_NAME} pg_dump -U ${DB_USER} -d ${DB_NAME} --schema-only --no-owner --no-privileges  --disable-triggers  > ${SCHEMA_FILE}

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully!"
    echo "Backup saved to: ${SCHEMA_FILE}"
else
    echo "Backup failed!"
    exit 1
fi

# -----------------------

# Create now a flyway like migration for sample data

echo "Backing up sample data from database ${DB_NAME}..."
echo "Sample data file: ${SAMPLE_DATA_FILE}"

# Execute the backup for sample data
docker exec ${CONTAINER_NAME} pg_dump -U ${DB_USER} -d ${DB_NAME} --data-only --inserts --no-owner --no-privileges  --disable-triggers  > ${SAMPLE_DATA_FILE}

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Sample data backup completed successfully!"
    echo "Sample data saved to: ${SAMPLE_DATA_FILE}"
else
    echo "Sample data backup failed!"
    exit 1
fi

exit 0
