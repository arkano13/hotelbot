import { describe, it, expect, vi, beforeEach } from "vitest";

const prismaMock = {
  reserva: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("../src/lib/prisma.js", () => ({
  prisma: prismaMock,
}));

vi.mock("../src/auditoria/service.js", () => ({
  registrarAuditoria: vi.fn(),
}));

const { registrarCheckInPorHabitacion } = await import(
  "../src/reservas/service.js"
);

function reservaBase(overrides = {}) {
  return {
    id: "res-1",
    codigo: "RES-2027-000001",
    estado: "CONFIRMADA",
    habitacion: { id: "hab-1", numero: "5" },
    cliente: { id: "cli-1", nombre: "Juan Pérez" },
    pago: null,
    ...overrides,
  };
}

describe("registrarCheckInPorHabitacion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hace check-in normal de una reserva CONFIRMADA (transferencia ya aprobada)", async () => {
    prismaMock.reserva.findFirst.mockResolvedValue(reservaBase());
    prismaMock.reserva.update.mockResolvedValue({
      ...reservaBase(),
      estado: "CHECK_IN",
    });

    const resultado = await registrarCheckInPorHabitacion("hab-1");

    expect(resultado.estado).toBe("CHECK_IN");
    // No debe tocar el pago si ya estaba confirmada por transferencia
    const datosUpdate = prismaMock.reserva.update.mock.calls[0][0].data;
    expect(datosUpdate.pago).toBeUndefined();
  });

  it("hace check-in de una reserva en EFECTIVO aún PENDIENTE_PAGO y la marca como pagada", async () => {
    prismaMock.reserva.findFirst.mockResolvedValue(
      reservaBase({
        estado: "PENDIENTE_PAGO",
        pago: { id: "pago-1", proveedor: "EFECTIVO", estado: "PENDIENTE" },
      })
    );
    prismaMock.reserva.update.mockResolvedValue({
      ...reservaBase(),
      estado: "CHECK_IN",
    });

    const resultado = await registrarCheckInPorHabitacion("hab-1");

    expect(resultado.estado).toBe("CHECK_IN");

    const datosUpdate = prismaMock.reserva.update.mock.calls[0][0].data;
    expect(datosUpdate.estado).toBe("CHECK_IN");
    expect(datosUpdate.pago).toEqual({
      update: { estado: "APROBADO", fechaPago: expect.any(Date) },
    });
  });

  it("NO hace check-in de una reserva PENDIENTE_PAGO por transferencia (sin aprobar todavía)", async () => {
    // findFirst con el filtro real no la encontraría porque no es CONFIRMADA
    // ni (PENDIENTE_PAGO + EFECTIVO) — se simula ese comportamiento con null.
    prismaMock.reserva.findFirst.mockResolvedValue(null);

    await expect(
      registrarCheckInPorHabitacion("hab-1")
    ).rejects.toThrow("No hay reserva confirmada para esa habitación.");

    expect(prismaMock.reserva.update).not.toHaveBeenCalled();
  });

  it("consulta con el filtro correcto: CONFIRMADA o (PENDIENTE_PAGO + EFECTIVO)", async () => {
    prismaMock.reserva.findFirst.mockResolvedValue(reservaBase());
    prismaMock.reserva.update.mockResolvedValue({
      ...reservaBase(),
      estado: "CHECK_IN",
    });

    await registrarCheckInPorHabitacion("hab-1");

    const filtro = prismaMock.reserva.findFirst.mock.calls[0][0].where;
    expect(filtro.OR).toEqual([
      { estado: "CONFIRMADA" },
      { estado: "PENDIENTE_PAGO", pago: { proveedor: "EFECTIVO" } },
    ]);
  });

  it("limpia expiraEn al hacer check-in (ya no debe expirar sola)", async () => {
    prismaMock.reserva.findFirst.mockResolvedValue(reservaBase());
    prismaMock.reserva.update.mockResolvedValue({
      ...reservaBase(),
      estado: "CHECK_IN",
    });

    await registrarCheckInPorHabitacion("hab-1");

    const datosUpdate = prismaMock.reserva.update.mock.calls[0][0].data;
    expect(datosUpdate.expiraEn).toBeNull();
  });
});