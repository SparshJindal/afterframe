CREATE TABLE IF NOT EXISTS llm_daily_budget (
 day date PRIMARY KEY,
 requests integer NOT NULL DEFAULT 0 CHECK(requests>=0)
);
