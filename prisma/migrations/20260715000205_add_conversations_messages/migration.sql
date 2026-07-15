-- CreateEnum
CREATE TYPE "ConversationMode" AS ENUM ('BOT', 'HUMANO');

-- CreateEnum
CREATE TYPE "BookingStep" AS ENUM ('INICIO', 'PIDIENDO_FECHAS', 'PIDIENDO_PERSONAS', 'MOSTRANDO_DISPONIBILIDAD', 'ESPERANDO_CONFIRMACION', 'ESPERANDO_PAGO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'TOOL');

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "mode" "ConversationMode" NOT NULL DEFAULT 'BOT',
    "step" "BookingStep" NOT NULL DEFAULT 'INICIO',
    "nombreCliente" TEXT,
    "fechaEntrada" TIMESTAMP(3),
    "fechaSalida" TIMESTAMP(3),
    "cantidadPersonas" INTEGER,
    "reservaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "toolName" TEXT,
    "toolData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversations_telefono_key" ON "conversations"("telefono");

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
