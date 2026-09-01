# 1. Clone (skip if you already have it)
git clone <repo-url>
cd request_bin

# 2. Get the integration branch
git fetch origin
git checkout integration-test

# 3. Set up environment
cp .env.example .env
# Edit .env if any values need to be real (check with me if unsure)

# 4. Build and start
docker compose up -d --build

# 5. Watch logs to confirm it booted clean
docker compose logs -f server
# Look for: PostgreSQL connected / MongoDB connected / Server running on port: 3000

# 6. Quick smoke test
curl -i http://localhost:3000/
curl -i http://localhost:3000/api/bins -H "Authorization: Bearer usr_tok_8f3a1c2b9e4d"

# 7. Run the test suite
docker compose exec server npm test