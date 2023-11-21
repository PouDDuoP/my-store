#!/bin/sh
set -e           # Stop on any error
# npx sequelize-cli db:migrate:undo --name 20231121160107-create-user utilizado para reversar una migracion creada por error
npm run migrations:run  # Run migrations
# npm run seed     # Preload initial data
exec "$@"
