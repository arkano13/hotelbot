import fs from "fs/promises";
import path from "path";

import { prisma } from "../src/lib/prisma.js";
import {
  obtenerResumenDiario,
  obtenerResumenMensual,
} from "../src/reportes/service.js";
import {
  generarPdfDiario,
  generarPdfMensual,
} from "../src/reportes/pdf.js";
import { DATA_DIR } from "../src/lib/paths.js";

function fechaHonduras() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Tegucigalpa",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function sumarDias(fechaISO, cantidad) {
  const fecha = new Date(`${fechaISO}T12:00:00.000Z`);
  fecha.setUTCDate(fecha.getUTCDate() + cantidad);
  return fecha.toISOString().slice(0, 10);
}

function mesAnterior() {
  const hoy = fechaHonduras();
  const [anio, mes] = hoy.split("-").map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 2, 1));

  return {
    anio: fecha.getUTCFullYear(),
    mes: fecha.getUTCMonth() + 1,
  };
}

async function guardar(nombre, buffer) {
  const directorio = path.join(DATA_DIR, "reportes");
  await fs.mkdir(directorio, { recursive: true });

  const ruta = path.join(directorio, nombre);
  await fs.writeFile(ruta, buffer);
  return ruta;
}

async function generarDiario(fechaArgumento) {
  const fecha = fechaArgumento || sumarDias(fechaHonduras(), -1);
  const resumen = await obtenerResumenDiario(fecha);
  const pdf = await generarPdfDiario(resumen);
  const ruta = await guardar(`reporte-diario-${fecha}.pdf`, pdf);

  console.log(`✅ Reporte diario generado: ${ruta}`);
  console.log(`   Pagos confirmados: ${resumen.cantidadPagos}`);
  console.log(`   Ingresos: L. ${resumen.ingresosTotal.toFixed(2)}`);
}

async function generarMensual(periodoArgumento) {
  let periodo;

  if (periodoArgumento) {
    const coincidencia = periodoArgumento.match(/^(\d{4})-(\d{2})$/);

    if (!coincidencia) {
      throw new Error("El periodo mensual debe tener formato YYYY-MM");
    }

    periodo = {
      anio: Number(coincidencia[1]),
      mes: Number(coincidencia[2]),
    };
  } else {
    periodo = mesAnterior();
  }

  const resumen = await obtenerResumenMensual(periodo.anio, periodo.mes);
  const pdf = await generarPdfMensual(resumen);
  const mesTexto = String(periodo.mes).padStart(2, "0");
  const ruta = await guardar(
    `reporte-mensual-${periodo.anio}-${mesTexto}.pdf`,
    pdf,
  );

  console.log(`✅ Reporte mensual generado: ${ruta}`);
  console.log(`   Pagos confirmados: ${resumen.cantidadPagos}`);
  console.log(`   Ingresos: L. ${resumen.ingresosTotal.toFixed(2)}`);
}

async function main() {
  const [tipo = "diario", periodo] = process.argv.slice(2);

  if (tipo === "diario") {
    await generarDiario(periodo);
    return;
  }

  if (tipo === "mensual") {
    await generarMensual(periodo);
    return;
  }

  throw new Error(
    "Uso: node scripts/generarReporte.js diario [YYYY-MM-DD] | mensual [YYYY-MM]",
  );
}

main()
  .catch((error) => {
    console.error("❌ No se pudo generar el reporte:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
