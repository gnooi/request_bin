CRITICAL: DO NOT silently change production code. If a test exposes what appears to be a bug or design problem in production code, STOP and report the issue to me before modifying any production code.

Review the current backend codebase and create automated tests using Jest and Supertest.

Our backend uses:
- Express
- PostgreSQL
- MongoDB
- Jest for the test runner/unit tests
- Supertest for Express router/integration tests

Before changing anything:
1. Inspect the backend project structure, package.json, routes, controllers,
   middleware, database modules, and models.
2. Identify all currently implemented backend functionality.
3. Identify what should be covered by unit tests versus router/integration tests.
4. Follow the project's existing coding conventions and structure.

UNIT TESTS — Jest:
- Test controllers, middleware, utilities, and other testable business logic
  in isolation.
- Mock PostgreSQL and MongoDB dependencies.
- Do not connect to real databases for unit tests.
- Cover successful behavior, expected failures, and meaningful edge cases.
- Do not modify production behavior merely to make tests pass.

ROUTER / INTEGRATION TESTS — Jest + Supertest:
- Test the currently implemented Express endpoints through the Express app.
- Verify HTTP status codes and response bodies.
- Verify middleware/controller interactions where relevant.
- Test success cases, invalid input, authentication failures, missing
  resources, and other relevant error cases.
- Mock database dependencies unless a real database is explicitly necessary.
- Do not start a real HTTP server; test the Express app directly with Supertest.

TEST STRUCTURE:
- Keep unit tests and router/integration tests clearly separated.
- Use descriptive test and describe names.
- Avoid testing implementation details when observable behavior can be tested.
- Do not duplicate the same assertion unnecessarily between unit and router tests.

After implementation:
1. Run the entire Jest test suite.
2. Fix test-code problems you encounter.
3. Do NOT silently change production code to force tests to pass.
4. If you discover what appears to be a production bug, report it to me first.
5. Give me a summary of:
   - tests created
   - functionality covered
   - mocks used
   - passing/failing tests
   - functionality that still lacks coverage