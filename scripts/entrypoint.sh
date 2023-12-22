#!/bin/sh
set -e           # Stop on any error
# npx sequelize-cli db:migrate:undo --name 20231121160107-create-user utilizado para reversar una migracion creada por error
# npm run migrations:revert --name 20231121203812-add-profile.js
# npm run migrations:delete  # Run undo all migrations

# TODO: queda pendiente por verificar ya que se agregaron estas lienas de bcrypt para solucionar un error pero no deberia quedar asi.
# uninstall the current bcrypt modules
npm uninstall bcrypt
# install the bcrypt modules for the machine
npm install bcrypt

npm run migrations:run  # Run migrations
# npm run seed     # Preload initial data
exec "$@"
