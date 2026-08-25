-- Agrega la habitación 10 (sin aire acondicionado).
-- El precio se asigna manualmente al reservar u ocupar; el recomendado es L 350.
INSERT INTO "habitaciones" (
  "id",
  "numero",
  "capacidad",
  "estado",
  "activa",
  "createdAt",
  "updatedAt"
)
VALUES (
  '2eb1e8aa-c4a7-4d5c-9a4c-4ad58974d610',
  '10',
  1,
  'DISPONIBLE',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("numero") DO UPDATE
SET
  "capacidad" = EXCLUDED."capacidad",
  "activa" = true,
  "updatedAt" = CURRENT_TIMESTAMP;
