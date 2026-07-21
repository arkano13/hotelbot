-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "escaladaEn" TIMESTAMP(3),
ADD COLUMN     "motivoEscalar" TEXT,
ADD COLUMN     "necesitaHumano" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Conversation_necesitaHumano_idx" ON "Conversation"("necesitaHumano");
