#!/bin/bash

# Script to restore the PostgreSQL database from a backup

# Default values
CONTAINER_NAME="annahwi-postgres"
BACKUP_DIR="../database/backups"
DB_NAME="annahwi"
DB_USER="annahwi_user"
BACKUP_FILE=""

# Function to display usage information
usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  -f, --file FILENAME    Specify backup file to restore (relative to backup directory)"
    echo "  -l, --latest           Restore from the latest backup (default if no file specified)"
    echo "  -h, --help             Display this help message"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    key="$1"
    case $key in
        -f|--file)
            BACKUP_FILE="$2"
            shift
            shift
            ;;
        -l|--latest)
            BACKUP_FILE="${DB_NAME}_latest.sql"
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# If no backup file specified, use the latest
if [ -z "$BACKUP_FILE" ]; then
    BACKUP_FILE="${DB_NAME}_latest.sql"
    echo "No backup file specified, using latest backup."
fi

# Full path to the backup file
FULL_BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

# Check if backup file exists
if [ ! -f "$FULL_BACKUP_PATH" ]; then
    echo "Error: Backup file not found: $FULL_BACKUP_PATH"
    exit 1
fi

echo "Restoring database ${DB_NAME} from backup: ${FULL_BACKUP_PATH}"

# Stop the application containers to avoid conflicts
echo "Stopping application containers..."
docker-compose stop backend frontend

# Restore the database
echo "Restoring database..."
cat ${FULL_BACKUP_PATH} | docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} -d ${DB_NAME}

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "Database restore completed successfully!"
else
    echo "Database restore failed!"
    echo "Restarting application containers..."
    docker-compose start backend frontend
    exit 1
fi

# Restart the application containers
echo "Restarting application containers..."
docker-compose start backend frontend

echo "Restore process completed."
exit 0
