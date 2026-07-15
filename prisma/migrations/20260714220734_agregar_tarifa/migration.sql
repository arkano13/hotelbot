-- CreateTable
CREATE TABLE "tarifas" (
    "id" TEXT NOT NULL,
    "personas" INTEGER NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tarifas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tarifas_personas_key" ON "tarifas"("personas");
