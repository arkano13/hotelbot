// test/tarifas.service.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMock = {
  tarifa: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
};

vi.mock("../src/lib/prisma.js", () => ({
  prisma: prismaMock,
}));

const { obtenerTarifaPorPersonas, obtenerTarifas } = await import(
  "../src/tarifas/service.js"
);

describe("obtenerTarifaPorPersonas", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rechaza 0 personas", async () => {
    await expect(obtenerTarifaPorPersonas(0)).rejects.toThrow(
      "La cantidad de personas debe ser 1, 2 o 3"
    );
  });

  it("rechaza 4 personas (fuera de rango de tarifa individual)", async () => {
    await expect(obtenerTarifaPorPersonas(4)).rejects.toThrow(
      "La cantidad de personas debe ser 1, 2 o 3"
    );
  });

  it("rechaza números no enteros", async () => {
    await expect(obtenerTarifaPorPersonas(1.5)).rejects.toThrow(
      "La cantidad de personas debe ser 1, 2 o 3"
    );
  });

  it("rechaza negativos", async () => {
    await expect(obtenerTarifaPorPersonas(-1)).rejects.toThrow(
      "La cantidad de personas debe ser 1, 2 o 3"
    );
  });

  it("rechaza valores no numéricos", async () => {
    await expect(obtenerTarifaPorPersonas("abc")).rejects.toThrow(
      "La cantidad de personas debe ser 1, 2 o 3"
    );
  });

  it("acepta strings numéricos válidos ('2')", async () => {
    prismaMock.tarifa.findUnique.mockResolvedValue({
      personas: 2,
      precio: 500,
      activa: true,
    });

    const tarifa = await obtenerTarifaPorPersonas("2");

    expect(tarifa.personas).toBe(2);
    expect(prismaMock.tarifa.findUnique).toHaveBeenCalledWith({
      where: { personas: 2 },
    });
  });

  it("lanza error si la tarifa no existe", async () => {
    prismaMock.tarifa.findUnique.mockResolvedValue(null);

    await expect(obtenerTarifaPorPersonas(3)).rejects.toThrow(
      "No existe una tarifa activa para 3 persona(s)"
    );
  });

  it("lanza error si la tarifa existe pero está inactiva", async () => {
    prismaMock.tarifa.findUnique.mockResolvedValue({
      personas: 1,
      precio: 300,
      activa: false,
    });

    await expect(obtenerTarifaPorPersonas(1)).rejects.toThrow(
      "No existe una tarifa activa para 1 persona(s)"
    );
  });

  it("retorna la tarifa activa correctamente", async () => {
    prismaMock.tarifa.findUnique.mockResolvedValue({
      personas: 3,
      precio: 700,
      activa: true,
    });

    const tarifa = await obtenerTarifaPorPersonas(3);

    expect(Number(tarifa.precio)).toBe(700);
  });
});

describe("obtenerTarifas", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("solo pide tarifas activas ordenadas por personas", async () => {
    prismaMock.tarifa.findMany.mockResolvedValue([]);

    await obtenerTarifas();

    expect(prismaMock.tarifa.findMany).toHaveBeenCalledWith({
      where: { activa: true },
      orderBy: { personas: "asc" },
    });
  });
});