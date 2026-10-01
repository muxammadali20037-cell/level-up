import { TEST_DATABASE_URL } from "./test-db-url";

process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.SESSION_SECRET ??= "test-session-secret-0123456789abcdef0123456789";
process.env.HASH_SALT ??= "test-hash-salt-0123456789";
process.env.APP_URL ??= "http://localhost:3000";
process.env.PAYMENTS_MOCK_ENABLED ??= "true";
