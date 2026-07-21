// test/pagos.service.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

const txMock = {
  pago: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  reserva: {
    update: vi.fn(),
    findFirst: vi.fn(),
  },
  habitacion: {
    findMany: vi.fn(),
  },
};

const prismaMock = {
  $transaction: vi.fn((fn) => fn(txMock)),
  pago: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  reserva: {
    findUnique: vi.fn(),
  },
};

vi.mock("../src/lib/prisma.js", () => ({
  prisma: prismaMock,
}));

vi.mock("../src/auditoria/service.js", () => ({
  registrarAuditoria: vi.fn(),
}));

const {
  aprobarPagoPorCodigo,
  rechazarPagoPorCodigo,
  obtenerPagoPorCodigo,
} = await import("../src/pagos/service.js");

function pagoBase(overrides = {}) {
  return {
    id: "pago-1",
    codigo: "P1234",
    estado: "PENDIENTE",
    reservaId: "res-1",
    reserva: {
      id: "res-1",
      codigo: "RES-2027-000001",
      estado: "PENDIENTE_PAGO",
      habitacionId: "hab-1",
      cantidadPersonas: 2,
      fechaEntrada: new Date("2027-01-10"),
      fechaSalida: new Date("2027-01-12"),
      cliente: { id: "cli-1", nombre: "Juan Pérez" },
      habitacion: { id: "hab-1", numero: "4", capacidad: 2 },
    },
    ...overrides,
  };
}

describe("aprobarPagoPorCodigo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation((fn) => fn(txMock));
  });

  it("rechaza aprobar un pago que ya fue aprobado (evita doble aprobación)", async () => {
    const pago = pagoBase({ estado: "APROBADO" });
    prismaMock.pago.findUnique.mockResolvedValue(pago);
    txMock.pago.findUnique.mockResolvedValue(pago);

    await expect(aprobarPagoPorCodigo("P1234")).rejects.toThrow(
      "Este pago ya fue aprobado anteriormente"
    );

    expect(txMock.reserva.update).not.toHaveBeenCalled();
  });

  it("rechaza aprobar el pago de una reserva cancelada", async () => {
    const pago = pagoBase({
      reserva: { ...pagoBase().reserva, estado: "CANCELADA" },
    });
    prismaMock.pago.findUnique.mockResolvedValue(pago);
    txMock.pago.findUnique.mockResolvedValue(pago);

    await expect(aprobarPagoPorCodigo("P1234")).rejects.toThrow(
      "La reserva está en estado CANCELADA y el pago no puede aprobarse"
    );
  });

  it("rechaza aprobar si ya no hay habitación disponible (llegó tarde)", async () => {
    const pago = pagoBase();
    prismaMock.pago.findUnique.mockResolvedValue(pago);
    txMock.pago.findUnique.mockResolvedValue(pago);
    txMock.habitacion.findMany.mockResolvedValue([]);

    await expect(aprobarPagoPorCodigo("P1234")).rejects.toThrow(
      "El pago llegó tarde y ya no hay una habitación disponible"
    );

    expect(txMock.reserva.update).not.toHaveBeenCalled();
  });

  it("aprueba correctamente y confirma la reserva en la misma habitación si sigue libre", async () => {
    const pago = pagoBase();
    prismaMock.pago.findUnique.mockResolvedValue(pago);
    txMock.pago.findUnique.mockResolvedValue(pago);
    txMock.habitacion.findMany.mockResolvedValue([
      { id: "hab-1", numero: "4", capacidad: 2 },
    ]);
    txMock.reserva.findFirst.mockResolvedValue(null);
    txMock.pago.update.mockResolvedValue({ ...pago, estado: "APROBADO" });
    txMock.reserva.update.mockResolvedValue({
      ...pago.reserva,
      estado: "CONFIRMADA",
      habitacion: { id: "hab-1", numero: "4" },
    });

    const resultado = await aprobarPagoPorCodigo("P1234");

    expect(resultado.reasignada).toBe(false);
    expect(txMock.reserva.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ habitacionId: "hab-1", estado: "CONFIRMADA" }),
      })
    );
  });

  it("reasigna a otra habitación libre si la original ya no está disponible", async () => {
    const pago = pagoBase();
    prismaMock.pago.findUnique.mockResolvedValue(pago);
    txMock.pago.findUnique.mockResolvedValue(pago);
    txMock.habitacion.findMany.mockResolvedValue([
      { id: "hab-1", numero: "4", capacidad: 2 },
      { id: "hab-2", numero: "5", capacidad: 2 },
    ]);
    txMock.reserva.findFirst.mockImplementation(({ where }) => {
      if (where.habitacionId === "hab-1") return Promise.resolve({ id: "conflicto" });
      return Promise.resolve(null);
    });
    txMock.pago.update.mockResolvedValue({ ...pago, estado: "APROBADO" });
    txMock.reserva.update.mockResolvedValue({
      ...pago.reserva,
      habitacionId: "hab-2",
      estado: "CONFIRMADA",
      habitacion: { id: "hab-2", numero: "5" },
    });

    const resultado = await aprobarPagoPorCodigo("P1234");

    expect(resultado.reasignada).toBe(true);
    expect(txMock.reserva.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ habitacionId: "hab-2" }),
      })
    );
  });

  it("lanza error si el código de pago no existe", async () => {
    prismaMock.pago.findUnique.mockResolvedValue(null);

    await expect(aprobarPagoPorCodigo("P0000")).rejects.toThrow(
      "Pago no encontrado"
    );
  });
});

describe("rechazarPagoPorCodigo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation((fn) => fn(txMock));
  });

  it("no permite rechazar un pago ya aprobado", async () => {
    const pago = pagoBase({ estado: "APROBADO" });
    prismaMock.pago.findUnique.mockResolvedValue(pago);

    await expect(rechazarPagoPorCodigo("P1234", "motivo")).rejects.toThrow(
      "Este pago ya fue aprobado, no se puede rechazar"
    );
  });

  it("al rechazar, extiende expiraEn otros 30 min si la reserva sigue pendiente de pago", async () => {
    const pago = pagoBase();
    prismaMock.pago.findUnique.mockResolvedValue(pago);
    txMock.reserva.update.mockResolvedValue(pago.reserva);
    txMock.pago.update.mockResolvedValue({
      ...pago,
      estado: "RECHAZADO",
      reserva: pago.reserva,
    });

    await rechazarPagoPorCodigo("P1234", "comprobante ilegible");

    expect(txMock.reserva.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "res-1" },
        data: expect.objectContaining({ expiraEn: expect.any(Date) }),
      })
    );
  });

  it("usa un motivo por defecto si no se especifica", async () => {
    const pago = pagoBase();
    prismaMock.pago.findUnique.mockResolvedValue(pago);
    txMock.reserva.update.mockResolvedValue(pago.reserva);
    txMock.pago.update.mockResolvedValue({
      ...pago,
      estado: "RECHAZADO",
      motivoRechazo: "Sin motivo especificado",
      reserva: pago.reserva,
    });

    await rechazarPagoPorCodigo("P1234", "");

    expect(txMock.pago.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          motivoRechazo: "Sin motivo especificado",
        }),
      })
    );
  });
});

describe("obtenerPagoPorCodigo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("normaliza el código a mayúsculas y sin espacios", async () => {
    prismaMock.pago.findUnique.mockResolvedValue(pagoBase());

    await obtenerPagoPorCodigo("  p1234 ");

    expect(prismaMock.pago.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { codigo: "P1234" } })
    );
  });

  it("rechaza código vacío", async () => {
    await expect(obtenerPagoPorCodigo("   ")).rejects.toThrow(
      "El código de pago es obligatorio"
    );
  });
});