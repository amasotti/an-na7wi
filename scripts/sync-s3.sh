#!/bin/bash
set -euo pipefail

usage() {
    echo "Usage: $0 [LOCAL_DIR] [PROFILE] [--delete]"
    echo
    echo "  LOCAL_DIR   Local backup directory (default: ../database/backups)"
    echo "  PROFILE     AWS CLI profile (default: default)"
    echo "  --delete    Optional flag to remove files in S3 that don't exist locally"
    exit 1
}

# Defaults
LOCAL_DIR="../database/backups"
PROFILE="default"
DELETE_OPTION=""

# Parse args
for arg in "$@"; do
    case "$arg" in
        --delete)
            DELETE_OPTION="--delete"
            ;;
        --help)
            usage
            ;;
        *)
            if [[ -z "$LOCAL_DIR_SET" ]]; then
                LOCAL_DIR="$arg"
                LOCAL_DIR_SET=1
            elif [[ -z "$PROFILE_SET" ]]; then
                PROFILE="$arg"
                PROFILE_SET=1
            else
                echo "Error: Too many arguments"
                usage
            fi
            ;;
    esac
done

S3_BUCKET="s3://am-annahwi/db-backups"

# Validate local dir
if [[ ! -d "$LOCAL_DIR" ]]; then
    echo "Error: Local directory '$LOCAL_DIR' does not exist."
    exit 1
fi

if [[ "$DELETE_OPTION" == "--delete" ]]; then
    echo "Delete flag detected: Remote files not in '$LOCAL_DIR' will be removed."
fi

echo "Syncing '$LOCAL_DIR' to '$S3_BUCKET' with profile '$PROFILE'..."
aws s3 sync "$LOCAL_DIR" "$S3_BUCKET" $DELETE_OPTION --profile "$PROFILE"
echo "Sync completed."
