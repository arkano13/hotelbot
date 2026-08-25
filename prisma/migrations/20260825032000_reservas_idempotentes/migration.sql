-- Evita que el mismo intento de creación produzca más de una reserva.
-- NULL mantiene compatibilidad con reservas antiguas y clientes sin actualizar.
ALTER TABLE "reservas"
ADD COLUMN "idempotencyKey" TEXT;

CREATE UNIQUE INDEX "reservas_idempotencyKey_key"
ON "reservas"("idempotencyKey");
