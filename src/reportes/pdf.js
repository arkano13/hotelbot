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

    const yPie = doc.page.height - 40;

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
        { width: anchoUtil(doc) / 2, align: "left" }
      );

    doc.text(
      `Página ${i + 1} de ${paginas.count}`,
      MARGEN + anchoUtil(doc) / 2,
      yPie + 8,
      { width: anchoUtil(doc) / 2, align: "right" }
    );
  }
}

function dibujarSeccion(doc, texto) {
  if (doc.y > doc.page.height - 130) {
    doc.addPage();
    doc.y = MARGEN;
  }

  doc.moveDown(0.6);

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(COLOR_PRIMARIO)
    .text(texto);

  doc
    .moveTo(MARGEN, doc.y + 2)
    .lineTo(doc.page.width - MARGEN, doc.y + 2)
    .strokeColor(COLOR_SECUNDARIO)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.5);
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
    return;
  }

  filas.forEach((fila, indice) => {
    if (doc.y + alturaFila > doc.page.height - 60) {
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
  });

  doc.moveDown(0.4);
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
  return new Date(fecha).toLocaleDateString("es-HN", {
    timeZone: "America/Tegucigalpa",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generarPdfDiario(resumen) {
  return generarBuffer("Resumen diario de operaciones", (doc) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(COLOR_TEXTO)
      .text(formatearFecha(resumen.fecha));

    doc.moveDown(0.8);

    dibujarSeccion(doc, `Llegadas (${resumen.llegan.length})`);

    dibujarTabla(
      doc,
      [
        { titulo: "Código", ancho: 0.14 },
        { titulo: "Habitación", ancho: 0.12, align: "center" },
        { titulo: "Cliente", ancho: 0.28 },
        { titulo: "Teléfono", ancho: 0.16 },
        { titulo: "Pers.", ancho: 0.08, align: "center" },
        { titulo: "Total", ancho: 0.12, align: "right" },
        { titulo: "Estado", ancho: 0.1, align: "center" },
      ],
      resumen.llegan.map((r) => [
        r.codigo,
        r.habitacion.numero,
        r.cliente.nombre,
        r.cliente.telefono,
        r.cantidadPersonas,
        formatearMoneda(r.precioTotal),
        r.estado,
      ]),
      "Sin llegadas registradas para hoy."
    );

    dibujarSeccion(doc, `Salidas (${resumen.salen.length})`);

    dibujarTabla(
      doc,
      [
        { titulo: "Código", ancho: 0.18 },
        { titulo: "Habitación", ancho: 0.16, align: "center" },
        { titulo: "Cliente", ancho: 0.36 },
        { titulo: "Teléfono", ancho: 0.3 },
      ],
      resumen.salen.map((r) => [
        r.codigo,
        r.habitacion.numero,
        r.cliente.nombre,
        r.cliente.telefono,
      ]),
      "Sin salidas registradas para hoy."
    );

    dibujarSeccion(doc, `Pagos pendientes de revisar (${resumen.pagosPendientes.length})`);

    dibujarTabla(
      doc,
      [
        { titulo: "Código pago", ancho: 0.16 },
        { titulo: "Reserva", ancho: 0.16 },
        { titulo: "Cliente", ancho: 0.38 },
        { titulo: "Monto", ancho: 0.3, align: "right" },
      ],
      resumen.pagosPendientes.map((p) => [
        p.codigo ?? "N/A",
        p.reserva?.codigo ?? "N/A",
        p.reserva?.cliente?.nombre ?? "N/A",
        formatearMoneda(p.monto),
      ]),
      "No hay pagos pendientes de revisión."
    );
  });
}

export async function generarPdfMensual(resumen) {
  return generarBuffer("Resumen mensual de operaciones", (doc) => {
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(COLOR_TEXTO)
      .text(`${NOMBRES_MES[resumen.mes - 1]} ${resumen.anio}`);

    doc.moveDown(1);

    const ancho = anchoUtil(doc);
    const columnas = 3;
    const espacio = 12;
    const anchoTarjeta = (ancho - espacio * (columnas - 1)) / columnas;

    const metricas = [
      ["Reservas creadas", String(resumen.totalReservas)],
      ["Noches vendidas", String(resumen.nochesVendidas)],
      ["Ocupación estimada", `${resumen.ocupacionPorcentaje.toFixed(1)}%`],
      ["Ingresos confirmados", formatearMoneda(resumen.ingresos)],
      ["Pagos aprobados", String(resumen.pagosAprobadosCantidad)],
      ["Canceladas / expiradas", String(resumen.canceladas)],
    ];

    const yInicio = doc.y;

    metricas.forEach(([etiqueta, valor], indice) => {
      const fila = Math.floor(indice / columnas);
      const columna = indice % columnas;

      const x = MARGEN + columna * (anchoTarjeta + espacio);
      const y = yInicio + fila * (56 + espacio);

      tarjetaMetrica(doc, x, y, anchoTarjeta, etiqueta, valor);
    });

    doc.y = yInicio + Math.ceil(metricas.length / columnas) * (56 + espacio);

    dibujarSeccion(doc, "Notas");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLOR_TEXTO_SUAVE)
      .text(
        "La ocupación estimada se calcula con base en las noches vendidas frente a la capacidad total del hotel durante el mes. Los ingresos corresponden únicamente a pagos aprobados en el periodo.",
        { width: anchoUtil(doc) }
      );
  });
}