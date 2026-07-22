-- Account covering index
CREATE INDEX idx_accounts_user_covering
ON accounts(user_id)
INCLUDE (name, balance);

-- Category covering index
CREATE INDEX idx_categories_user_covering
ON categories(user_id)
INCLUDE (name);

-- Budget covering index
CREATE INDEX idx_budgets_user_month_year
ON budgets(user_id, month, year)
INCLUDE (category_id, amount);