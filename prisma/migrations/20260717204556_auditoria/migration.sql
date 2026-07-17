-- CreateTable
CREATE TABLE "auditoria" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidadId" TEXT,
    "detalle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "auditoria_accion_idx" ON "auditoria"("accion");

-- CreateIndex
CREATE INDEX "auditoria_entidad_entidadId_idx" ON "auditoria"("entidad", "entidadId");

-- CreateIndex
CREATE INDEX "auditoria_createdAt_idx" ON "auditoria"("createdAt");
