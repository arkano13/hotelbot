-- CreateTable
CREATE TABLE "configuracion_bot" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuracion_bot_pkey" PRIMARY KEY ("id")
);
