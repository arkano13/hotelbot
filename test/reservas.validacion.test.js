import { describe, it, expect, vi, beforeEach } from "vitest";

const txMock = {
  reserva: {
    findFirst: vi.fn().mockResolvedValue(null),
    findUnique: vi.fn().mockResolvedValue(null),
    create: vi.fn(),
  },
  pago: {
    create: vi.fn(),
  },
};

const prismaMock = {
  $transaction: vi.fn(async (fn) => fn(txMock)),
  reserva: {
    findUnique: vi.fn().mockResolvedValue(null),
  },
};

vi.mock("../src/lib/prisma.js", () => ({
  prisma: prismaMock,
}));

vi.mock("../src/auditoria/service.js", () => ({
  registrarAuditoria: vi.fn(),
}));

vi.mock("../src/clientes/service.js", () => ({
  crearOActualizarCliente: vi.fn().mockResolvedValue({
    id: "cliente-1",
    nombre: "Cliente Test",
    telefono: "99999999",
  }),
}));

vi.mock("../src/disponibilidad/service.js", () => ({
  consultarDisponibilidad: vi.fn().mockResolvedValue({
    disponible: true,
    totalDisponibles: 1,
    habitacion: { id: "hab-1", numero: "4", capacidad: 2 },
  }),
  consultarDisponibilidadMultiple: vi.fn(),
}));

vi.mock("../src/tarifas/service.js", () => ({
  obtenerTarifaPorPersonas: vi.fn().mockResolvedValue({
    personas: 2,
    precio: 500,
    activa: true,
  }),
}));

const { crearReservaTemporal } = await import(
  "../src/reservas/service.js"
);

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

describe("crearReservaTemporal — validaciones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    txMock.reserva.findFirst.mockResolvedValue(null);
    txMock.reserva.findUnique.mockResolvedValue(null);
    txMock.reserva.create.mockResolvedValue({
      id: "res-1",
      codigo: "RES-2027-123456",
      fechaEntrada: new Date(`${MAÑANA}T00:00:00`),
      fechaSalida: new Date(`${MAÑANA_MAS_2}T00:00:00`),
      cantidadPersonas: 2,
      cantidadNoches: 2,
      precioPorNoche: 500,
      precioTotal: 1000,
      estado: "PENDIENTE_PAGO",
    });
    txMock.pago.create.mockResolvedValue({ id: "pago-1", estado: "NO_GENERADO" });
  });

  it("rechaza nombre vacío", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "   ",
        telefono: "99999999",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow("El nombre y apellido son obligatorios");
  });

  it("rechaza teléfono vacío", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow("El teléfono es obligatorio");
  });

  it("rechaza fechas faltantes", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: "",
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow("Las fechas de entrada y salida son obligatorias");
  });

  it("rechaza fecha de salida anterior o igual a la entrada", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA,
        personas: 2,
      })
    ).rejects.toThrow("La fecha de salida debe ser posterior a la entrada");
  });

  it("rechaza fechas con formato inválido", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: "no-es-fecha",
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow("Las fechas no son válidas");
  });

  it("rechaza cantidad de personas no entera", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 2.5,
      })
    ).rejects.toThrow("La cantidad de personas no es válida");
  });

  it("rechaza 0 personas", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 0,
      })
    ).rejects.toThrow("La cantidad de personas no es válida");
  });

  it("rechaza número de identidad vacío", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "   ",
        metodoPago: "transferencia",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow("El número de identidad es obligatorio");
  });

  it("rechaza más de 3 personas (debe usar reserva múltiple)", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 4,
      })
    ).rejects.toThrow("Para más de 3 personas se deben crear varias habitaciones");
  });

  it("permite espacios en blanco alrededor del nombre y los recorta", async () => {
    const resultado = await crearReservaTemporal({
      nombre: "  Juan Pérez  ",
      telefono: "99999999",
      documento: "0801199912345",
        metodoPago: "transferencia",
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    expect(resultado.codigo).toBe("RES-2027-123456");
  });

  it("crea la reserva exitosamente con datos válidos", async () => {
    const resultado = await crearReservaTemporal({
      nombre: "Juan Pérez",
      telefono: "99999999",
      documento: "0801199912345",
        metodoPago: "transferencia",
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    expect(txMock.reserva.create).toHaveBeenCalledTimes(1);
    expect(txMock.pago.create).toHaveBeenCalledTimes(1);
    expect(resultado.estado).toBe("PENDIENTE_PAGO");
  });

  it("revalida el conflicto de habitación DENTRO de la transacción, no confía solo en la consulta previa", async () => {
    // Simula que, entre la consulta de disponibilidad y el commit,
    // otro cliente ya reservó la habitación.
    txMock.reserva.findFirst.mockResolvedValueOnce({ id: "otra-reserva" });

    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "transferencia",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow("La habitación dejó de estar disponible. Intenta nuevamente");

    expect(txMock.reserva.create).not.toHaveBeenCalled();
  });
});

describe("crearReservaTemporal — método de pago", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    txMock.reserva.findFirst.mockResolvedValue(null);
    txMock.reserva.findUnique.mockResolvedValue(null);
    txMock.reserva.create.mockResolvedValue({
      id: "res-1",
      codigo: "RES-2027-123456",
      fechaEntrada: new Date(`${MAÑANA}T00:00:00`),
      fechaSalida: new Date(`${MAÑANA_MAS_2}T00:00:00`),
      cantidadPersonas: 2,
      cantidadNoches: 2,
      precioPorNoche: 500,
      precioTotal: 1000,
      estado: "PENDIENTE_PAGO",
    });
    txMock.pago.create.mockResolvedValue({ id: "pago-1", estado: "NO_GENERADO" });
  });

  it("rechaza un método de pago que no sea efectivo ni transferencia", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        metodoPago: "tarjeta",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow('El método de pago debe ser "efectivo" o "transferencia"');
  });

  it("rechaza si no se manda método de pago", async () => {
    await expect(
      crearReservaTemporal({
        nombre: "Juan Pérez",
        telefono: "99999999",
        documento: "0801199912345",
        fechaEntrada: MAÑANA,
        fechaSalida: MAÑANA_MAS_2,
        personas: 2,
      })
    ).rejects.toThrow('El método de pago debe ser "efectivo" o "transferencia"');
  });

  it("efectivo: el pago se crea con proveedor EFECTIVO y estado PENDIENTE", async () => {
    await crearReservaTemporal({
      nombre: "Juan Pérez",
      telefono: "99999999",
      documento: "0801199912345",
      metodoPago: "efectivo",
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    const datosPago = txMock.pago.create.mock.calls[0][0].data;
    expect(datosPago.proveedor).toBe("EFECTIVO");
    expect(datosPago.estado).toBe("PENDIENTE");
  });

  it("efectivo: la reserva expira en ~24 horas, no en 30 minutos", async () => {
    const antes = Date.now();

    await crearReservaTemporal({
      nombre: "Juan Pérez",
      telefono: "99999999",
      documento: "0801199912345",
      metodoPago: "efectivo",
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    const datosReserva = txMock.reserva.create.mock.calls[0][0].data;
    const minutosHastaExpirar =
      (datosReserva.expiraEn.getTime() - antes) / (60 * 1000);

    expect(minutosHastaExpirar).toBeGreaterThan(23 * 60);
    expect(minutosHastaExpirar).toBeLessThanOrEqual(24 * 60 + 1);
  });

  it("transferencia: el pago se crea con proveedor TRANSFERENCIA y estado NO_GENERADO (flujo normal, sin cambios)", async () => {
    await crearReservaTemporal({
      nombre: "Juan Pérez",
      telefono: "99999999",
      documento: "0801199912345",
      metodoPago: "transferencia",
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    const datosPago = txMock.pago.create.mock.calls[0][0].data;
    expect(datosPago.proveedor).toBe("TRANSFERENCIA");
    expect(datosPago.estado).toBe("NO_GENERADO");
  });

  it("transferencia: la reserva expira en ~30 minutos, no en 24 horas", async () => {
    const antes = Date.now();

    await crearReservaTemporal({
      nombre: "Juan Pérez",
      telefono: "99999999",
      documento: "0801199912345",
      metodoPago: "transferencia",
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    const datosReserva = txMock.reserva.create.mock.calls[0][0].data;
    const minutosHastaExpirar =
      (datosReserva.expiraEn.getTime() - antes) / (60 * 1000);

    expect(minutosHastaExpirar).toBeGreaterThan(0);
    expect(minutosHastaExpirar).toBeLessThanOrEqual(31);
  });

  it("acepta el método de pago en mayúsculas o con espacios", async () => {
    const resultado = await crearReservaTemporal({
      nombre: "Juan Pérez",
      telefono: "99999999",
      documento: "0801199912345",
      metodoPago: "  EFECTIVO  ",
      fechaEntrada: MAÑANA,
      fechaSalida: MAÑANA_MAS_2,
      personas: 2,
    });

    expect(resultado.codigo).toBe("RES-2027-123456");
  });
});