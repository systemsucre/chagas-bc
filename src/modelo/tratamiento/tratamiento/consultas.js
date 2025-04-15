const pool = require("../../bdConfig.js");

module.exports = class Consultas {
  // METODOSfecha_consulta
  listar = async (id_tratamiento, medico) => {
    const sql = `SELECT 
                c.id,DATE_FORMAT(c.fecha_consulta, "%Y/%m/%d") as fecha_consulta, c.dosis, c.hospital, c.id_hospital, c.id_tratamiento, c.id_medicamento, c.medicamento, 
                c.id_mujeres_tratamiento, c.mujeres_tratamiento, c.id_reaccion_dermatologica, c.reaccion_dermatologica, c.id_reaccion_digestiva, 
                c.reaccion_digestiva, c.id_reaccion_neurologica, c.reaccion_neurologica, c.id_reaccion_hematologica, c.reaccion_hematologica,
                DATE_FORMAT(c.created, "%Y/%m/%d") as created, DATE_FORMAT(c.modified, "%Y/%m/%d") as modified, 
                t.paciente,  t.observacion, 
                t.id_medico, t.medico,  t.suspension, t.abandono, t.id_suspension, t.id_abandono, t.epidemica, t.complementarios, t.id_hospital_ref, t.hospital_ref
             
                from consultas c
                INNER JOIN tratamiento t on t.id = c.id_tratamiento
                where t.id = ${pool.escape(id_tratamiento)} order by c.fecha_consulta desc`;
    const [rows] = await pool.query(sql);
    const [rowsPaciente] = await pool.query(`SELECT p.ci, p.nombre, p.ap1, p.ap2, if(p.sexo = 1, 'Masculino', 'Femenino') as sexo,  IF(t.id_medico = ${pool.escape(medico)}, 1, 0) as editable,
       DATE_FORMAT(fecha_nac, "%Y/%m/%d") as fecha_nacimiento from paciente p left join tratamiento t on t.paciente = p.id where t.id = ${pool.escape(id_tratamiento)}`);

    // console.log(rowsPaciente);

    return [rows, rowsPaciente];   
  };

  listarParametros = async (id_consulta) => {
    const [rowsMedicamento] = await pool.query(`SELECT id as value, nombre as label from medicamentos where estado = 1`);
    const [rowsMujeresTratamiento] = await pool.query(`SELECT id as value, nombre as label from mujeres_tratamiento where estado = 1`);
    const [rowsReaccionDermatologica] = await pool.query(`SELECT id as value, nombre as label from reaccion_dermatologica where estado = 1`);
    const [rowsReaccionDigestiva] = await pool.query(`SELECT id as value, nombre as label from reaccion_digestiva where estado = 1`);
    const [rowsReaccionNeurologica] = await pool.query(`SELECT id as value, nombre as label from reaccion_neurologica where estado = 1`);
    const [rowsReaccionHematologica] = await pool.query(`SELECT id as value, nombre as label from reaccion_hematologica where estado = 1`);
    const [rowsItemsLaboratorio] = await pool.query(`SELECT id as value, nombre as label  from items_laboratorio where estado = 1`);
    const [rowsItemsLaboratorioSolicitados] = await pool.query(`SELECT l.id, l.id_consulta, l.id_items_laboratorio, l.resultado, l.fecha, il.nombre as items_laboratorio
      from laboratorio l inner join items_laboratorio il on il.id = l.id_items_laboratorio where l.id_consulta = ${pool.escape(id_consulta)}`);

    return [ rowsMedicamento, rowsMujeresTratamiento, rowsReaccionDermatologica, rowsReaccionDigestiva, rowsReaccionNeurologica, rowsReaccionHematologica, rowsItemsLaboratorio, rowsItemsLaboratorioSolicitados];
  }

  insertar = async (datos, id_paciente, listaItemsLaboratorio) => {
    const [rowsAutorizacion] = await pool.query(`SELECT id_medico from tratamiento where id_medico = ${pool.escape(datos.id_medico)} and id = ${pool.escape(datos.id_tratamiento)}`);
    if (rowsAutorizacion.length == 0) return false;

    const [result] = await pool.query("INSERT INTO consultas SET  ?", datos);
    if (result.insertId > 0) {

      listaItemsLaboratorio.forEach(async (e) => {
        await pool.query("INSERT INTO laboratorio SET ?", { id_paciente, id_items_laboratorio: e, id_consulta: result.insertId, fecha: datos.fecha_consulta });
      });

      return true;
    }
    else return false
  };


  modificar = async (datos,) => {

    const sql = `UPDATE consultas SET
                fecha_consulta = ${pool.escape(datos.fecha_consulta)},
                dosis = ${pool.escape(datos.dosis)},
            
                id_medicamento = ${pool.escape(datos.id_medicamento)},
                medicamento = ${pool.escape(datos.medicamento)},
                id_mujeres_tratamiento = ${pool.escape(datos.id_mujeres_tratamiento)},
                mujeres_tratamiento = ${pool.escape(datos.mujeres_tratamiento)},
                id_reaccion_dermatologica = ${pool.escape(datos.id_reaccion_dermatologica)},
                reaccion_dermatologica = ${pool.escape(datos.reaccion_dermatologica)},
                id_reaccion_digestiva = ${pool.escape(datos.id_reaccion_digestiva)},
                reaccion_digestiva = ${pool.escape(datos.reaccion_digestiva)},
                id_reaccion_neurologica = ${pool.escape(datos.id_reaccion_neurologica)},
                reaccion_neurologica = ${pool.escape(datos.reaccion_neurologica)},
                id_reaccion_hematologica = ${pool.escape(datos.id_reaccion_hematologica)},
                reaccion_hematologica = ${pool.escape(datos.reaccion_hematologica)},
                modified = ${pool.escape(datos.modified)}
                WHERE id = ${pool.escape(datos.id)} and id_medico = ${pool.escape(datos.medico)}`;

    const [row] = await pool.query(sql);

    if (row.affectedRows > 0) {


      const sql_laboratorio = `select * from laboratorio WHERE id_consulta = ${pool.escape(datos.id)} `;
      const [result_laboratorio] = await pool.query(sql_laboratorio);

      const [row_laboratorio] = await pool.query(`DELETE FROM laboratorio WHERE id_consulta = ${pool.escape(datos.id)}`);

      datos.listaItemsLaboratorioUnicos.forEach(async (e) => {
        await pool.query("insert into laboratorio SET ?", { id_paciente: datos.id_paciente, id_items_laboratorio: e, id_consulta: datos.id, fecha: datos.fecha_consulta });
      });

      if (row_laboratorio.affectedRows > 0) {


        for (let l of result_laboratorio) {
          pool.query('insert into delete_data set ?', {
            table_affected: 'laboratorio (modificacion de items) ', content: JSON.stringify(l), id_user_action: datos.medico, name_user_action: datos.userName,
            action_at: datos.modified
          })
        }
      }
      return true
    } else return false

  };


  eliminar = async (consulta, medico, fecha, username) => {


    const sql_recover = `select * from consultas WHERE id = ${pool.escape(consulta)} `;
    const [result_recover] = await pool.query(sql_recover);


    const sql_laboratorio = `select * from laboratorio WHERE id_consulta = ${pool.escape(consulta)} `;
    const [result_laboratorio] = await pool.query(sql_laboratorio);

    await pool.query(`DELETE FROM laboratorio WHERE id_consulta = ${pool.escape(consulta)}`);
    const [row] = await pool.query(`DELETE FROM consultas WHERE id = ${pool.escape(consulta)} and id_medico = ${pool.escape(medico)}`);

    if (row.affectedRows > 0) {

      pool.query('insert into delete_data set ?', {
        table_affected: 'consultas', content: JSON.stringify(result_recover), id_user_action: medico, name_user_action: username,
        action_at: fecha
      })

      for (let l of result_laboratorio) {
        pool.query('insert into delete_data set ?', {
          table_affected: 'laboratorio', content: JSON.stringify(l), id_user_action: medico, name_user_action: username,
          action_at: fecha
        })
      }
      return true
    }
    else return false
  };

}
