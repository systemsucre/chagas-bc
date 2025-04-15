const { Router } = require("express");
const ReportesTratamientoDepto = require("../../../modelo/tratamiento/reportes/reportes_tratamiento_depto.js");


const rutas = Router();
const reportesTratamientoDepto = new ReportesTratamientoDepto();

rutas.post("/listar-parametros", async (req, res) => {
  try {
    const resultado = await reportesTratamientoDepto.listarParametros();
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});
rutas.post("/listar-grupos-etarios", async (req, res) => {
  try {
    const resultado = await reportesTratamientoDepto.listarGruposEtarios(req.body.grupo);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});
rutas.post("/listar-parametros-tipo-consulta", async (req, res) => {
  try {
    const resultado = await reportesTratamientoDepto.listarParametrosTipoConsulta();
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-consolidado", async (req, res) => {
  // console.log(req.body)
  try {
    const resultado = await reportesTratamientoDepto.buscarConsolidado(req.body.fecha1, req.body.fecha2, req.body.grupo, req.body.grupoEtario, req.body.idMedicamento, req.body.idMujeresTratamiento, req.body.idReaccionDermatologica, req.body.idReaccionDigestiva, req.body.idReaccionNeurologica, req.body.idReaccionHematologica,);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-por-red", async (req, res) => {
  // console.log(req.body)
  try {
    const resultado = await reportesTratamientoDepto.buscarPorRed(req.body.fecha1, req.body.fecha2, req.body.red, req.body.grupo, req.body.grupoEtario, req.body.idMedicamento, req.body.idMujeresTratamiento, req.body.idReaccionDermatologica, req.body.idReaccionDigestiva, req.body.idReaccionNeurologica, req.body.idReaccionHematologica);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-por-municipio", async (req, res) => {
  // console.log(req.body)
  try {
    const resultado = await reportesTratamientoDepto.buscarPorMunicipio(req.body.fecha1, req.body.fecha2, req.body.municipio, req.body.grupo, req.body.grupoEtario, req.body.idMedicamento, req.body.idMujeresTratamiento, req.body.idReaccionDermatologica, req.body.idReaccionDigestiva, req.body.idReaccionNeurologica, req.body.idReaccionHematologica);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/buscar-por-hospital", async (req, res) => {
  // console.log(req.body)
  try {
    const resultado = await reportesTratamientoDepto.buscarPorHospital(req.body.fecha1, req.body.fecha2, req.body.hospital, req.body.grupo, req.body.grupoEtario, req.body.idMedicamento, req.body.idMujeresTratamiento, req.body.idReaccionDermatologica, req.body.idReaccionDigestiva, req.body.idReaccionNeurologica, req.body.idReaccionHematologica);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});




module.exports = rutas;  
