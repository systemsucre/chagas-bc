const { Router } = require("express");
const ReportesDiagnosticoDepto = require("../../../modelo/tratamiento/reportes/reportes_diagnostico_depto.js");


const rutas = Router();
const reportesDiagnosticoDepto = new ReportesDiagnosticoDepto();

rutas.post("/listar-parametros", async (req, res) => {
  try {
    const resultado = await reportesDiagnosticoDepto.listarParametros();
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/listar-grupos-etarios", async (req, res) => {
  try {
    const resultado = await reportesDiagnosticoDepto.listarGruposEtarios(req.body.grupo);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/listar-parametros-tipo-consulta", async (req, res) => {
  try {
    const resultado = await reportesDiagnosticoDepto.listarParametrosTipoConsulta();
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-consolidado", async (req, res) => {
  // console.log(req.body)
  try {
    const { fecha1, fecha2, grupo, grupoEtario, itemDiagnostico, estadoMujeres } = req.body
    const resultado = await reportesDiagnosticoDepto.buscarConsolidado(fecha1, fecha2, grupo, grupoEtario, itemDiagnostico, estadoMujeres);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-por-red", async (req, res) => {
  // console.log(req.body)
  try {
    const resultado = await reportesDiagnosticoDepto.buscarPorRed(req.body.fecha1, req.body.fecha2, req.body.red, req.body.grupo, req.body.grupoEtario, req.body.itemDiagnostico, req.body.estadoMujeres);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-por-municipio", async (req, res) => {
  // console.log(req.body)
  try {
    const resultado = await reportesDiagnosticoDepto.buscarPorMunicipio(req.body.fecha1, req.body.fecha2, req.body.municipio, req.body.grupo, req.body.grupoEtario, req.body.itemDiagnostico, req.body.estadoMujeres);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-por-hospital", async (req, res) => {
  // console.log(req.body)
  try {
    const resultado = await reportesDiagnosticoDepto.buscarPorHospital(req.body.fecha1, req.body.fecha2, req.body.hospital, req.body.grupo, req.body.grupoEtario, req.body.itemDiagnostico, req.body.estadoMujeres);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});


module.exports = rutas;  
