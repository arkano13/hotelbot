-- Permite distinguir habitaciones sin aire y con precio propio.
ALTER TABLE "habitaciones"
ADD COLUMN "tieneAire" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "precioBase" DECIMAL(10, 2);

-- Agrega la habitación 10 como última alternativa por L 350.
INSERT INTO "habitaciones" (
  "id",
  "numero",
  "capacidad",
  "tieneAire",
  "precioBase",
  "estado",
  "activa",
  "createdAt",
  "updatedAt"
)
VALUES (
  '2eb1e8aa-c4a7-4d5c-9a4c-4ad58974d610',
  '10',
  1,
  false,
  350.00,
  'DISPONIBLE',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("numero") DO UPDATE
SET
  "capacidad" = EXCLUDED."capacidad",
  "tieneAire" = false,
  "precioBase" = 350.00,
  "activa" = true,
  "updatedAt" = CURRENT_TIMESTAMP;
