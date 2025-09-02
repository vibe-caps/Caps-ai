# Auth

Mongo-based auth with Argon2 hashing and JWT access/refresh tokens. Sessions stored in Mongo. Email verification and password reset tokens.

Fallback: set `MONGO_AUTH_DISABLED=true` to switch to Clerk in the web app (not enabled by default in this scaffold).
