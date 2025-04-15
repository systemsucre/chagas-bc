const { Router } = require("express");
const Consultas = require("../../../modelo/tratamiento/tratamiento/consultas.js");
const { insertar, modificar, } = require("../../../validacion/tratamiento/tratamiento/consultas.js");


const rutas = Router();
const consultas = new Consultas();

rutas.post("/listar", async (req, res) => { 
  try {
  // console.log(req.body);

    const resultado = await consultas.listar(req.body.id_tratamiento, req.body.user);
    return res.json({ data: resultado, ok: true });   
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/listar-parametros", async (req, res) => {
  try {
    const resultado = await consultas.listarParametros(req.body.id_consulta); 
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});


rutas.post("/registrar", insertar, async (req, res) => {
  // console.log("datos: ", req.body);

  try {
    const {
      id_tratamiento, id_medicamento, medicamento, dosis,  id_paciente, listaItemsLaboratorioAdmitidos,
      id_mujeres_tratamiento, mujeres_tratamiento, id_reaccion_dermatologica, reaccion_dermatologica,
      id_reaccion_digestiva, reaccion_digestiva, id_reaccion_neurologica, reaccion_neurologica,
      id_reaccion_hematologica, reaccion_hematologica, fecha_, sidhospital, shospital, fecha_consulta, user, nombreusuarioS
    } = req.body;
    const datos = {
      id_tratamiento, id_medicamento, medicamento, dosis,
      id_mujeres_tratamiento, mujeres_tratamiento, id_reaccion_dermatologica, reaccion_dermatologica,
      id_reaccion_digestiva, reaccion_digestiva, id_reaccion_neurologica, reaccion_neurologica,
      id_reaccion_hematologica, reaccion_hematologica, created: fecha_, id_hospital: sidhospital, hospital: shospital, fecha_consulta, id_medico: user, medico: nombreusuarioS
    };
    // Obtener valores únicos del array eliminando duplicados
    const listaItemsLaboratorioUnicos = [...new Set(listaItemsLaboratorioAdmitidos)];
    if (id_tratamiento) {
      const resultado = await consultas.insertar(datos, id_paciente, listaItemsLaboratorioUnicos);

      if (!resultado)
        return res.json({
          ok: false,
          msg: "Fallo al registrar consulta",
        });

      else
        return res.json({
          ok: true,
          msg: " Consulta registrada correctamente",
        });
    }
    else return res.json({ ok: false, msg: " Tratamiento no encontrado " });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error al conectar con el servidor", ok: false });
  }
});


rutas.post("/modificar", modificar, async (req, res) => {
  // console.log("datos: ", req.body);
  try { 
    const {
      id, id_tratamiento, id_paciente, id_medicamento, medicamento, dosis,  listaItemsLaboratorioAdmitidos,
      id_mujeres_tratamiento, mujeres_tratamiento, id_reaccion_dermatologica, reaccion_dermatologica,
      id_reaccion_digestiva, reaccion_digestiva, id_reaccion_neurologica, reaccion_neurologica, fecha_consulta,
      id_reaccion_hematologica, reaccion_hematologica, id_items_laboratorio, items_laboratorio, fecha_, user, nombreusuarioS
    } = req.body;
    const listaItemsLaboratorioUnicos = [...new Set(listaItemsLaboratorioAdmitidos)];
    // console.log(listaItemsLaboratorioUnicos);
    const datos = {
      id, id_tratamiento, id_paciente, id_medicamento, medicamento, dosis, listaItemsLaboratorioUnicos,
      id_mujeres_tratamiento, mujeres_tratamiento, id_reaccion_dermatologica, reaccion_dermatologica, fecha_consulta,
      id_reaccion_digestiva, reaccion_digestiva, id_reaccion_neurologica, reaccion_neurologica,
      id_reaccion_hematologica, reaccion_hematologica, id_items_laboratorio, items_laboratorio, modified: fecha_, medico: user, userName: nombreusuarioS
    };
   

    const resultado = await consultas.modificar(datos);

    if (!resultado)
      return res.json({
        ok: false,
        msg: "Fallo al Actualizar consulta",
      });

    else
      return res.json({
        ok: true,
        msg: " consulta modificada correctamente",
      });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});

rutas.post("/eliminar", async (req, res) => {
  try {
    const resultado = await consultas.eliminar(req.body.consulta, req.body.user, req.body.fecha_, req.body.nombreusuarioS);

    if (!resultado)
      return res.json({
        ok: false,
        msg: "Registro no eliminado",
      });

    else
      return res.json({
        ok: true,
        msg: " Registro eliminado correctamente",
      });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Existe uno o mas resultados de laboratorio pendientes de registrar", ok: false });
  }
});




module.exports = rutas;
