#!/bin/bash

# Script to backup the PostgreSQL database

# Default values
CONTAINER_NAME="annahwi-postgres"
BACKUP_DIR="../database/backups"
DB_NAME="annahwi"
DB_USER="annahwi_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Display backup information
echo "Backing up database ${DB_NAME} from container ${CONTAINER_NAME}..."
echo "Backup file: ${BACKUP_FILE}"

# Execute the backup
docker exec ${CONTAINER_NAME} pg_dump -U ${DB_USER} -d ${DB_NAME} > ${BACKUP_FILE}

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully!"
    echo "Backup saved to: ${BACKUP_FILE}"
else
    echo "Backup failed!"
    exit 1
fi

# Create a 'latest' symlink for easy reference
ln -sf ${BACKUP_FILE} ${BACKUP_DIR}/${DB_NAME}_latest.sql
echo "Created symlink: ${BACKUP_DIR}/${DB_NAME}_latest.sql -> ${BACKUP_FILE}"

exit 0
