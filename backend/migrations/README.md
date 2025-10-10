# Database Migrations Guide

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of the migration file
5. Paste into the SQL editor
6. Click **Run** or press `Ctrl+Enter`

### Option 2: Using psql Command Line

```bash
# From the backend directory
psql "postgresql://[USERNAME]:[PASSWORD]@[HOST]:5432/postgres" -f migrations/002_add_user_online_tracking.sql
```

### Option 3: Using Node.js Script

```bash
# From the backend directory
npm run migrate
```

---

## Available Migrations

### `001_initial_schema.sql`
Initial database schema with users, projects, tickets, activities, and otps tables.

**Status:** ✅ Already applied (in `database-schema.sql`)

### `002_add_user_online_tracking.sql`
Adds online/offline tracking columns to enable email notifications for offline users.

**Status:** ⏳ Ready to apply

**Changes:**
- Adds `last_seen` column to track user activity
- Adds `is_online` column to track Socket.io connection status
- Creates indexes for performance
- Updates existing users with current timestamp

---

## Migration Order

Migrations should be applied in numerical order:
1. `001_initial_schema.sql` ✅ (Already applied)
2. `002_add_user_online_tracking.sql` ⏳ (Apply now)

---

## Verification

After running a migration, verify the changes:

```sql
-- Check if columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('last_seen', 'is_online');

-- Check if indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users'
AND indexname LIKE '%last_seen%' OR indexname LIKE '%is_online%';

-- View updated users table structure
\d users;

-- Check sample data
SELECT id, email, last_seen, is_online
FROM users
LIMIT 5;
```

---

## Rollback

If you need to rollback migration `002`:

```sql
-- Remove indexes
DROP INDEX IF EXISTS idx_users_last_seen;
DROP INDEX IF EXISTS idx_users_is_online;

-- Remove columns
ALTER TABLE users DROP COLUMN IF EXISTS last_seen;
ALTER TABLE users DROP COLUMN IF EXISTS is_online;
```

---

## Best Practices

1. **Always backup** before running migrations
2. **Test in development** before production
3. **Run during low-traffic** periods if possible
4. **Verify changes** after migration
5. **Keep migration files** in version control

---

## Troubleshooting

### Error: "column already exists"
The migration uses `ADD COLUMN IF NOT EXISTS` so it's safe to re-run.

### Error: "index already exists"  
The migration uses `CREATE INDEX IF NOT EXISTS` so it's safe to re-run.

### Error: "permission denied"
Make sure your database user has `ALTER TABLE` permissions.

---

Last updated: October 10, 2025

