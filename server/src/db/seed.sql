-- Seed data for Request Bin
-- Run after creating the users, bins, and requests tables

BEGIN;

-- Clear existing data (safe for repeated seeding in dev)
TRUNCATE TABLE requests, bins, users RESTART IDENTITY CASCADE;

-- ============
-- Users
-- ============
INSERT INTO users (token) VALUES
	('usr_tok_8f3a1c2b9e4d'),   -- id 1
	('usr_tok_1b7e9f2a3c5d'),   -- id 2
	('usr_tok_4d2c8a1f6b9e');   -- id 3

-- ============
-- Bins
-- ============
INSERT INTO bins (user_id, bin_name, created_at, request_count) VALUES
	(1, 'bin_a1b2c3d4', NOW() - INTERVAL '3 days', 3),   -- id 1
	(1, 'bin_e5f6g7h8', NOW() - INTERVAL '1 day',  1),   -- id 2
	(2, 'bin_i9j0k1l2', NOW() - INTERVAL '6 hours',2),   -- id 3
	(3, 'bin_m3n4o5p6', NOW(),                     0);   -- id 4

-- ============
-- Requests
-- ============

-- Requests for bin 1 (bin_a1b2c3d4)
INSERT INTO requests (bin_id, method, path, headers, body, received_at) VALUES
	(1, 'GET', '/', '{"host":"bin_a1b2c3d4.requestbin.io","user-agent":"curl/8.4.0","accept":"*/*"}', NULL, NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),
	(1, 'POST', '/webhook', '{"host":"bin_a1b2c3d4.requestbin.io","content-type":"application/json","user-agent":"PostmanRuntime/7.36.0"}', '{"event":"payment.succeeded","amount":2599,"currency":"usd"}', NOW() - INTERVAL '3 days' + INTERVAL '10 minutes'),
	(1, 'PUT', '/webhook/1234', '{"host":"bin_a1b2c3d4.requestbin.io","content-type":"application/json"}', '{"status":"updated"}', NOW() - INTERVAL '2 days');

-- Requests for bin 2 (bin_e5f6g7h8)
INSERT INTO requests (bin_id, method, path, headers, body, received_at) VALUES
	(2, 'POST', '/notify', '{"host":"bin_e5f6g7h8.requestbin.io","content-type":"application/x-www-form-urlencoded"}', 'event=deploy&status=success', NOW() - INTERVAL '1 day' + INTERVAL '30 minutes');

-- Requests for bin 3 (bin_i9j0k1l2)
INSERT INTO requests (bin_id, method, path, headers, body, received_at) VALUES
	(3, 'GET', '/health', '{"host":"bin_i9j0k1l2.requestbin.io","user-agent":"kube-probe/1.29"}', NULL, NOW() - INTERVAL '5 hours'),
	(3, 'DELETE', '/resource/42', '{"host":"bin_i9j0k1l2.requestbin.io","authorization":"Bearer redacted"}', NULL, NOW() - INTERVAL '1 hour');

-- bin 4 (bin_m3n4o5p6) intentionally has no requests yet

COMMIT;