/*
  Warnings:

  - You are about to drop the column `bankAccountId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `bankAccountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_bankAccountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_bankAccountId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "bankAccountId",
ALTER COLUMN "paymentMethod" SET DEFAULT 'promptpay';

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bankAccountId",
ALTER COLUMN "paymentMethod" SET DEFAULT 'promptpay';

-- DropTable
DROP TABLE "BankAccount";
