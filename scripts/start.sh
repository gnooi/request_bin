#!/bin/bash
set -e

psql -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'request_db'" \
  | grep -q 1 || createdb request_db

psql -d request_db -f server/src/db/schema.sql

cd server
npm start