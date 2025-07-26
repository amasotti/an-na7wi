# Database Backup & Restore

## Overview

The application uses PostgreSQL with Flyway migrations for schema management. The `database/init/` folder is now obsolete since Docker no longer mounts it - Flyway handles all schema creation.

## Daily Backup Workflow

### Before Stopping Work
```bash
cd scripts
./backup-db.sh
```

This creates a timestamped backup in `database/backups/` and maintains a `annahwi_latest.sql` symlink.

## Restore Options

### Restore from Latest Backup (Default)
```bash
cd scripts
./restore-db.sh
# or explicitly:
./restore-db.sh --latest
```

### Restore from Specific Backup
```bash
cd scripts
./restore-db.sh --file annahwi_20250726_180226.sql
```

## File Structure

- `database/backups/` - Contains all backup files (preserved)
- `database/init/` - **Can be removed** (no longer used by Docker)
- `backend/src/main/resources/db/migration/` - Flyway migrations (active)
- `scripts/backup-db.sh` - Creates database backup
- `scripts/restore-db.sh` - Restores from backup

## Notes

- Restore script automatically stops/starts backend and frontend containers
- Backups are standard PostgreSQL dumps compatible with `pg_dump`/`psql`
- Database schema is managed entirely by Flyway migrations
- The `database/backups/` folder remains mounted for persistence