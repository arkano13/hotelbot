/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVA', 'FINALIZADA');

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVA';

-- CreateIndex
CREATE UNIQUE INDEX "conversations_codigo_key" ON "conversations"("codigo");

-- CreateIndex
CREATE INDEX "conversations_status_updatedAt_idx" ON "conversations"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "conversations_mode_idx" ON "conversations"("mode");
