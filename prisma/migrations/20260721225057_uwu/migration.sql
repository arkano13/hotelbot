-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "requiereAprobacion" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "reservas_requiereAprobacion_idx" ON "reservas"("requiereAprobacion");
