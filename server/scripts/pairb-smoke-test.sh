#!/usr/bin/env bash
# Manual smoke test for Pair B's routes (webhook capture + request listing).
# No automated Jest coverage exists for these routes yet — see server/README.md.
#
# Assumes a freshly seeded DB: request ids 1-6 come from seed.sql / seed-mongo.js
# (RESTART IDENTITY on each boot). If you've POSTed extra webhooks manually since
# the last boot, re-seed first:
#   docker compose down -v && docker compose up -d --build
#
# Usage: BASE_URL=http://localhost:3000 ./pairb-smoke-test.sh

set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
PASS=0
FAIL=0

# check DESCRIPTION EXPECTED_STATUS  curl-args...
check() {
  local desc="$1" expected="$2"
  shift 2

  local tmp status
  tmp="$(mktemp)"
  status="$(curl -s -o "$tmp" -w '%{http_code}' "$@")"

  if [ "$status" = "$expected" ]; then
    echo "PASS [$status] $desc"
    PASS=$((PASS + 1))
  else
    echo "FAIL [$status, expected $expected] $desc"
    FAIL=$((FAIL + 1))
  fi
  sed 's/^/    /' "$tmp"
  rm -f "$tmp"
}

echo "== 1. ALL /:url_endpoint — webhook capture =="

check "POST JSON body to existing bin" 200 \
  -X POST "$BASE_URL/bin_a1b2c3d4" \
  -H "Content-Type: application/json" \
  -d '{"event":"test.ping","value":42}'

check "GET on empty bin (any method accepted)" 200 \
  "$BASE_URL/bin_m3n4o5p6"

check "PUT with form-encoded body" 200 \
  -X PUT "$BASE_URL/bin_e5f6g7h8" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d 'foo=bar&baz=qux'

check "DELETE with no body" 200 \
  -X DELETE "$BASE_URL/bin_i9j0k1l2"

check "POST to unknown bin -> 404" 404 \
  -X POST "$BASE_URL/does_not_exist" -d '{}'

echo
echo "== 2. GET /api/bins/:url_endpoint/requests =="

check "List requests for bin with data" 200 \
  "$BASE_URL/api/bins/bin_a1b2c3d4/requests"

check "List requests for bin with none -> []" 200 \
  "$BASE_URL/api/bins/bin_m3n4o5p6/requests"

check "List requests for unknown bin -> 404" 404 \
  "$BASE_URL/api/bins/does_not_exist/requests"

echo
echo "== 3. GET /api/bins/:url_endpoint/requests/:id/raw =="

check "Raw payload for existing request" 200 \
  "$BASE_URL/api/bins/bin_a1b2c3d4/requests/2/raw"

check "Raw payload, id does not exist -> 404" 404 \
  "$BASE_URL/api/bins/bin_a1b2c3d4/requests/9999/raw"

check "Raw payload, non-integer id -> 404" 404 \
  "$BASE_URL/api/bins/bin_a1b2c3d4/requests/abc/raw"

check "Raw payload, id belongs to a different bin -> 404" 404 \
  "$BASE_URL/api/bins/bin_a1b2c3d4/requests/4/raw"

check "Raw payload, unknown bin -> 404" 404 \
  "$BASE_URL/api/bins/does_not_exist/requests/1/raw"

echo
echo "-----------------------------------"
echo "PASS: $PASS   FAIL: $FAIL"
[ "$FAIL" -eq 0 ]
