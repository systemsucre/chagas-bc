const { Router } = require("express");
const Diagnostico = require("../../../modelo/tratamiento/tratamiento/diagnostico.js");
const { insertar, modificar, } = require("../../../validacion/tratamiento/tratamiento/diagnostico.js");


const rutas = Router();
const diagnostico = new Diagnostico();

rutas.post("/listar", async (req, res) => {
  try {
    // console.log(req.body);

    const resultado = await diagnostico.listar(req.body.id_paciente, req.body.user); 
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/listar-parametros", async (req, res) => {
  try {
    const resultado = await diagnostico.listarParametros(req.body.codigo);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/listar-grupo-etario", async (req, res) => {
  try {
    const resultado = await diagnostico.listarGrupoEtario(req.body.id_grupo);
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
      fecha_solicitud, id_grupo, grupo, id_grupo_etario, grupo_etario, edad, id_pre_quirurgico, pre_quirurgico,
      id_post_tratamiento, post_tratamiento, id_estado_mujeres, estado_mujeres, id_paciente, paciente, listaFinalAdmitidos,
      user, nombreusuarioS, fecha_, id_comunidad, comunidad, sidhospital, shospital, sidmunicpio, smunicipio_des, sidred, sred_des
    } = req.body;
    let datos = []

    // Obtener valores únicos del array eliminando duplicados
    const listaFinalAdmitidosUnicos = [...new Set(listaFinalAdmitidos)];
    if (listaFinalAdmitidosUnicos.length > 0) {

      let codigo = 'C-' + sidhospital + '' + fecha_.split('-')[0] + '' + fecha_.split('-')[1] + fecha_.split('-')[2].split(' ')[0] + '-' +
        fecha_.split('-')[2].split(' ')[1].split(':')[0] + ' ' + fecha_.split('-')[2].split(' ')[1].split(':')[2] + '' + fecha_.split('-')[2].split(' ')[1].split(':')[2]

      for (let e of listaFinalAdmitidosUnicos) {
        datos.push({
          id_items_diagnostico: e.value,
          items_diagnostico: e.label,
          id_paciente,
          paciente,
          fecha_solicitud,
          edad,
          id_grupo,
          grupo,
          id_grupo_etario,
          grupo_etario,
          id_comunidad, 
          comunidad, 
          id_medico_solicitante: user,
          medico_solicitante: nombreusuarioS, 
          id_hospital: sidhospital,
          hospital: shospital,
          id_municipio: sidmunicpio,
          municipio: smunicipio_des,
          id_red: sidred,
          red: sred_des,
          id_pre_quirurgico,
          pre_quirurgico,
          id_post_tratamiento,
          post_tratamiento,
          id_estado_mujeres,
          estado_mujeres,
          created: fecha_,
          codigo
        })
      }


      const resultado = await diagnostico.insertar(datos);

      if (!resultado)
        return res.json({
          ok: false,
          msg: "Fallo al registrar diagnostico",
        });

      else
        return res.json({
          ok: true,
          msg: " Consulta registrada correctamente",
        });
    }
    else return res.json({ ok: false, msg: "Por favor seleccione al menos un examen para registrar la solicitud" });

  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error al conectar con el servidor", ok: false });
  }
});


rutas.post("/modificar", modificar, async (req, res) => {
  console.log("datos: ", req.body);
  try {
    const {
      fecha_solicitud, id_grupo, grupo, id_grupo_etario, grupo_etario, edad, id_pre_quirurgico, pre_quirurgico,
      id_post_tratamiento, post_tratamiento, id_estado_mujeres, estado_mujeres, id_paciente, paciente, listaFinalAdmitidos,
      user, nombreusuarioS, fecha_, id_comunidad, comunidad, sidhospital, shospital, sidmunicpio, smunicipio_des, sidred, sred_des, codigo
    } = req.body;
    let datos = []

    // Obtener valores únicos del array eliminando duplicados
    const listaFinalAdmitidosUnicos = [...new Set(listaFinalAdmitidos)];
    if (listaFinalAdmitidosUnicos.length > 0) {

      for (let e of listaFinalAdmitidosUnicos) {
        datos.push({
          id_items_diagnostico: e.value,
          items_diagnostico: e.label,
          id_paciente,
          paciente,
          fecha_solicitud,
          edad,
          id_grupo,
          grupo,
          id_grupo_etario,
          grupo_etario,
          id_comunidad,
          comunidad,
          id_medico_solicitante: user,
          medico_solicitante: nombreusuarioS,
          id_hospital: sidhospital,
          hospital: shospital,
          id_municipio: sidmunicpio,
          municipio: smunicipio_des,
          id_red: sidred,
          red: sred_des,
          id_pre_quirurgico,
          pre_quirurgico,
          id_post_tratamiento,
          post_tratamiento,
          id_estado_mujeres,
          estado_mujeres,
          created: fecha_,
          codigo
        })
      }
    }
    const resultado = await diagnostico.modificar(datos);

    if (!resultado)
      return res.json({
        ok: false,
        msg: "Fallo al Actualizar consulta",
      });

    if (resultado == -1)
      return res.json({
        ok: false,
        msg: "El diagnostico ya tiene resultados de laboratorio",
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
    const resultado = await diagnostico.eliminar(req.body.codigo, req.body.user);

    if (!resultado)
      return res.json({
        ok: false,
        msg: "Registro no eliminado, Puede que ya tenga resultados de laboratorio",
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
