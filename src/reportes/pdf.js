import PDFDocument from "pdfkit";

const NOMBRES_MES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const COLOR_PRIMARIO = "#1f3a5f";
const COLOR_SECUNDARIO = "#5b7a99";
const COLOR_TEXTO = "#2a2a2a";
const COLOR_TEXTO_SUAVE = "#6b6b6b";
const COLOR_BORDE = "#dfe3e8";
const COLOR_FILA_PAR = "#f5f7fa";

const MARGEN = 50;

const HOTEL_NOMBRE = process.env.HOTEL_NOMBRE || "Hotel";

function generarBuffer(titulo, dibujarContenido) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: MARGEN, size: "A4", bufferPages: true });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("error", reject);

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    dibujarEncabezado(doc, titulo);
    dibujarContenido(doc);
    dibujarPiesDePagina(doc);

    doc.end();
  });
}

function anchoUtil(doc) {
  return doc.page.width - MARGEN * 2;
}

function dibujarEncabezado(doc, titulo) {
  const alturaBarra = 78;

  doc.rect(0, 0, doc.page.width, alturaBarra).fill(COLOR_PRIMARIO);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(16)
    .text(HOTEL_NOMBRE, MARGEN, 22);

  doc
    .fillColor("#cfe0f0")
    .font("Helvetica")
    .fontSize(10)
    .text(titulo, MARGEN, 46);

  const fechaGeneracion = new Date().toLocaleString("es-HN", {
    timeZone: "America/Tegucigalpa",
    dateStyle: "medium",
    timeStyle: "short",
  });

  doc
    .fillColor("#cfe0f0")
    .font("Helvetica")
    .fontSize(8)
    .text(`Generado: ${fechaGeneracion}`, MARGEN, 60);

  doc.y = alturaBarra + 28;
  doc.fillColor(COLOR_TEXTO);
}

function dibujarPiesDePagina(doc) {
  const paginas = doc.bufferedPageRange();

  for (let i = 0; i < paginas.count; i++) {
    doc.switchToPage(i);

    // Mantener el texto dentro del área imprimible evita que PDFKit agregue
    // una página vacía al dibujar el pie.
    const yPie = doc.page.height - MARGEN - 20;

    doc
      .moveTo(MARGEN, yPie)
      .lineTo(doc.page.width - MARGEN, yPie)
      .strokeColor(COLOR_BORDE)
      .lineWidth(0.5)
      .stroke();

    doc
      .fontSize(8)
      .fillColor(COLOR_TEXTO_SUAVE)
      .font("Helvetica")
      .text(
        `${HOTEL_NOMBRE} · Reporte generado automáticamente`,
        MARGEN,
        yPie + 8,
        { width: anchoUtil(doc) / 2, align: "left", lineBreak: false }
      );

    doc.text(
      `Página ${i + 1} de ${paginas.count}`,
      MARGEN + anchoUtil(doc) / 2,
      yPie + 8,
      { width: anchoUtil(doc) / 2, align: "right", lineBreak: false }
    );
  }
}

function dibujarSeccion(doc, texto) {
  if (doc.y > doc.page.height - 130) {
    doc.addPage();
    doc.y = MARGEN;
  }

  doc.x = MARGEN;
  doc.moveDown(0.6);

  const yTitulo = doc.y;

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(COLOR_PRIMARIO)
    .text(texto, MARGEN, yTitulo, { width: anchoUtil(doc) });

  doc
    .moveTo(MARGEN, doc.y + 2)
    .lineTo(doc.page.width - MARGEN, doc.y + 2)
    .strokeColor(COLOR_SECUNDARIO)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.5);
  doc.x = MARGEN;
  doc.fillColor(COLOR_TEXTO);
}

function dibujarTabla(doc, columnas, filas, filaVacia) {
  const ancho = anchoUtil(doc);
  const anchosColumnas = columnas.map((c) => c.ancho * ancho);
  const alturaFila = 22;

  function dibujarEncabezadoTabla() {
    const y = doc.y;

    doc.rect(MARGEN, y, ancho, alturaFila).fill(COLOR_PRIMARIO);

    let x = MARGEN;

    columnas.forEach((col, i) => {
      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(8.5)
        .text(col.titulo, x + 6, y + 7, {
          width: anchosColumnas[i] - 10,
          align: col.align || "left",
        });

      x += anchosColumnas[i];
    });

    doc.y = y + alturaFila;
    doc.x = MARGEN;
    doc.fillColor(COLOR_TEXTO);
  }

  dibujarEncabezadoTabla();

  if (filas.length === 0) {
    const y = doc.y;

    doc.rect(MARGEN, y, ancho, alturaFila).fillAndStroke("#ffffff", COLOR_BORDE);

    doc
      .fillColor(COLOR_TEXTO_SUAVE)
      .font("Helvetica-Oblique")
      .fontSize(9)
      .text(filaVacia, MARGEN + 6, y + 7, { width: ancho - 12 });

    doc.y = y + alturaFila;
    doc.x = MARGEN;
    return;
  }

  filas.forEach((fila, indice) => {
    if (doc.y + alturaFila > doc.page.height - 90) {
      doc.addPage();
      doc.y = MARGEN;
      dibujarEncabezadoTabla();
    }

    const y = doc.y;
    const colorFondo = indice % 2 === 0 ? "#ffffff" : COLOR_FILA_PAR;

    doc.rect(MARGEN, y, ancho, alturaFila).fillAndStroke(colorFondo, COLOR_BORDE);

    let x = MARGEN;

    fila.forEach((valor, i) => {
      doc
        .fillColor(COLOR_TEXTO)
        .font("Helvetica")
        .fontSize(8.5)
        .text(String(valor), x + 6, y + 7, {
          width: anchosColumnas[i] - 10,
          align: columnas[i].align || "left",
        });

      x += anchosColumnas[i];
    });

    doc.y = y + alturaFila;
    doc.x = MARGEN;
  });

  doc.moveDown(0.4);
  doc.x = MARGEN;
}

function tarjetaMetrica(doc, x, y, ancho, etiqueta, valor) {
  const alto = 56;

  doc.rect(x, y, ancho, alto).fillAndStroke(COLOR_FILA_PAR, COLOR_BORDE);

  doc
    .fillColor(COLOR_TEXTO_SUAVE)
    .font("Helvetica")
    .fontSize(8)
    .text(etiqueta.toUpperCase(), x + 10, y + 10, { width: ancho - 20 });

  doc
    .fillColor(COLOR_PRIMARIO)
    .font("Helvetica-Bold")
    .fontSize(15)
    .text(valor, x + 10, y + 26, { width: ancho - 20 });
}

function formatearMoneda(valor) {
  return `L. ${Number(valor).toLocaleString("es-HN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatearFecha(fecha) {
  const valor = /^\d{4}-\d{2}-\d{2}$/.test(String(fecha))
    ? new Date(`${fecha}T12:00:00.000Z`)
    : new Date(fecha);

  return valor.toLocaleDateString("es-HN", {
    timeZone: "America/Tegucigalpa",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatearFechaCorta(fecha) {
  return new Date(fecha).toLocaleDateString("es-HN", {
    timeZone: "America/Tegucigalpa",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString("es-HN", {
    timeZone: "America/Tegucigalpa",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function recortar(valor, maximo) {
  const texto = String(valor ?? "N/A");
  return texto.length > maximo ? `${texto.slice(0, maximo - 3)}...` : texto;
}

function dibujarMetricas(doc, metricas, columnas = 3) {
  const ancho = anchoUtil(doc);
  const espacio = 12;
  const anchoTarjeta = (ancho - espacio * (columnas - 1)) / columnas;
  const yInicio = doc.y;

  metricas.forEach(([etiqueta, valor], indice) => {
    const fila = Math.floor(indice / columnas);
    const columna = indice % columnas;
    const x = MARGEN + columna * (anchoTarjeta + espacio);
    const y = yInicio + fila * (56 + espacio);

    tarjetaMetrica(doc, x, y, anchoTarjeta, etiqueta, valor);
  });

  doc.y = yInicio + Math.ceil(metricas.length / columnas) * (56 + espacio);
  doc.x = MARGEN;
}

function columnasPagos(incluirFecha = false) {
  if (incluirFecha) {
    return [
      { titulo: "Fecha", ancho: 0.13 },
      { titulo: "Pago", ancho: 0.13 },
      { titulo: "Reserva", ancho: 0.18 },
      { titulo: "Cliente", ancho: 0.22 },
      { titulo: "Hab.", ancho: 0.07, align: "center" },
      { titulo: "Pers.", ancho: 0.07, align: "center" },
      { titulo: "Monto", ancho: 0.2, align: "right" },
    ];
  }

  return [
    { titulo: "Hora", ancho: 0.1 },
    { titulo: "Pago", ancho: 0.14 },
    { titulo: "Reserva", ancho: 0.17 },
    { titulo: "Cliente", ancho: 0.25 },
    { titulo: "Hab.", ancho: 0.08, align: "center" },
    { titulo: "Pers.", ancho: 0.08, align: "center" },
    { titulo: "Monto", ancho: 0.18, align: "right" },
  ];
}

function filasPagos(pagos, incluirFecha = false) {
  return pagos.map((pago) => [
    incluirFecha ? formatearFechaCorta(pago.fechaPago) : formatearHora(pago.fechaPago),
    pago.codigoPago,
    pago.codigoReserva,
    recortar(pago.cliente, 24),
    pago.habitacion,
    pago.personas,
    formatearMoneda(pago.monto),
  ]);
}

export async function generarPdfDiario(resumen) {
  return generarBuffer("Reporte diario de ingresos confirmados", (doc) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(COLOR_TEXTO)
      .text(formatearFecha(resumen.fecha));

    doc.moveDown(1);

    dibujarMetricas(doc, [
      ["Ingresos recibidos", formatearMoneda(resumen.ingresosTotal)],
      ["Por transferencia", formatearMoneda(resumen.ingresosTransferencia)],
      ["En efectivo", formatearMoneda(resumen.ingresosEfectivo)],
      ["Pagos confirmados", String(resumen.cantidadPagos)],
      ["Huéspedes vendidos", String(resumen.huespedes)],
      ["Ticket promedio", formatearMoneda(resumen.ticketPromedio)],
    ]);

    dibujarSeccion(
      doc,
      `Comprobantes aprobados (${resumen.cantidadTransferencias})`,
    );
    dibujarTabla(
      doc,
      columnasPagos(),
      filasPagos(resumen.transferencias),
      "No hubo comprobantes aprobados en este día.",
    );

    dibujarSeccion(
      doc,
      `Pagos en efectivo al llegar (${resumen.cantidadEfectivos})`,
    );
    dibujarTabla(
      doc,
      columnasPagos(),
      filasPagos(resumen.efectivos),
      "No hubo ingresos en efectivo en este día.",
    );

    if (resumen.cancelacionesSinReembolso.length > 0) {
      dibujarSeccion(
        doc,
        `Cancelaciones sin reembolso (${resumen.cancelacionesSinReembolso.length})`,
      );
      dibujarTabla(
        doc,
        [
          { titulo: "Reserva", ancho: 0.2 },
          { titulo: "Cliente", ancho: 0.38 },
          { titulo: "Método", ancho: 0.2 },
          { titulo: "Ingreso", ancho: 0.22, align: "right" },
        ],
        resumen.cancelacionesSinReembolso.map((pago) => [
          pago.codigoReserva,
          recortar(pago.cliente, 30),
          pago.metodo,
          formatearMoneda(pago.monto),
        ]),
        "Sin cancelaciones pagadas.",
      );
    }

    dibujarSeccion(doc, "Criterio del reporte");
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLOR_TEXTO_SUAVE)
      .text(
        "Solo se incluyen comprobantes aprobados y pagos en efectivo registrados al llegar. Se excluyen reservas sin pago, comprobantes pendientes, rechazados y vencidos.",
        { width: anchoUtil(doc) },
      );
  });
}

export async function generarPdfMensual(resumen) {
  return generarBuffer("Reporte mensual de ingresos confirmados", (doc) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(COLOR_TEXTO)
      .text(`${NOMBRES_MES[resumen.mes - 1]} ${resumen.anio}`);

    doc.moveDown(1);

    dibujarMetricas(doc, [
      ["Ingresos recibidos", formatearMoneda(resumen.ingresosTotal)],
      ["Por transferencia", formatearMoneda(resumen.ingresosTransferencia)],
      ["En efectivo", formatearMoneda(resumen.ingresosEfectivo)],
      ["Pagos confirmados", String(resumen.cantidadPagos)],
      ["Huéspedes vendidos", String(resumen.huespedes)],
      ["Ticket promedio", formatearMoneda(resumen.ticketPromedio)],
      ["Noches vendidas", String(resumen.nochesVendidas)],
      ["Ocupación confirmada", `${resumen.ocupacionPorcentaje.toFixed(1)}%`],
      ["Cancelaciones sin devolución", String(resumen.cancelacionesSinReembolso.length)],
    ]);

    dibujarSeccion(doc, "Ingresos por método de pago");
    dibujarTabla(
      doc,
      [
        { titulo: "Método", ancho: 0.34 },
        { titulo: "Pagos", ancho: 0.2, align: "center" },
        { titulo: "Huéspedes", ancho: 0.2, align: "center" },
        { titulo: "Ingresos", ancho: 0.26, align: "right" },
      ],
      [
        [
          "TRANSFERENCIA",
          resumen.cantidadTransferencias,
          resumen.transferencias.reduce((total, pago) => total + pago.personas, 0),
          formatearMoneda(resumen.ingresosTransferencia),
        ],
        [
          "EFECTIVO",
          resumen.cantidadEfectivos,
          resumen.efectivos.reduce((total, pago) => total + pago.personas, 0),
          formatearMoneda(resumen.ingresosEfectivo),
        ],
      ],
      "No hubo ingresos confirmados durante el mes.",
    );

    dibujarSeccion(doc, "Ingresos confirmados por día");
    dibujarTabla(
      doc,
      [
        { titulo: "Fecha", ancho: 0.18 },
        { titulo: "Pagos", ancho: 0.12, align: "center" },
        { titulo: "Huéspedes", ancho: 0.14, align: "center" },
        { titulo: "Transfer.", ancho: 0.19, align: "right" },
        { titulo: "Efectivo", ancho: 0.17, align: "right" },
        { titulo: "Total", ancho: 0.2, align: "right" },
      ],
      resumen.pagosPorDia.map((dia) => [
        dia.fecha,
        dia.cantidadPagos,
        dia.huespedes,
        formatearMoneda(dia.transferencias),
        formatearMoneda(dia.efectivos),
        formatearMoneda(dia.total),
      ]),
      "No hubo días con ingresos confirmados.",
    );

    dibujarSeccion(doc, "Rendimiento por habitación");
    dibujarTabla(
      doc,
      [
        { titulo: "Habitación", ancho: 0.18, align: "center" },
        { titulo: "Pagos", ancho: 0.14, align: "center" },
        { titulo: "Huéspedes", ancho: 0.18, align: "center" },
        { titulo: "Noches", ancho: 0.16, align: "center" },
        { titulo: "Ingresos", ancho: 0.34, align: "right" },
      ],
      resumen.rendimientoHabitaciones.map((habitacion) => [
        habitacion.habitacion,
        habitacion.pagos,
        habitacion.huespedes,
        habitacion.nochesVendidas,
        formatearMoneda(habitacion.ingresos),
      ]),
      "No hay habitaciones con ingresos confirmados.",
    );

    dibujarSeccion(doc, `Detalle de cobros (${resumen.cantidadPagos})`);
    dibujarTabla(
      doc,
      columnasPagos(true),
      filasPagos(resumen.pagos, true),
      "No hubo pagos confirmados durante el mes.",
    );

    dibujarSeccion(doc, "Notas");
    const mejorDiaTexto = resumen.mejorDia
      ? `El día con más ingresos fue ${resumen.mejorDia.fecha}, con ${formatearMoneda(resumen.mejorDia.total)}. `
      : "";
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLOR_TEXTO_SUAVE)
      .text(
        `${mejorDiaTexto}La ocupación se calcula con estadías pagadas y activas durante el mes. Los ingresos solo incluyen comprobantes aprobados y pagos en efectivo; se excluyen pagos pendientes, rechazados, vencidos y no generados.`,
        { width: anchoUtil(doc) },
      );
  });
}
