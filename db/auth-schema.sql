BEGIN;
CREATE TABLE IF NOT EXISTS auth_accounts (
 id uuid PRIMARY KEY,
 profile_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
 email text NOT NULL UNIQUE CHECK(length(email)<=254),
 password_hash text NOT NULL,
 display_name text NOT NULL CHECK(length(display_name) BETWEEN 2 AND 60),
 username text NOT NULL UNIQUE CHECK(username ~ '^[a-z0-9_]{3,24}$'),
 bio text NOT NULL DEFAULT '' CHECK(length(bio)<=500),
 email_verified_at timestamptz,
 credentials_version integer NOT NULL DEFAULT 1,
 created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS auth_sessions (
 token_hash text PRIMARY KEY,
 account_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 credentials_version integer NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),last_seen_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS auth_sessions_account ON auth_sessions(account_id);
CREATE TABLE IF NOT EXISTS auth_email_tokens (
 token_hash text PRIMARY KEY,
 account_id uuid NOT NULL REFERENCES auth_accounts(id) ON DELETE CASCADE,
 purpose text NOT NULL CHECK(purpose IN ('verify','reset')),
 expires_at timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS auth_rate_limits (
 key_hash text NOT NULL,scope text NOT NULL,window_start timestamptz NOT NULL,
 hits integer NOT NULL DEFAULT 1,PRIMARY KEY(key_hash,scope,window_start)
);
CREATE TABLE IF NOT EXISTS auth_mail_outbox (
 id uuid PRIMARY KEY,account_id uuid REFERENCES auth_accounts(id) ON DELETE CASCADE,
 encrypted_payload text NOT NULL,attempts integer NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),available_at timestamptz NOT NULL DEFAULT now(),
 locked_until timestamptz,sent_at timestamptz,last_error_code text
);
CREATE TABLE IF NOT EXISTS auth_audit (
 id uuid PRIMARY KEY,account_id uuid REFERENCES auth_accounts(id) ON DELETE SET NULL,
 event text NOT NULL,created_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
