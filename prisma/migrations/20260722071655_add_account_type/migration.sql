/*
  Warnings:

  - Added the required column `type` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ACCOUNT_TYPE" AS ENUM ('CASH', 'BANK', 'CREDIT_CARD');

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "type" "ACCOUNT_TYPE" NOT NULL;

-- AlterTable
ALTER TABLE "accounts"
ADD CONSTRAINT accounts_non_negative_balance
CHECK (
    (type IN ('CASH', 'BANK') AND balance >= 0)
    OR
    (type = 'CREDIT_CARD')
);
