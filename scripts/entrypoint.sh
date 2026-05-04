#!/bin/sh
set -e  # Stop on any error

echo "⏳ Waiting for database to be ready..."

# Wait for PostgreSQL to be ready using nc (netcat)
until nc -z $DB_HOST $DB_PORT; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "✅ Database is ready!"

# Run migrations
echo "🚀 Running migrations..."
npm run migrations:run

# Run seeds
echo "🌱 Running seeds..."
npm run seeds:run || echo "⚠️ Seeds may have already been applied"

# Execute the command passed to the container
exec "$@"
