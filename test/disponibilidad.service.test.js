// test/disponibilidad.service.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMock = {
  habitacion: {
    findMany: vi.fn(),
  },
};

vi.mock("../src/lib/prisma.js", () => ({
  prisma: prismaMock,
}));

const {
  consultarDisponibilidad,
  consultarDisponibilidadMultiple,
} = await import("../src/disponibilidad/service.js");

const MAÑANA = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 10);
  return d.toISOString().slice(0, 10);
})();

const MAÑANA_MAS_2 = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 12);
  return d.toISOString().slice(0, 10);
})();

describe("consultarDisponibilidad (individual)", () => {
  beforeEach(() => vi.resetAllMocks());

  it("rechaza fecha de entrada en el pasado", async () => {
    await expect(
      consultarDisponibilidad({
        fechaEntrada: "2020-01-01",
        fechaSalida: "2020-01-02",
        personas: 1,
      })
    ).rejects.toThrow("La fecha de entrada no puede estar en el pasado");
  });

  it("rechaza salida igual a entrada (0 noches)", async () => {
    await expect(
      consultarDisponibilidad({
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA,
        personas: 1,
      })
    ).rejects.toThrow("La fecha de salida debe ser posterior a la entrada");
  });

  it("rechaza salida anterior a entrada", async () => {
    await expect(
      consultarDisponibilidad({
        fechaEntrada: MAÑANA_MAS_2,
        fechaSalida: MAÑANA,
        personas: 1,
      })
    ).rejects.toThrow("La fecha de salida debe ser posterior a la entrada");
  });

  it("rechaza 0 personas", async () => {
    await expect(
      consultarDisponibilidad({
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 0,
      })
    ).rejects.toThrow("La cantidad de personas debe ser 1, 2 o 3");
  });

  it("rechaza 4 personas (no existe tarifa individual para 4)", async () => {
    await expect(
      consultarDisponibilidad({
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 4,
      })
    ).rejects.toThrow("La cantidad de personas debe ser 1, 2 o 3");
  });

  it("retorna disponible:false si no hay habitaciones", async () => {
    prismaMock.habitacion.findMany.mockResolvedValue([]);

    const resultado = await consultarDisponibilidad({
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    expect(resultado.disponible).toBe(false);
    expect(resultado.habitacion).toBeNull();
  });

  it("retorna la primera habitación disponible", async () => {
    prismaMock.habitacion.findMany.mockResolvedValue([
      { id: "a", numero: "4", capacidad: 2 },
      { id: "b", numero: "5", capacidad: 2 },
    ]);

    const resultado = await consultarDisponibilidad({
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    expect(resultado.disponible).toBe(true);
    expect(resultado.totalDisponibles).toBe(2);
    expect(resultado.habitacion.numero).toBe("4");
  });
});

describe("consultarDisponibilidadMultiple (grupos 4+)", () => {
  beforeEach(() => vi.resetAllMocks());

  it("rechaza grupos menores a 4 personas", async () => {
    prismaMock.habitacion.findMany.mockResolvedValue([]);

    await expect(
      consultarDisponibilidadMultiple({
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 3,
      })
    ).rejects.toThrow("Esta consulta es para grupos de 4 personas o más");
  });

  it("distribuye 4 personas en habitaciones (suma debe dar 4)", async () => {
    prismaMock.habitacion.findMany.mockResolvedValue([
      { id: "r1", numero: "1", capacidad: 1 },
      { id: "r4", numero: "4", capacidad: 2 },
      { id: "r7", numero: "7", capacidad: 3 },
      { id: "r8", numero: "8", capacidad: 3 },
    ]);

    const resultado = await consultarDisponibilidadMultiple({
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 4,
    });

    expect(resultado.disponible).toBe(true);
    const sumaAsignada = resultado.distribucion.reduce((a, b) => a + b, 0);
    expect(sumaAsignada).toBe(4);
    // No debe repetir habitación
    const idsUsados = resultado.habitaciones.map((h) => h.id);
    expect(new Set(idsUsados).size).toBe(idsUsados.length);
  });

  it("distribuye 8 personas correctamente (3+3+2)", async () => {
    prismaMock.habitacion.findMany.mockResolvedValue([
      { id: "r4", numero: "4", capacidad: 2 },
      { id: "r7", numero: "7", capacidad: 3 },
      { id: "r8", numero: "8", capacidad: 3 },
    ]);

    const resultado = await consultarDisponibilidadMultiple({
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 8,
    });

    expect(resultado.disponible).toBe(true);
    const suma = resultado.distribucion.reduce((a, b) => a + b, 0);
    expect(suma).toBe(8);
    expect(resultado.habitaciones).toHaveLength(3);
  });

  it("retorna disponible:false si no alcanzan las habitaciones libres", async () => {
    prismaMock.habitacion.findMany.mockResolvedValue([
      { id: "r7", numero: "7", capacidad: 3 },
    ]);

    const resultado = await consultarDisponibilidadMultiple({
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 6,
    });

    expect(resultado.disponible).toBe(false);
    expect(resultado.habitaciones).toEqual([]);
  });

  it("no asigna dos veces la misma habitación aunque sobre capacidad", async () => {
    prismaMock.habitacion.findMany.mockResolvedValue([
      { id: "r7", numero: "7", capacidad: 3 },
    ]);

    const resultado = await consultarDisponibilidadMultiple({
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 4,
    });

    expect(resultado.disponible).toBe(false);
  });

  it("rechaza fechas invertidas", async () => {
    await expect(
      consultarDisponibilidadMultiple({
        fechaEntrada: MAÑANA_MAS_2,
        fechaSalida: MAÑANA,
        personas: 5,
      })
    ).rejects.toThrow("La fecha de salida debe ser posterior a la entrada");
  });
});