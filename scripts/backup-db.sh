#!/bin/bash

set -euo pipefail

# Config
CONTAINER_NAME="annahwi-postgres"
BACKUP_DIR="../database/backups"
DB_NAME="annahwi"
DB_USER="annahwi_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"

# Tables to include
TABLES=("annotations" "texts" "text_versions" "arabic_roots" "words" "dictionary_links" "training_sessions" "training_session_results" "word_progress_tracking")

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "Backing up tables from ${DB_NAME} in ${CONTAINER_NAME}..."
echo "Backup file: ${BACKUP_FILE}"

# Construct table arguments
TABLE_ARGS=()
for table in "${TABLES[@]}"; do
  TABLE_ARGS+=(--table="public.${table}")
done


# Run pg_dump
docker exec "${CONTAINER_NAME}" pg_dump \
    -U "${DB_USER}" \
    -d "${DB_NAME}" \
    --data-only \
    --column-inserts \
    --no-owner \
    --disable-triggers \
    "${TABLE_ARGS[@]}" > "${BACKUP_FILE}"


echo "Backup completed successfully: ${BACKUP_FILE}"
