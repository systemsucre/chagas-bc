const pool = require("../../../modelo/bdConfig.js");

module.exports = class Tratamiento {
  // METODOS
  listar = async (paciente, medico,) => {
    const sql = `SELECT 
                *
                from tratamiento 
                where id_paciente = ${pool.escape(paciente)} order by created_at desc`;
    const [rows] = await pool.query(sql);
    for (let r of rows) { r.id_usuario == medico ? r.edit = true : false }

    const [rowsPaciente] = await pool.query(`SELECT ci, nombre, ap1, ap2, DATE_FORMAT(fecha_nac, "%Y/%m/%d") as fecha_nacimiento, comunidad, comunidad_nombre from paciente where id = ${pool.escape(paciente)}`);
    const [rowsSuspension] = await pool.query(`SELECT id as value, nombre as label from suspension where estado = 1`);
    const [rowsAbandono] = await pool.query(`SELECT id as value, nombre as label from abandono where estado = 1`);
    const [rowsHospital] = await pool.query(`SELECT id as value, nombre as label from hospital where estado = 1`);

    return [rows, rowsPaciente, rowsSuspension, rowsAbandono, rowsHospital];
  };

  // funciones parametros de laboratorio
  listarParametrosLaboratorio = async (id_paciente, fechas, tratamiento) => {

    const [rowsPaciente] = await pool.query(`SELECT p.ci, p.id, concat(p.nombre,' ', p.ap1,' ', p.ap2) as nombre,  if(p.sexo = 1, 'Masculino', 'Femenino') as sexo,
      DATE_FORMAT(p.fecha_nac, "%Y/%m/%d") as fecha_nacimiento, c.id as id_comunidad, c.nombre as comunidad
      from paciente p 
      left join comunidad c on c.id = p.comunidad
      left join diagnostico d on d.id_paciente = p.id  
      where p.id = ${pool.escape(id_paciente)}`);

    const [rowsGrupos] = await pool.query(`SELECT id as value, nombre as label  from grupo where estado = 1`);
    const [rowsGruposEtario] = await pool.query(`SELECT id, descripcion as label, inf, sup, id_grupo,categoria_tiempo as categoria from grupo_etario where estado = 1`);
    let rowsItemsDiagnosticos = null

    if (tratamiento) {
      [rowsItemsDiagnosticos] = await pool.query(`
        SELECT id_items_diagnostico as value, items_diagnostico as label,  positivo, negativo, indeterminado, if(positivo=0 && negativo=0 && indeterminado=0, true, false ) as norealizado, codigo from diagnostico where id_tratamiento = ${pool.escape(tratamiento)}`)
    } else[rowsItemsDiagnosticos] = await pool.query(`SELECT id as value, nombre as label, false as positivo, false as negativo, false as indeterminado, true as norealizado  from items_diagnostico where estado = 1`)

    const [rowsSemana] = await pool.query(`SELECT s.id as value, concat(s.num_semana ,' - ',g.gestion) as label from semana s inner join gestion g on g.id = s.id_gestion 
                                    where ${pool.escape(fechas)} >= s.ini and ${pool.escape(fechas)} <= s.fin`);
    const [rowsMedicamento] = await pool.query(`SELECT id as value, nombre as label from medicamentos where estado = 1`);
    const [rowsMujeresTratamiento] = await pool.query(`SELECT id as value, nombre as label from mujeres_tratamiento where estado = 1`);
    const [rowsReaccionDermatologica] = await pool.query(`SELECT id as value, nombre as label from reaccion_dermatologica where estado = 1`);
    const [rowsReaccionDigestiva] = await pool.query(`SELECT id as value, nombre as label from reaccion_digestiva where estado = 1`);
    const [rowsReaccionNeurologica] = await pool.query(`SELECT id as value, nombre as label from reaccion_neurologica where estado = 1`);
    const [rowsReaccionHematologica] = await pool.query(`SELECT id as value, nombre as label from reaccion_hematologica where estado = 1`);
    const [rowsLaboratorios] = await pool.query(`SELECT h.id as value,concat(m.nombre ,' - ',h.nombre) as label from hospital h 
                                                inner join municipio m on m.id = h.municipio  where h.laboratorio = 1 and h.estado = 1`);

    return [rowsPaciente, rowsGrupos, rowsGruposEtario, rowsItemsDiagnosticos, rowsSemana, rowsMedicamento, rowsMujeresTratamiento, rowsReaccionDermatologica, rowsReaccionDigestiva, rowsReaccionNeurologica, rowsReaccionHematologica, rowsLaboratorios]
  }

  listarGrupoEtario = async (id_grupo) => {
    const [rowsGruposEtario] = await pool.query(`SELECT id as value, descripcion as label  from grupo_etario where estado = 1 and id_grupo = ${pool.escape(id_grupo)}`);
    return rowsGruposEtario;
  }

  insertar = async (tratamiento, diagnostico) => {

    const [result] = await pool.query("INSERT INTO tratamiento SET  ?", tratamiento);
    if (result.insertId > 0) {
      for (let d of diagnostico) {
        d.id_tratamiento = result.insertId
        await pool.query("INSERT INTO diagnostico SET  ?", d);
      }
      return true;
    } else return false
  };


  editar = async (datos, diagnostico) => {
    const [result_recover] = await pool.query(`select * from tratamiento WHERE id = ${pool.escape(datos.id)}`);
    const sql = `UPDATE tratamiento SET
                nombre_paciente=${pool.escape(datos.nombre_paciente)},
                id_comunidad=${pool.escape(datos.id_comunidad)},
                comunidad=${pool.escape(datos.comunidad)},
                semana  =${pool.escape(datos.semana)},
                idSemana  =${pool.escape(datos.idSemana)},
                numero =${pool.escape(datos.numero)},
                notificacion  =${pool.escape(datos.notificacion)},
                mujerEmbarazada  =${pool.escape(datos.mujerEmbarazada)},
                fum  =${pool.escape(datos.fum)},
                tutorMenorEdad  =${pool.escape(datos.tutorMenorEdad)},
                transfusionSangre  =${pool.escape(datos.transfusionSangre)},
                madreSerologica  =${pool.escape(datos.madreSerologica)},
                tuboTransplante  =${pool.escape(datos.tuboTransplante)},
                carneMalCocida  =${pool.escape(datos.carneMalCocida)},
                otraInformacion  =${pool.escape(datos.otraInformacion)},
                departamentoResidencia  =${pool.escape(datos.departamentoResidencia)},
                municipioResidencia  =${pool.escape(datos.municipioResidencia)},
                comunidadResidencia  =${pool.escape(datos.comunidadResidencia)},
                diasResidencia  =${pool.escape(datos.diasResidencia)},
                mesesResidencia  =${pool.escape(datos.mesesResidencia)},
                añosResidencia  =${pool.escape(datos.añosResidencia)},
                permanenciaResidencia  =${pool.escape(datos.permanenciaResidencia)},
                viveZonaEndemica  =${pool.escape(datos.viveZonaEndemica)},
                departamentoEndemica  =${pool.escape(datos.departamentoEndemica)},
                municipioEndemica  =${pool.escape(datos.municipioEndemica)},
                comunidadEndemica  =${pool.escape(datos.comunidadEndemica)},
                barrioEndemica  =${pool.escape(datos.barrioEndemica)},
                fechaInicioSintomasAgudas  =${pool.escape(datos.fechaInicioSintomasAgudas)},
                asintomaticoAgudo  =${pool.escape(datos.asintomaticoAgudo)},
                fiebreMayor7dias  =${pool.escape(datos.fiebreMayor7dias)},
                chagomaInoculacion  =${pool.escape(datos.chagomaInoculacion)},
                signoRomaña  =${pool.escape(datos.signoRomaña)},
                adenopatia  =${pool.escape(datos.adenopatia)},
                irritabilidad  =${pool.escape(datos.irritabilidad)},
                diarreas  =${pool.escape(datos.diarreas)},
                hepatoesplenomegalia  =${pool.escape(datos.hepatoesplenomegalia)},
                convulsiones  =${pool.escape(datos.convulsiones)},
                otrosSintomasAgudos  =${pool.escape(datos.otrosSintomasAgudos)},
                fechaInicioSintomasCronicas  =${pool.escape(datos.fechaInicioSintomasCronicas)},
                asintomaticoCronico  =${pool.escape(datos.asintomaticoCronico)},
                alteracionesCardiacas  =${pool.escape(datos.alteracionesCardiacas)},
                alteracionesDigestivas  =${pool.escape(datos.alteracionesDigestivas)},
                alteracionesNerviosas  =${pool.escape(datos.alteracionesNerviosas)},
                alteracionesAnedopatia  =${pool.escape(datos.alteracionesAnedopatia)},
                otrosSintomasCronicas  =${pool.escape(datos.otrosSintomasCronicas)},
                oral  =${pool.escape(datos.oral)},
                vectorial  =${pool.escape(datos.vectorial)},
                congenito  =${pool.escape(datos.congenito)},
                transfucional  =${pool.escape(datos.transfusional)},
                transplante  =${pool.escape(datos.transplante)},
                otrasTransmisiones  =${pool.escape(datos.otrasTransmisiones)},
                agudo  =${pool.escape(datos.agudo)},
                cronico  =${pool.escape(datos.cronico)},
                sangreTotal  =${pool.escape(datos.sangreTotal)},
                sueroPlasma  =${pool.escape(datos.sueroPlasma)},
                idLaboratorio  =${pool.escape(datos.idLaboratorio)},
                laboratorio  =${pool.escape(datos.laboratorio)},
                fechaTomaMuestra  =${pool.escape(datos.fechaTomaMuestra)},
                idReaccionDermatologica  =${pool.escape(datos.idReaccionDermatologica)},
                reaccionDermatologica  =${pool.escape(datos.reaccionDermatologica)},
                idReaccionDigestiva  =${pool.escape(datos.idReaccionDigestiva)},
                reaccionDigestiva  =${pool.escape(datos.reaccionDigestiva)},
                idReaccionNeurologica  =${pool.escape(datos.idReaccionNeurologica)},
                reaccionNeurologica  =${pool.escape(datos.reaccionNeurologica)},
                idReaccionHematologica  =${pool.escape(datos.idReaccionHematologica)},
                reaccionHematologica  =${pool.escape(datos.reaccionHematologica)},
                epidemica  =${pool.escape(datos.epidemica)},
                complementarios  =${pool.escape(datos.complementarios)},
                idMedicamento  =${pool.escape(datos.idMedicamento)},
                medicamento  =${pool.escape(datos.medicamento)},
                dosis  =${pool.escape(datos.dosis)},
                idMujeresTratamiento  =${pool.escape(datos.idMujeresTratamiento)},
                mujeresTratamiento  =${pool.escape(datos.mujeresTratamiento)},
                idSuspension  =${pool.escape(datos.idSuspension)},
                suspension  =${pool.escape(datos.suspension)},
                idAbandono  =${pool.escape(datos.idAbandono)},
                abandono  =${pool.escape(datos.abandono)},
                id_hospital_ref  =${pool.escape(datos.id_hospital_ref)},
                hospital_ref  =${pool.escape(datos.hospital_ref)},
                id_pre_quirurgico  =${pool.escape(datos.id_pre_quirurgico)},
                pre_quirurgico  =${pool.escape(datos.pre_quirurgico)},
                id_post_tratamiento  =${pool.escape(datos.id_post_tratamiento)},
                post_tratamiento  =${pool.escape(datos.post_tratamiento)},
                id_estado_mujeres  =${pool.escape(datos.id_estado_mujeres)},
                estado_mujeres  =${pool.escape(datos.estado_mujeres)},
                observacion  =${pool.escape(datos.observacion)},
                modified_at  =${pool.escape(datos.modified_at)}
                WHERE id = ${pool.escape(datos.id)} and id_usuario = ${pool.escape(datos.id_usuario)} and id_hospital = ${pool.escape(datos.id_hospital)} and DATEDIFF(CURDATE(), created_at) <= 120 `;

    const [row] = await pool.query(sql);
    // console.log(row)
    if (row.affectedRows > 0) {
      pool.query('insert into delete_data set ?', {
        table_affected: 'tratamiento (update)',
        content: JSON.stringify(result_recover),
        id_user_action: datos.id_usuario,
        name_user_action: datos.usuario,
        action_at: datos.modified_at
      })



      for (let d of diagnostico) {
        const [result_recover_diagnostico] = await pool.query(`select * from diagnostico WHERE id_tratamiento = ${pool.escape(d.id_tratamiento)}`);
        pool.query('insert into delete_data set ?', {
          table_affected: 'diagnostico (update)',
          content: JSON.stringify(result_recover_diagnostico),
          id_user_action: datos.id_usuario,
          name_user_action: datos.usuario,
          action_at: datos.modified_at
        })
      }

      await pool.query(`delete from diagnostico where id_tratamiento = ${pool.escape(datos.id)}`);

      for (let d of diagnostico) {
        await pool.query("INSERT into diagnostico SET  ?", d);
      }
      return true
    } else return false

  };


  eliminar = async (tratamiento, medico, username, fecha, est) => {
    const sql_recover = `select * from diagnostico WHERE id_tratamiento = ${pool.escape(tratamiento)} `;
    const [result_recover] = await pool.query(sql_recover);
    const [row] = await pool.query(`DELETE FROM diagnostico WHERE id_tratamiento = ${pool.escape(tratamiento)} and id_hospital = ${est}`);

    if (row.affectedRows > 0) {
      for (let d of result_recover) {
        pool.query('insert into delete_data set ?', {
          table_affected: 'diagnostico (delete)',
          content: JSON.stringify(d),
          id_user_action: medico,
          name_user_action: username,
          action_at: fecha
        })
      }
      const [result_recover_tratamiento] = await pool.query(`select * from tratamiento WHERE id = ${pool.escape(tratamiento)} `);

      const [row] = await pool.query(`DELETE FROM tratamiento WHERE id = ${pool.escape(tratamiento)} and id_usuario = ${pool.escape(medico)} and
      DATEDIFF(CURDATE(), created_at) <= 120 and id_hospital = ${est} 
      `);
      if (row.affectedRows > 0)
        pool.query('insert into delete_data set ?', {
          table_affected: 'tratamiento (delete)',
          content: JSON.stringify(result_recover_tratamiento),
          id_user_action: medico,
          name_user_action: username,
          action_at: fecha
        })
      else return false
      return true

    }
    else return false
  };

}
