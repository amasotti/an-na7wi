#!/bin/bash

set -euo pipefail

# Default values
CONTAINER_NAME="annahwi-postgres"
BACKUP_DIR="../database/backups"
DB_NAME="annahwi"
DB_USER="annahwi_user"
BACKUP_FILE=""

# List of tables to truncate and disable triggers on
TABLES=("annotations" "texts" "text_versions" "arabic_roots" "words" "dictionary_links" "training_sessions" "training_session_results" "word_progress_tracking" "annotation_words")

usage() {
    echo "Usage: $0 [-f FILENAME] | [-l]"
    echo "  -f, --file FILENAME    Specify backup file (relative to backup dir)"
    echo "  -l, --latest           Use latest backup (default if none specified)"
    exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
    case "$1" in
        -f|--file)
            BACKUP_FILE="$2"
            shift 2
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

# Default to latest if not specified
if [[ -z "$BACKUP_FILE" ]]; then
    BACKUP_FILE="${DB_NAME}_latest.sql"
    echo "No backup file specified, using latest."
fi

FULL_BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

if [[ ! -f "$FULL_BACKUP_PATH" ]]; then
    echo "Error: Backup file not found: $FULL_BACKUP_PATH"
    exit 1
fi

echo "Restoring ${DB_NAME} from: ${FULL_BACKUP_PATH}"
echo "Stopping application containers..."
# docker-compose stop backend frontend

# Build SQL to disable triggers
DISABLE_TRIGGERS=$(printf "ALTER TABLE public.%s DISABLE TRIGGER ALL;\n" "${TABLES[@]}")
ENABLE_TRIGGERS=$(printf "ALTER TABLE public.%s ENABLE TRIGGER ALL;\n" "${TABLES[@]}")
TRUNCATE=$(IFS=, ; echo "TRUNCATE TABLE public.${TABLES[*]} CASCADE;")

# Perform restore inside single transaction
{
    echo "BEGIN;"
    echo "$TRUNCATE"
    echo "$DISABLE_TRIGGERS"
    cat "$FULL_BACKUP_PATH"
    echo "$ENABLE_TRIGGERS"
    echo "COMMIT;"
} | docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" --set ON_ERROR_STOP=1

echo "Restore successful!"
echo "Restarting application containers..."
# docker-compose start backend frontend
exit 0
