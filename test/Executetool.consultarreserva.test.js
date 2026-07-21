import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../src/lib/prisma.js", () => ({ prisma: {} }));

vi.mock("../src/tarifas/service.js", () => ({
  obtenerTarifaPorPersonas: vi.fn(),
}));

vi.mock("../src/disponibilidad/service.js", () => ({
  consultarDisponibilidad: vi.fn(),
  consultarDisponibilidadMultiple: vi.fn(),
}));

const reservasServiceMock = {
  crearReservaTemporal: vi.fn(),
  crearReservasMultiples: vi.fn(),
  obtenerReservaMasRecientePorTelefono: vi.fn(),
  obtenerReservaPorCodigo: vi.fn(),
};

vi.mock("../src/reservas/service.js", () => reservasServiceMock);

vi.mock("../src/imagenes/service.js", () => ({
  obtenerImagenesHabitacion: vi.fn(),
}));

vi.mock("../src/lib/flujosJefe.js", () => ({
  flujosJefe: new Map(),
}));

vi.mock("../src/conversations/service.js", () => ({
  actualizarEstadoConversacion: vi.fn(),
  obtenerConversacionPorId: vi.fn(),
  reiniciarDatosReserva: vi.fn(),
}));

const { ejecutarTool } = await import("../src/ai/executeTool.js");

function reservaAjena() {
  return {
    codigo: "RES-2027-000999",
    cliente: { nombre: "Otra Persona", telefono: "88887777" },
    fechaEntrada: new Date("2027-02-01"),
    fechaSalida: new Date("2027-02-03"),
    cantidadPersonas: 2,
    cantidadNoches: 2,
    habitacion: { numero: "5" },
    precioTotal: 1000,
    estado: "CONFIRMADA",
    pago: { estado: "APROBADO", codigo: "P1234" },
  };
}

describe("consultar_reserva — no debe exponer reservas de otro cliente", () => {
  beforeEach(() => vi.clearAllMocks());

  it("si el código pertenece a otro teléfono, responde como si no existiera", async () => {
    reservasServiceMock.obtenerReservaPorCodigo.mockResolvedValue(reservaAjena());

    const resultado = await ejecutarTool(
      "consultar_reserva",
      { codigo: "RES-2027-000999" },
      { telefono: "99990000" } // teléfono distinto al dueño real de la reserva
    );

    expect(resultado.encontrada).toBe(false);
    // No debe filtrar ningún dato de la reserva ajena
    expect(resultado).not.toHaveProperty("nombreCliente");
    expect(resultado).not.toHaveProperty("precioTotal");
  });

  it("si el código sí pertenece al mismo teléfono, la muestra normalmente", async () => {
    const reserva = reservaAjena();
    reserva.cliente.telefono = "99990000";
    reservasServiceMock.obtenerReservaPorCodigo.mockResolvedValue(reserva);

    const resultado = await ejecutarTool(
      "consultar_reserva",
      { codigo: "RES-2027-000999" },
      { telefono: "99990000" }
    );

    expect(resultado.encontrada).toBe(true);
    expect(resultado.codigo).toBe("RES-2027-000999");
  });

  it("sin código, sigue buscando la más reciente por teléfono propio (sin cambios)", async () => {
    const reserva = reservaAjena();
    reserva.cliente.telefono = "99990000";
    reservasServiceMock.obtenerReservaMasRecientePorTelefono.mockResolvedValue(reserva);

    const resultado = await ejecutarTool(
      "consultar_reserva",
      {},
      { telefono: "99990000" }
    );

    expect(resultado.encontrada).toBe(true);
  });
});