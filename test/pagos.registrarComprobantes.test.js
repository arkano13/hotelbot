import { describe, it, expect, vi, beforeEach } from "vitest";

const txMock = {
  reserva: {
    findMany: vi.fn(),
    update: vi.fn(),
  },
  pago: {
    create: vi.fn(),
    update: vi.fn(),
    findUnique: vi.fn(),
  },
};

const prismaMock = {
  $transaction: vi.fn((fn) => fn(txMock)),
};

vi.mock("../src/lib/prisma.js", () => ({
  prisma: prismaMock,
}));

vi.mock("../src/auditoria/service.js", () => ({
  registrarAuditoria: vi.fn(),
}));

const { registrarComprobantes, registrarComprobante } = await import(
  "../src/pagos/service.js"
);

function reserva(id, overrides = {}) {
  return {
    id,
    codigo: `RES-${id}`,
    estado: "PENDIENTE_PAGO",
    expiraEn: new Date(Date.now() + 10 * 60 * 1000),
    precioTotal: 1000,
    pago: null,
    cliente: { id: "cli-1", nombre: "Juan" },
    habitacion: { id: `hab-${id}`, numero: id },
    ...overrides,
  };
}

describe("registrarComprobantes (reserva múltiple / grupos)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.$transaction.mockImplementation((fn) => fn(txMock));
    txMock.pago.findUnique.mockResolvedValue(null); // códigos siempre libres en el mock
    let contadorPago = 0;
    txMock.pago.create.mockImplementation(({ data }) => {
      contadorPago += 1;
      return Promise.resolve({
        id: `pago-${contadorPago}`,
        estado: "NO_GENERADO",
        codigo: null,
        ...data,
      });
    });
    txMock.pago.update.mockImplementation(({ where, data }) =>
      Promise.resolve({ id: where.id, ...data })
    );
  });

  it("rechaza si no se manda ninguna reserva", async () => {
    await expect(
      registrarComprobantes({ reservaIds: [], comprobanteUrl: "url" })
    ).rejects.toThrow("No se indicó ninguna reserva");
  });

  it("rechaza si alguna reserva no existe", async () => {
    txMock.reserva.findMany.mockResolvedValue([reserva("1")]);

    await expect(
      registrarComprobantes({
        reservaIds: ["1", "2"],
        comprobanteUrl: "url",
      })
    ).rejects.toThrow("Una o más reservas no fueron encontradas");
  });

  it("rechaza TODO el grupo si una sola reserva ya no puede recibir comprobante", async () => {
    txMock.reserva.findMany.mockResolvedValue([
      reserva("1"),
      reserva("2", { estado: "CANCELADA" }),
    ]);

    await expect(
      registrarComprobantes({
        reservaIds: ["1", "2"],
        comprobanteUrl: "url",
      })
    ).rejects.toThrow("La reserva RES-2 ya no puede recibir comprobantes");

    // No debe haber quedado ninguna reserva del grupo a medio actualizar
    expect(txMock.pago.update).not.toHaveBeenCalled();
  });

  it("rechaza TODO el grupo si una de las reservas ya tiene pago aprobado", async () => {
    txMock.reserva.findMany.mockResolvedValue([
      reserva("1"),
      reserva("2", { pago: { estado: "APROBADO" } }),
    ]);

    await expect(
      registrarComprobantes({
        reservaIds: ["1", "2"],
        comprobanteUrl: "url",
      })
    ).rejects.toThrow("El pago de RES-2 ya fue aprobado");
  });

  it("crea/actualiza un pago PENDIENTE por cada reserva del grupo con la misma URL de comprobante", async () => {
    txMock.reserva.findMany.mockResolvedValue([reserva("1"), reserva("2")]);

    const pagos = await registrarComprobantes({
      reservaIds: ["1", "2"],
      comprobanteUrl: "http://x/comprobante.jpg",
    });

    expect(pagos).toHaveLength(2);
    expect(txMock.pago.create).toHaveBeenCalledTimes(2);
    expect(txMock.pago.update).toHaveBeenCalledTimes(2);

    for (const llamada of txMock.pago.update.mock.calls) {
      expect(llamada[0].data.comprobanteUrl).toBe("http://x/comprobante.jpg");
      expect(llamada[0].data.estado).toBe("PENDIENTE");
    }
  });

  it("no duplica ids repetidos en reservaIds", async () => {
    txMock.reserva.findMany.mockResolvedValue([reserva("1")]);

    await registrarComprobantes({
      reservaIds: ["1", "1", "1"],
      comprobanteUrl: "url",
    });

    expect(txMock.reserva.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: { in: ["1"] } } })
    );
  });

  it("registrarComprobante (singular) sigue funcionando como wrapper de una sola reserva", async () => {
    txMock.reserva.findMany.mockResolvedValue([reserva("1")]);

    const pago = await registrarComprobante({
      reservaId: "1",
      comprobanteUrl: "url",
    });

    expect(pago).toBeDefined();
    expect(txMock.pago.update).toHaveBeenCalledTimes(1);
  });

  it("limpia expiraEn solo si el comprobante llegó a tiempo (reserva sigue PENDIENTE_PAGO y no venció)", async () => {
    txMock.reserva.findMany.mockResolvedValue([
      reserva("1", { expiraEn: new Date(Date.now() - 60 * 1000) }), // ya venció
    ]);

    await registrarComprobantes({ reservaIds: ["1"], comprobanteUrl: "url" });

    expect(txMock.reserva.update).not.toHaveBeenCalled();
  });
});
