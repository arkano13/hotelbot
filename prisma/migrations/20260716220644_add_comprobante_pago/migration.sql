/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `pagos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "pagos" ADD COLUMN     "codigo" TEXT,
ADD COLUMN     "comprobanteUrl" TEXT,
ADD COLUMN     "motivoRechazo" TEXT,
ALTER COLUMN "proveedor" SET DEFAULT 'TRANSFERENCIA';

-- CreateIndex
CREATE UNIQUE INDEX "pagos_codigo_key" ON "pagos"("codigo");
