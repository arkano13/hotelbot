/*
  Warnings:

  - You are about to drop the `conversations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- DropTable
DROP TABLE "conversations";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "mode" "ConversationMode" NOT NULL DEFAULT 'BOT',
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVA',
    "step" "BookingStep" NOT NULL DEFAULT 'INICIO',
    "nombreCliente" TEXT,
    "fechaEntrada" TIMESTAMP(3),
    "fechaSalida" TIMESTAMP(3),
    "cantidadPersonas" INTEGER,
    "reservaId" TEXT,
    "reservaIds" JSONB,
    "ultimaDisponibilidadAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_codigo_key" ON "Conversation"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_telefono_key" ON "Conversation"("telefono");

-- CreateIndex
CREATE INDEX "Conversation_status_idx" ON "Conversation"("status");

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

-- CreateIndex
CREATE INDEX "Conversation_mode_idx" ON "Conversation"("mode");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
