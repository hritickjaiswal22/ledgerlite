-- CreateEnum
CREATE TYPE "TRANSACTION_TYPE" AS ENUM ('income', 'expense');

-- CreateTable
CREATE TABLE "currencies" (
    "id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "code" VARCHAR(3) NOT NULL,
    "symbol" VARCHAR(5) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "currencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "selected_currency_id" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "transaction_type" "TRANSACTION_TYPE" NOT NULL,
    "transaction_date" TIMESTAMPTZ(6) NOT NULL,
    "description" VARCHAR(512),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "month" SMALLINT NOT NULL,
    "year" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currencies_name_key" ON "currencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_code_key" ON "currencies"("code");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_symbol_key" ON "currencies"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_id_name_key" ON "accounts"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_user_id_name_key" ON "categories"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_user_id_category_id_month_year_key" ON "budgets"("user_id", "category_id", "month", "year");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_selected_currency_id_fkey" FOREIGN KEY ("selected_currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Account covering index
CREATE INDEX idx_accounts_user_covering
ON accounts(user_id)
INCLUDE (name, balance);

-- Category covering index
CREATE INDEX idx_categories_user_covering
ON categories(user_id)
INCLUDE (name);

-- Transaction amount check
ALTER TABLE transactions
ADD CONSTRAINT chk_transaction_amount
CHECK (amount >= 0);

-- Income partial index
CREATE INDEX idx_transactions_income
ON transactions(user_id, transaction_date, category_id)
INCLUDE (amount)
WHERE transaction_type = 'income';

-- Expense partial index
CREATE INDEX idx_transactions_expense
ON transactions(user_id, transaction_date, category_id)
INCLUDE (amount)
WHERE transaction_type = 'expense';

-- Budget amount check
ALTER TABLE budgets
ADD CONSTRAINT chk_budget_amount
CHECK (amount >= 0);

-- Budget month check
ALTER TABLE budgets
ADD CONSTRAINT chk_budget_month
CHECK (month BETWEEN 1 AND 12);

-- Budget covering index
CREATE INDEX idx_budgets_user_month_year
ON budgets(user_id, month, year)
INCLUDE (category_id, amount);
