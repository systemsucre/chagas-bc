const { Router } = require("express");
const Laboratorio = require("../../../modelo/tratamiento/laboratorio/laboraotorio.js");
const { modificar, } = require("../../../validacion/tratamiento/laboratorio/laboratorio.js");


const rutas = Router();
const laboratorio = new Laboratorio();


rutas.post("/listar", async (req, res) => {
  try {
    // console.log(req.body);

    const resultado = await laboratorio.listar(req.body.sidhospital);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});


rutas.post("/buscar-paciente", async (req, res) => {
  try {
    const resultado = await laboratorio.buscarPaciente(req.body.datoPaciente);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});


rutas.post("/listar-parametros", async (req, res) => {
  try {
    const resultado = await laboratorio.listarParametros(req.body.codigo);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});



rutas.post("/modificar", modificar, async (req, res) => {
  // console.log("datos: ", req.body);
  try {
    const {
      conclusiones,
      observaciones,
      lista_resultados,
      user, nombreusuarioS, fecha_, sidhospital, shospital, sidmunicpio, smunicipio_des, sidred, sred_des,
    } = req.body;
    let datos = []

    // Obtener valores únicos del array eliminando duplicados
    console.log(lista_resultados, ' lista_resultados')
    if (lista_resultados.length < 1) {
      return res.json({
        ok: false,
        msg: "No hay resultados para actualizar, jajaja",
      });
    }

    let next = true
    for (let e of lista_resultados) {
      console.log(parseInt(e.positivo), parseInt(e.negativo), ' valores')
      if (!parseInt(e.positivo) || !parseInt(e.negativo)) {
        next = false
      }
    }

    if (!next) {
      return res.json({
        ok: false,
        msg: "No se puede actualizar los resultados de laboratorio, porque hay valores invalidos",
      });
    }

    for (let e of lista_resultados) {
      datos.push({
        conclusiones: conclusiones,
        observaciones: observaciones,
        id_medico_diagnostico: user,
        medico_diagnostico: nombreusuarioS,
        id_laboratorio: sidhospital,
        laboratorio: shospital,
        fecha_diagnostico: fecha_,
        positivo: e.positivo,
        negativo: e.negativo,
        id_municipio_laboratorio:sidmunicpio, 
        nombre_municipio_laboratorio:smunicipio_des, 
        id_red_laboratorio:sidred, 
        nombre_red_laboratorio:sred_des, 
        indeterminado: e.indeterminado,
        codigo: e.codigo,
        id_items_diagnostico: e.id_items_diagnostico,
      })
    }
    const resultado = await laboratorio.modificar(datos);

    if (!resultado)
      return res.json({
        ok: false,
        msg: "Operacion no permitida, la fecha de diagnostico es mayor a 30 dias",
      });

    else
      return res.json({
        ok: true,
        msg: "Resultados de laboratorio modificados correctamente",
      });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});



module.exports = rutas;
