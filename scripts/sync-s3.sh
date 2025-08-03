#!/bin/bash
set -euo pipefail

LOCAL_DIR="${1:-../database/backups}"
PROFILE="${2:-default}"
S3_BUCKET="s3://am-annahwi/db-backups"

echo "Syncing $LOCAL_DIR to $S3_BUCKET ..."
aws s3 sync "$LOCAL_DIR" "$S3_BUCKET" --delete --profile "$PROFILE"
echo "Sync completed."
