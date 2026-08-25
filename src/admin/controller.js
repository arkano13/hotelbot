import {
  listarHabitacionesConEstado,
  listarHabitacionesPorCapacidadConEstado,
  editarHabitacion,
} from "../habitaciones/service.js";

import {
  listarReservasParaCheckIn,
  listarReservasParaCheckout,
  listarReservasParaCancelar,
  registrarCheckInPorHabitacion,
  listarAlternativasParaCheckIn,
  registrarCheckoutPorHabitacion,
  cancelarReservaPorId,
  listarHabitacionesParaMantenimiento,
  alternarMantenimientoHabitacion,
  crearReservaWalkIn,
  listarHabitacionesDisponiblesWalkIn,
  listarReservasQueRequierenAprobacion,
  aprobarHabitacionMasGrande,
  rechazarHabitacionMasGrande,
  moverReservaDeHabitacion,
  listarReservasActivasParaMover,
  listarTodasLasReservas,
  listarHabitacionesLibresParaMover,
  editarReserva,
} from "../reservas/service.js";

import { obtenerWhatsAppSocket, reiniciarSesionWhatsApp } from "../whatsapp/client.js";

import {
  listarPagosPendientes,
  aprobarPagoPorCodigo,
  rechazarPagoPorCodigo,
} from "../pagos/service.js";

import {
  obtenerConfiguracionBot,
  establecerBotActivo,
} from "../configuracion/service.js";

import {
  listarEscalacionesPendientes,
  listarConversacionesEnModoHumano,
  cambiarModoConversacion,
  actualizarEstadoConversacion,
} from "../conversations/service.js";

import { registrarDispositivo } from "../notificaciones/service.js";
import { notificarEncargadaHabitacionOcupada } from "../notificaciones/encargadaService.js";
import { enviarReporteDiario, enviarReporteMensual } from "../reportes/Scheduler.js";
import { enviarBackup } from "../backups/scheduler.js";

function manejarError(res, error) {
  return res.status(400).json({
    success: false,
    message: error.message || "Ocurrió un error",
  });
}

export async function habitaciones(req, res) {
  try {
    const datos = await listarHabitacionesConEstado();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function editarHabitacionHandler(req, res) {
  try {
    const datos = await editarHabitacion(req.params.habitacionId, {
      numero: req.body?.numero,
      capacidad: req.body?.capacidad,
    });
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function editarReservaHandler(req, res) {
  try {
    const datos = await editarReserva(req.params.reservaId, {
      nombreCliente: req.body?.nombreCliente,
      cantidadNoches: req.body?.cantidadNoches,
      horas: req.body?.horas,
      precioPorNoche: req.body?.precioPorNoche,
    });
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reservasParaCheckIn(req, res) {
  try {
    const datos = await listarReservasParaCheckIn();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reservasParaCheckout(req, res) {
  try {
    const datos = await listarReservasParaCheckout();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reservasParaCancelar(req, res) {
  try {
    const datos = await listarReservasParaCancelar();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function hacerCheckIn(req, res) {
  try {
    const datos = await registrarCheckInPorHabitacion(
      req.params.habitacionId,
      req.body?.metodoPago,
      req.body?.nuevaHabitacionId
    );

    notificarEncargadaHabitacionOcupada({
      numero: datos.habitacion.numero,
      cliente: datos.cliente.nombre,
      personas: datos.cantidadPersonas,
      fechaSalida: datos.fechaSalida,
    }).catch((error) =>
      console.error("❌ Error notificando a la encargada:", error)
    );

    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function alternativasCheckIn(req, res) {
  try {
    const datos = await listarAlternativasParaCheckIn(req.params.habitacionId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function hacerCheckout(req, res) {
  try {
    const datos = await registrarCheckoutPorHabitacion(req.params.habitacionId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function cancelarReserva(req, res) {
  try {
    const datos = await cancelarReservaPorId(req.params.reservaId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function habitacionesMantenimiento(req, res) {
  try {
    const datos = await listarHabitacionesParaMantenimiento();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function alternarMantenimiento(req, res) {
  try {
    const datos = await alternarMantenimientoHabitacion(req.params.habitacionId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function pagosPendientes(req, res) {
  try {
    const datos = await listarPagosPendientes();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function aprobarPago(req, res) {
  try {
    const datos = await aprobarPagoPorCodigo(req.params.codigo);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function rechazarPago(req, res) {
  try {
    const motivo = req.body?.motivo ?? "";
    const datos = await rechazarPagoPorCodigo(req.params.codigo, motivo);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function habitacionesDisponiblesWalkIn(req, res) {
  try {
    const { fechaEntrada, fechaSalida, personas } = req.query;
    const datos = await listarHabitacionesDisponiblesWalkIn({
      fechaEntrada,
      fechaSalida,
      personas,
    });
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function habitacionesPorCapacidadConEstado(req, res) {
  try {
    const { fechaEntrada, fechaSalida, personas } = req.query;
    const datos = await listarHabitacionesPorCapacidadConEstado({
      fechaEntrada,
      fechaSalida,
      personas,
    });
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function crearWalkIn(req, res) {
  try {
    const datos = await crearReservaWalkIn(req.body);

    if (datos.estado === "CHECK_IN") {
      notificarEncargadaHabitacionOcupada({
        numero: datos.habitacion.numero,
        cliente: datos.cliente.nombre,
        personas: datos.cantidadPersonas,
        fechaSalida: datos.fechaSalida,
      }).catch((error) =>
        console.error("❌ Error notificando a la encargada:", error)
      );
    }

    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function estadoBot(req, res) {
  try {
    const datos = await obtenerConfiguracionBot();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function cambiarEstadoBot(req, res) {
  try {
    const datos = await establecerBotActivo(req.body?.activo);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function escalacionesPendientes(req, res) {
  try {
    const datos = await listarEscalacionesPendientes();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function aceptarEscalacion(req, res) {
  try {
    const datos = await cambiarModoConversacion(
      req.params.conversationId,
      "HUMANO"
    );
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function rechazarEscalacion(req, res) {
  try {
    const datos = await actualizarEstadoConversacion(
      req.params.conversationId,
      { necesitaHumano: false, motivoEscalar: null }
    );
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function registrarDispositivoPush(req, res) {
  try {
    const datos = await registrarDispositivo(req.body?.token);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function conversacionesEnModoHumano(req, res) {
  try {
    const datos = await listarConversacionesEnModoHumano();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function devolverABot(req, res) {
  try {
    const datos = await cambiarModoConversacion(
      req.params.conversationId,
      "BOT"
    );
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

function notificarClientePorWhatsApp(telefono, texto) {
  try {
    const socket = obtenerWhatsAppSocket();
    if (socket && telefono) {
      socket
        .sendMessage(`${telefono}@s.whatsapp.net`, { text: texto })
        .catch(() => {});
    }
  } catch {
    // El WhatsApp puede no estar conectado en este momento — no es
    // motivo para fallar la acción del dueño, ya se guardó en la base.
  }
}

export async function reservasQueRequierenAprobacion(req, res) {
  try {
    const datos = await listarReservasQueRequierenAprobacion();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function aprobarHabitacion(req, res) {
  try {
    const datos = await aprobarHabitacionMasGrande(req.params.reservaId);

    notificarClientePorWhatsApp(
      datos.cliente?.telefono,
      `Su reserva ${datos.codigo} quedó confirmada en la habitación ${datos.habitacion.numero}. ¡Lo esperamos!`
    );

    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function rechazarHabitacion(req, res) {
  try {
    const datos = await rechazarHabitacionMasGrande(req.params.reservaId);

    notificarClientePorWhatsApp(
      datos.cliente?.telefono,
      `Lamentamos informarle que no pudimos confirmar su reserva ${datos.codigo} para esas fechas — ya no contamos con disponibilidad. Si gusta, con gusto le ayudamos a buscar otra fecha.`
    );

    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reiniciarWhatsApp(req, res) {
  try {
    reiniciarSesionWhatsApp();
    return res.json({
      success: true,
      message: "Sesión borrada, generando un código QR nuevo. Entra a /qr en unos segundos.",
    });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reporteDiario(req, res) {
  try {
    const fechaISO =
      req.query.fecha ||
      new Intl.DateTimeFormat("en-CA", { timeZone: "America/Tegucigalpa" }).format(new Date());

    const resumen = await enviarReporteDiario(fechaISO);
    return res.json({ success: true, message: "Reporte enviado por WhatsApp al dueño.", data: resumen });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reporteMensual(req, res) {
  try {
    const ahoraHonduras = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Tegucigalpa",
      year: "numeric",
      month: "2-digit",
    }).formatToParts(new Date());

    const anio = Number(req.query.anio) || Number(ahoraHonduras.find((p) => p.type === "year").value);
    const mes = Number(req.query.mes) || Number(ahoraHonduras.find((p) => p.type === "month").value);

    const resumen = await enviarReporteMensual(anio, mes);
    return res.json({ success: true, message: "Reporte enviado por WhatsApp al dueño.", data: resumen });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function fechaActualHonduras(req, res) {
  try {
    // El reloj del celular/tablet no siempre está bien puesto (zona
    // horaria equivocada, etc.) — la app usa esto para saber con certeza
    // qué día es HOY en Honduras, sin depender del dispositivo.
    const fecha = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Tegucigalpa",
    }).format(new Date());

    return res.json({ success: true, data: { fecha } });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function todasLasReservas(req, res) {
  try {
    const datos = await listarTodasLasReservas();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function reservasActivasParaMover(req, res) {
  try {
    const datos = await listarReservasActivasParaMover();
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function habitacionesLibresParaMover(req, res) {
  try {
    const datos = await listarHabitacionesLibresParaMover(req.params.reservaId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function moverHabitacion(req, res) {
  try {
    const datos = await moverReservaDeHabitacion(req.params.reservaId, req.body?.nuevaHabitacionId);
    return res.json({ success: true, data: datos });
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function backupManual(req, res) {
  try {
    const fechaISO = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Tegucigalpa",
    }).format(new Date());

    await enviarBackup(fechaISO);
    return res.json({ success: true, message: "Backup enviado por correo." });
  } catch (error) {
    return manejarError(res, error);
  }
}