# Admin dashboard configuration

The admin endpoints are mounted at `/api/admin`. Configure these values in the
server's private environment before using the admin login:

- `ADMIN_USERNAME`: the permitted admin account name.
- `ADMIN_PASSWORD_HASH`: a bcrypt hash of the admin password.
- `JWT_SECRET`: a private signing secret of at least 32 characters.
- `CLIENT_ORIGIN`: optional frontend origin; defaults to
  `http://localhost:5173`.

Keep these values in the server's ignored `.env` file or deployment secret
store. Do not commit credentials, hashes, or signing secrets. Admin access
tokens expire after eight hours; the backend protects the profile,
registration-list, and CSV-export endpoints.
