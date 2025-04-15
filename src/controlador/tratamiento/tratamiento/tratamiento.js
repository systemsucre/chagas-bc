const { Router } = require("express");
const Tratamiento = require("../../../modelo/tratamiento/tratamiento/tratamiento.js");
const { insertar, modificar, } = require("../../../validacion/tratamiento/tratamiento/tratamiento.js");
const pool = require("../../../modelo/bdConfig.js");


const rutas = Router();
const tratamiento = new Tratamiento();

rutas.post("/listar", async (req, res) => {
  try {
    const resultado = await tratamiento.listar(req.body.paciente, req.body.user);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: error.sql });
  }
});


rutas.post("/listar-parametros-laboratorio", async (req, res) => {
  try {
    const resultado = await tratamiento.listarParametrosLaboratorio(req.body.paciente, req.body.fecha_, req.body.tratamiento);
    // console.log(resultado,)
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });

  }
})


rutas.post("/listar-datos-edicion", async (req, res) => {
  // console.log(req.body)
  try {
    const { consulta, paciente, usuario, } = req.body
    const resultado = await tratamiento.listarDatosEdicion({ consulta, paciente, usuario });
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});

rutas.post("/listar-consultas", async (req, res) => {
  try {
    const resultado = await tratamiento.listarConsultas(req.body.id);
    if (!resultado) return res.json({ ok: 404, msg: "Paciente no encontrado" });

    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});


rutas.post("/listar-datos-pdf", async (req, res) => {
  // console.log(req.body, ' llamando fun ')
  try {
    const { consulta, paciente, usuario, sidentidad, nombreusuarioS, servicioS, fecha_, usernameS, } = req.body

    const resultado = await tratamiento.listarTodosLosDatos(consulta, paciente, usuario, sidentidad);
    if (!resultado) return res.json({ ok: 404, msg: "Paciente no encontrado" });
    // resultado[1][0].entidad = sentidad
    // resultado[1][0].personal = nombreusuarioS
    // resultado[1][0].servicio = servicioS
    resultado[1][0].emision = fecha_
    resultado[1][0].usuario = nombreusuarioS
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: "Error al procesar la solicitud. Por favor intente nuevamente más tarde." });
  }
});






//registrar
rutas.post("/registrar", insertar, async (req, res) => {

  try {
    const {

      // DATOS PACIENTE
      id_paciente,
      nombre_paciente,
      id_grupo,
      grupo,
      id_grupo_etario,
      grupo_etario,
      edad,
      id_comunidad,
      comunidad,

      // grupo1 formulario
      notificacion,
      idSemana,
      semana,
      numero,
      mujerEmbarazada,
      fum,
      tutorMenorEdad,

      //Antecedentes Patologicos
      transfusionSangre,
      madreSerologica,
      tuboTransplante,
      carneMalCocida,
      otraInformacion,

      //RESIDENCIA ACTUAL DEL PACIENTE
      departamentoResidencia,
      municipioResidencia,
      comunidadResidencia,
      diasResidencia,
      mesesResidencia,
      añosResidencia,
      permanenciaResidencia,

      //ANTECEDENTES EPIDEMIOLÓGICOS
      viveZonaEndemica,
      departamentoEndemica,
      municipioEndemica,
      comunidadEndemica,
      barrioEndemica,

      //DATOS CLÍNICOS - CLASIFICACIÓN DE CASO
      //FASE AGUDA
      fechaInicioSintomasAgudas,
      asintomaticoAgudo,
      fiebreMayor7dias,
      chagomaInoculacion,
      signoRomaña,
      adenopatia,
      irritabilidad,
      diarreas,
      hepatoesplenomegalia,
      convulsiones,
      otrosSintomasAgudos,

      // FASE CRÓNICA
      fechaInicioSintomasCronicas,
      asintomaticoCronico,
      alteracionesCardiacas,
      alteracionesDigestivas,
      alteracionesNerviosas,
      alteracionesAnedopatia,
      otrosSintomasCronicas,

      //FORMA DE TRANSMISIÓN
      oral,
      vectorial,
      congenito,
      transfucional,
      transplante,
      otrasTransmisiones,

      // CLASIFICACIÓN DEL CASO
      agudo,
      cronico,

      // EXÁMENES DE LABORATORIO
      sangre_total, // true:sangre total, false:suero o plasma
      idLaboratorio,
      laboratorio,
      fechaTomaMuestra,
      lista,

      //REACCIONES ADVERSAS
      idReaccionDermatologica,
      reaccionDermatologica,
      idReaccionDigestiva,
      reaccionDigestiva,
      idReaccionNeurologica,
      reaccionNeurologica,
      idReaccionHematologica,
      reaccionHematologica,

      // OTRA INFORMACION
      epidemica,
      complementarios,
      idMedicamento,
      medicamento,
      dosis,
      idMujeresTratamiento,
      mujeresTratamiento,
      idSuspension,
      suspension,
      idAbandono,
      abandono,
      idHospital, // hospital de referencia,
      hospital, // nombre hospital de referencia
      id_pre_quirurgico,
      pre_quirurgico,
      id_post_tratamiento,
      post_tratamiento,
      id_estado_mujeres,
      estado_mujeres,
      observacion,

      // datos del servidor
      fecha_,
      user,
      usernameS,
      nombreusuarioS,
      sidhospital,
      shospital,
      sidmunicpio,
      smunicipio_des,
      sidred,
      sred_des,
    } = req.body;
    let lista_ = lista.flat()
    if (lista_.length < 1) {
      res.json({ msg: 'no se encontró examenes de laboratorio asociado', ok: false })
      return
    }
    if (numero < 1) {
      res.json({ msg: 'El numero de tratamiento deberia ser mayor a 1', ok: false })
      return
    }
    if (viveZonaEndemica) {
      if (!departamentoEndemica || !municipioEndemica || !comunidadEndemica) {
        res.json({ msg: 'indique correctamente los lugares de residencia', ok: false })
        return
      }
    }
    if (!agudo && !cronico) {
      res.json({ msg: 'seleccione si el caso es crónico o agudo', ok: false })
      return
    }

    const [rowsMunicipioRedLaboratorio] = await pool.query(`
      SELECT m.id as id_municipio, m.nombre as municipio,
            r.id as id_res, r.nombre as red
      from hospital h
      inner join municipio m on m.id = h.municipio 
      inner join red r on r.id = m.red
      where  h.id = ${pool.escape(idLaboratorio)}`);

    if (rowsMunicipioRedLaboratorio.length == 0) {
      res.json({ msg: 'Laboratorio no encontrado', ok: false })
      return
    }

    let diagnostico = [];
    let codigo = 'L-' + shospital + '' + fecha_.split('-')[0] + '' + fecha_.split('-')[1] + fecha_.split('-')[2].split(' ')[0] + '-' +
      fecha_.split('-')[2].split(' ')[1].split(':')[0] + ' ' + fecha_.split('-')[2].split(' ')[1].split(':')[2] + '' + fecha_.split('-')[2].split(' ')[1].split(':')[2]



    for (let d of lista_) {
      diagnostico.push({
        id_tratamiento: null,
        id_items_diagnostico: d.value,
        items_diagnostico: d.label,
        id_paciente: id_paciente,
        paciente: nombre_paciente,
        fecha_notificacion: notificacion,
        fecha_toma_muestra: fechaTomaMuestra,
        edad,
        id_grupo_etario,
        grupo_etario,
        id_grupo,
        grupo,
        id_hospital: sidhospital,
        hospital: shospital,
        id_laboratorio: idLaboratorio,
        laboratorio,
        id_comunidad,
        comunidad,
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
        positivo: d.norealizado == true ? 0 : d.positivo,
        negativo: d.norealizado == true ? 0 : d.negativo,
        indeterminado: d.norealizado == true ? 0 : d.indeterminado,
        codigo,
        id_municipio_laboratorio: rowsMunicipioRedLaboratorio[0].id_municipio,
        nombre_municipio_laboratorio: rowsMunicipioRedLaboratorio[0].municipio,
        id_red_laboratorio: rowsMunicipioRedLaboratorio[0].id_red,
        nombre_red_laboratorio: rowsMunicipioRedLaboratorio[0].red,
        created_at: fecha_,
        sangre_total: sangre_total == true ? 1 : 0,
        suero_plasma: sangre_total == true ? 0 : 1,
      })
    }
    let datosTratamiento = {
      id_paciente,
      nombre_paciente,
      id_comunidad,
      comunidad,
      id_hospital: sidhospital,
      hospital: shospital,
      id_municipio: sidmunicpio,
      municipio: smunicipio_des,
      id_red: sidred,
      red: sred_des,
      id_usuario: user,
      usuario: nombreusuarioS,
      idSemana,
      semana,
      numero,
      notificacion,
      mujerEmbarazada,
      fum,
      tutorMenorEdad,

      //Antecedentes Patologicos
      transfusionSangre,
      madreSerologica,
      tuboTransplante,
      carneMalCocida,
      otraInformacion,

      //RESIDENCIA ACTUAL DEL PACIENTE
      departamentoResidencia,
      municipioResidencia,
      comunidadResidencia,
      diasResidencia,
      mesesResidencia,
      añosResidencia,
      permanenciaResidencia,

      //ANTECEDENTES EPIDEMIOLÓGICOS
      viveZonaEndemica,
      departamentoEndemica,
      municipioEndemica,
      comunidadEndemica,
      barrioEndemica,

      //DATOS CLÍNICOS - CLASIFICACIÓN DE CASO
      //FASE AGUDA
      fechaInicioSintomasAgudas,
      asintomaticoAgudo,
      fiebreMayor7dias,
      chagomaInoculacion,
      signoRomaña,
      adenopatia,
      irritabilidad,
      diarreas,
      hepatoesplenomegalia,
      convulsiones,
      otrosSintomasAgudos,

      // FASE CRÓNICA
      fechaInicioSintomasCronicas,
      asintomaticoCronico,
      alteracionesCardiacas,
      alteracionesDigestivas,
      alteracionesNerviosas,
      alteracionesAnedopatia,
      otrosSintomasCronicas,

      //FORMA DE TRANSMISIÓN
      oral,
      vectorial,
      congenito,
      transfucional,
      transplante,
      otrasTransmisiones,

      // CLASIFICACIÓN DEL CASO
      agudo,
      cronico,


      // EXÁMENES DE LABORATORIO
      sangreTotal: sangre_total ? 1 : 0,
      sueroPlasma: !sangre_total ? 1 : 0,
      idLaboratorio,
      laboratorio,
      fechaTomaMuestra,

      //REACCIONES ADVERSAS
      idReaccionDermatologica,
      reaccionDermatologica,
      idReaccionDigestiva,
      reaccionDigestiva,
      idReaccionNeurologica,
      reaccionNeurologica,
      idReaccionHematologica,
      reaccionHematologica,

      // OTRA INFORMACION
      epidemica,
      complementarios,
      idMedicamento,
      medicamento,
      dosis,
      idMujeresTratamiento,
      mujeresTratamiento,
      idSuspension,
      suspension,
      idAbandono,
      abandono,
      id_hospital_ref: idHospital, // hospital de referencia,
      hospital_ref: hospital, // nombre hospital de referencia
      id_pre_quirurgico,
      pre_quirurgico,
      id_post_tratamiento,
      post_tratamiento,
      id_estado_mujeres,
      estado_mujeres,
      observacion,
      created_at: fecha_,
    }



    if (id_paciente) {
      const resultado = await tratamiento.insertar(datosTratamiento, diagnostico);

      if (!resultado)
        return res.json({
          ok: false,
          msg: "Fallo al registrar Tratamiento",
        });

      else
        return res.json({
          ok: true,
          msg: " Tratamiento registrado correctamente",
        });
    }
    else return res.json({ ok: false, msg: " Paciente no encontrado " });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error al conectar con el servidor", ok: false });
  }
});


rutas.post("/modificar", modificar, async (req, res) => {

  try {
    const {
      id,
      // DATOS PACIENTE
      id_paciente,
      nombre_paciente,
      id_grupo,
      grupo,
      id_grupo_etario,
      grupo_etario,
      edad,
      id_comunidad,
      comunidad,

      // grupo1 formulario
      notificacion,
      idSemana,
      semana,
      numero,
      mujerEmbarazada,
      fum,
      tutorMenorEdad,

      //Antecedentes Patologicos
      transfusionSangre,
      madreSerologica,
      tuboTransplante,
      carneMalCocida,
      otraInformacion,

      //RESIDENCIA ACTUAL DEL PACIENTE
      departamentoResidencia,
      municipioResidencia,
      comunidadResidencia,
      diasResidencia,
      mesesResidencia,
      añosResidencia,
      permanenciaResidencia,

      //ANTECEDENTES EPIDEMIOLÓGICOS
      viveZonaEndemica,
      departamentoEndemica,
      municipioEndemica,
      comunidadEndemica,
      barrioEndemica,

      //DATOS CLÍNICOS - CLASIFICACIÓN DE CASO
      //FASE AGUDA
      fechaInicioSintomasAgudas,
      asintomaticoAgudo,
      fiebreMayor7dias,
      chagomaInoculacion,
      signoRomaña,
      adenopatia,
      irritabilidad,
      diarreas,
      hepatoesplenomegalia,
      convulsiones,
      otrosSintomasAgudos,

      // FASE CRÓNICA
      fechaInicioSintomasCronicas,
      asintomaticoCronico,
      alteracionesCardiacas,
      alteracionesDigestivas,
      alteracionesNerviosas,
      alteracionesAnedopatia,
      otrosSintomasCronicas,

      //FORMA DE TRANSMISIÓN
      oral,
      vectorial,
      congenito,
      transfucional,
      transplante,
      otrasTransmisiones,

      // CLASIFICACIÓN DEL CASO
      agudo,
      cronico,

      // EXÁMENES DE LABORATORIO
      sangre_total, // true:sangre total, false:suero o plasma
      idLaboratorio,
      laboratorio,
      fechaTomaMuestra,
      lista,

      //REACCIONES ADVERSAS
      idReaccionDermatologica,
      reaccionDermatologica,
      idReaccionDigestiva,
      reaccionDigestiva,
      idReaccionNeurologica,
      reaccionNeurologica,
      idReaccionHematologica,
      reaccionHematologica,

      // OTRA INFORMACION
      epidemica,
      complementarios,
      idMedicamento,
      medicamento,
      dosis,
      idMujeresTratamiento,
      mujeresTratamiento,
      idSuspension,
      suspension,
      idAbandono,
      abandono,
      idHospital, // hospital de referencia,
      hospital, // nombre hospital de referencia
      id_pre_quirurgico,
      pre_quirurgico,
      id_post_tratamiento,
      post_tratamiento,
      id_estado_mujeres,
      estado_mujeres,
      observacion,

      // datos del servidor
      fecha_,
      user,
      usernameS,
      nombreusuarioS,
      sidhospital,
      shospital,
      sidmunicpio,
      smunicipio_des,
      sidred,
      sred_des,
      codigo
    } = req.body;
    let lista_ = lista.flat()
    console.log(lista_, ' lista de examenes')
    if (lista_.length < 1) {
      res.json({ msg: 'no se encontró examenes de laboratorio asociado', ok: false })
      return
    }
    if (numero < 1) {
      res.json({ msg: 'El numero de tratamiento deberia ser mayor a 1', ok: false })
      return
    }
    if (viveZonaEndemica) {
      if (!departamentoEndemica || !municipioEndemica || !comunidadEndemica) {
        res.json({ msg: 'indique correctamente los lugares de residencia', ok: false })
        return
      }
    }
    if (!agudo && !cronico) {
      res.json({ msg: 'seleccione si el caso es crónico o agudo', ok: false })
      return
    }

    const [rowsMunicipioRedLaboratorio] = await pool.query(`
      SELECT m.id as id_municipio, m.nombre as municipio,
            r.id as id_res, r.nombre as red
      from hospital h
      inner join municipio m on m.id = h.municipio 
      inner join red r on r.id = m.red
      where  h.id = ${pool.escape(idLaboratorio)}`);

    if (rowsMunicipioRedLaboratorio.length == 0) {
      res.json({ msg: 'Laboratorio no encontrado', ok: false })
      return
    }

    let diagnostico = [];

    for (let d of lista_) {
      diagnostico.push({
        id_tratamiento: id,
        id_items_diagnostico: d.value,
        items_diagnostico: d.label,
        id_paciente: id_paciente,
        paciente: nombre_paciente,
        fecha_notificacion: notificacion,
        fecha_toma_muestra: fechaTomaMuestra,
        edad,
        id_grupo_etario,
        grupo_etario,
        id_grupo,
        grupo,
        id_hospital: sidhospital,
        hospital: shospital,
        id_laboratorio: idLaboratorio,
        laboratorio,
        id_comunidad,
        comunidad,
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
        positivo: d.norealizado == true ? 0 : d.positivo,
        negativo: d.norealizado == true ? 0 : d.negativo,
        indeterminado: d.norealizado == true ? 0 : d.indeterminado,
        codigo,
        id_municipio_laboratorio: rowsMunicipioRedLaboratorio[0].id_municipio,
        nombre_municipio_laboratorio: rowsMunicipioRedLaboratorio[0].municipio,
        id_red_laboratorio: rowsMunicipioRedLaboratorio[0].id_red,
        nombre_red_laboratorio: rowsMunicipioRedLaboratorio[0].red,
        created_at: fecha_,
        sangre_total: sangre_total == true ? 1 : 0,
        suero_plasma: sangre_total == true ? 0 : 1,
      })
    }
    let datosTratamiento = {
      id,
      id_paciente,
      nombre_paciente,
      id_comunidad,
      comunidad,
      id_hospital: sidhospital,
      hospital: shospital,
      id_municipio: sidmunicpio,
      municipio: smunicipio_des,
      id_red: sidred,
      red: sred_des,
      id_usuario: user,
      usuario: nombreusuarioS,
      idSemana,
      semana,
      numero,
      notificacion,
      mujerEmbarazada,
      fum,
      tutorMenorEdad,

      //Antecedentes Patologicos
      transfusionSangre,
      madreSerologica,
      tuboTransplante,
      carneMalCocida,
      otraInformacion,

      //RESIDENCIA ACTUAL DEL PACIENTE
      departamentoResidencia,
      municipioResidencia,
      comunidadResidencia,
      diasResidencia,
      mesesResidencia,
      añosResidencia,
      permanenciaResidencia,

      //ANTECEDENTES EPIDEMIOLÓGICOS
      viveZonaEndemica,
      departamentoEndemica,
      municipioEndemica,
      comunidadEndemica,
      barrioEndemica,

      //DATOS CLÍNICOS - CLASIFICACIÓN DE CASO
      //FASE AGUDA
      fechaInicioSintomasAgudas,
      asintomaticoAgudo,
      fiebreMayor7dias,
      chagomaInoculacion,
      signoRomaña,
      adenopatia,
      irritabilidad,
      diarreas,
      hepatoesplenomegalia,
      convulsiones,
      otrosSintomasAgudos,

      // FASE CRÓNICA
      fechaInicioSintomasCronicas,
      asintomaticoCronico,
      alteracionesCardiacas,
      alteracionesDigestivas,
      alteracionesNerviosas,
      alteracionesAnedopatia,
      otrosSintomasCronicas,

      //FORMA DE TRANSMISIÓN
      oral,
      vectorial,
      congenito,
      transfucional,
      transplante,
      otrasTransmisiones,

      // CLASIFICACIÓN DEL CASO
      agudo,
      cronico,


      // EXÁMENES DE LABORATORIO
      sangreTotal: sangre_total ? 1 : 0,
      sueroPlasma: !sangre_total ? 1 : 0,
      idLaboratorio,
      laboratorio,
      fechaTomaMuestra,

      //REACCIONES ADVERSAS
      idReaccionDermatologica,
      reaccionDermatologica,
      idReaccionDigestiva,
      reaccionDigestiva,
      idReaccionNeurologica,
      reaccionNeurologica,
      idReaccionHematologica,
      reaccionHematologica,

      // OTRA INFORMACION
      epidemica,
      complementarios,
      idMedicamento,
      medicamento,
      dosis,
      idMujeresTratamiento,
      mujeresTratamiento,
      idSuspension,
      suspension,
      idAbandono,
      abandono,
      id_hospital_ref: idHospital, // hospital de referencia,
      hospital_ref: hospital, // nombre hospital de referencia
      id_pre_quirurgico,
      pre_quirurgico,
      id_post_tratamiento,
      post_tratamiento,
      id_estado_mujeres,
      estado_mujeres,
      observacion,
      modified_at: fecha_,
    }



    if (id_paciente) {
      const resultado = await tratamiento.editar(datosTratamiento, diagnostico);

      if (!resultado)
        return res.json({
          ok: false,
          msg: "Error al guardar el registro",
        });

      else
        return res.json({
          ok: true,
          msg: " Registro actualizado correctamente",
        });
    }
    else return res.json({ ok: false, msg: " Paciente no encontrado " });
  } catch (error) {
    console.log(error);
    return res.json({ msg: "Error en el Servidor", ok: false });
  }
});

rutas.post("/eliminar", async (req, res) => {

  try {
    console.log(req.body.tratamiento)
    const resultado = await tratamiento.eliminar(req.body.tratamiento, req.body.user, req.body.nombreusuarioS, req.body.fecha_, req.body.sidhospital);

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
    return res.json({ msg: "No se pudo eliminar el registro, existen consultas asociadas", ok: false });
  }
});




module.exports = rutas;
