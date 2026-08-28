import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const root = new URL('../src/reportes/', import.meta.url);
const load = s => import('data:text/javascript;base64,' + Buffer.from(s).toString('base64'));
test('Cortes de pagos, PDF y envío persistido de los dos reportes', async () => {
  const dates=['2026-08-27T11:59:59Z','2026-08-27T12:00:00Z','2026-08-27T23:59:59Z','2026-08-28T00:00:00Z','2026-08-28T11:59:59Z','2026-08-28T12:00:00Z'];
  const rows=dates.map((d,i)=>({id:i,codigo:'P-'+i,fechaPago:new Date(d),monto:100,proveedor:'EFECTIVO',reserva:{codigo:'R-'+i,cliente:{nombre:'Prueba'},habitacion:{numero:101},cantidadPersonas:1,cantidadNoches:1,estado:'CONFIRMADA'}}));
  let query;
  globalThis.__reportPrisma={pago:{findMany:async q=>{query=q;return rows.filter(p=>p.fechaPago>=q.where.fechaPago.gte&&p.fechaPago<q.where.fechaPago.lt);}}};
  let source=await fs.readFile(new URL('service.js',root),'utf8');
  source=source.replace(/import \{ prisma \} from "..\/lib\/prisma.js";/,'const prisma=globalThis.__reportPrisma;');
  const service=await load(source);
  const full=await service.obtenerResumenDiario('2026-08-27');
  assert.equal(full.cantidadPagos,4);
  assert.deepEqual(full.turnos.map(t=>t.pagos.map(p=>p.id)),[[1,2],[3,4]]);
  assert.equal(full.turnos.reduce((s,t)=>s+t.ingresosTotal,0),full.ingresosTotal);
  const afternoon=await service.obtenerResumenTarde('2026-08-27');
  assert.equal(afternoon.ingresosTotal,200);
  assert.deepEqual(afternoon.pagos.map(p=>p.id),[1,2]);
  assert.equal(query.where.estado,'APROBADO');
  assert.deepEqual(query.where.proveedor.in,['EFECTIVO','TRANSFERENCIA','TARJETA']);
  assert.equal(query.where.fechaPago.lt.toISOString(),'2026-08-28T00:00:00.000Z');
  const empty=await service.obtenerResumenDiario('2026-09-01');
  assert.deepEqual(empty.turnos.map(t=>t.cantidadPagos),[0,0]);
  assert.equal(empty.ticketPromedio,0);
  const pdf=await import(new URL('pdf.js',root));
  for(const [fn,r] of [[pdf.generarPdfDiario,full],[pdf.generarPdfTarde,afternoon],[pdf.generarPdfDiario,empty],[pdf.generarPdfTarde,empty]]){
    const b=await fn(r);assert.equal(b.subarray(0,5).toString(),'%PDF-');assert.ok(b.length>1000);
  }
  let stored={ultimaFechaDiaria:'2026-08-28',ultimoMesEnviado:null};
  const sends=[];
  let hour=17;
  globalThis.__reportTest={fs:{mkdir:async()=>{},readFile:async()=>JSON.stringify(stored),writeFile:async(p,s)=>{stored=JSON.parse(s);},rename:async()=>{}},send:async (jid,args)=>{sends.push(args);},date:()=>({fechaISO:'2026-08-28',anio:2026,mes:8,dia:28,hora:hour})};
  let sched=await fs.readFile(new URL('Scheduler.js',root),'utf8');
  sched=sched.replace(/import fs from "fs\/promises";/,'const fs=globalThis.__reportTest.fs;');
  sched=sched.replace(/import \{[\s\S]*?\} from "\.\/service.js";/,'const obtenerResumenDiario=async()=>({}), obtenerResumenTarde=async()=>({}), obtenerResumenMensual=async()=>({});');
  sched=sched.replace(/import \{[\s\S]*?\} from "\.\/pdf.js";/,'const generarPdfDiario=async()=>Buffer.from("pdf"), generarPdfTarde=generarPdfDiario, generarPdfMensual=generarPdfDiario;');
  sched=sched.replace(/import \{ obtenerWhatsAppSocket \}[^;]+;/,'const obtenerWhatsAppSocket=()=>({sendMessage:globalThis.__reportTest.send});');
  sched=sched.replace(/import \{ DATA_DIR \}[^;]+;/,'const DATA_DIR="test";');
  sched=sched.replace(/function obtenerFechaHoraHonduras\(\) \{[\s\S]*?\n\}/,'function obtenerFechaHoraHonduras(){return globalThis.__reportTest.date();}');
  sched+='\nexport { revisarReportes };';
  const oldPhone=process.env.OWNER_PHONE, oldOther=process.env.REPORT_PHONE_2;
  process.env.OWNER_PHONE='000';process.env.REPORT_PHONE_2='';
  try {
    const scheduler=await load(sched);
    await scheduler.revisarReportes();assert.equal(sends.length,0);
    hour=18;await scheduler.revisarReportes();assert.equal(sends.length,1);
    assert.equal(sends[0].fileName,'cierre-tarde-2026-08-28.pdf');
    await scheduler.revisarReportes();assert.equal(sends.length,1);
    const restarted=await load(sched+'\n// restart');
    await restarted.revisarReportes();assert.equal(sends.length,1);
    assert.equal(stored.ultimaFechaTarde,'2026-08-28');
  } finally {
    if(oldPhone===undefined)delete process.env.OWNER_PHONE;else process.env.OWNER_PHONE=oldPhone;
    if(oldOther===undefined)delete process.env.REPORT_PHONE_2;else process.env.REPORT_PHONE_2=oldOther;
    delete globalThis.__reportPrisma;delete globalThis.__reportTest;
  }
});
