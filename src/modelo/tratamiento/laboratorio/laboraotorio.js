const pool = require("../../bdConfig.js");

module.exports = class Laboratorio {
  // METODOSfecha_consulta
  listar = async (laboratorio) => {
    const sql = `SELECT 
                IF(d.positivo = 0 and d.negativo = 0 and d.indeterminado = 0, 1,0) as grabar_resultados,
                p.id , if(p.ci, p.ci, 'No tiene') as ci, p.nombre, p.ap1, p.ap2, if(p.sexo = 1, 'Masculino', 'Femenino') as sexo, DATE_FORMAT(p.fecha_nac, "%Y/%m/%d") as fecha_nacimiento,
                d.id as id_diagnostico, d.items_diagnostico, DATE_FORMAT(d.fecha_solicitud, "%Y/%m/%d") as fecha_solicitud, DATE_FORMAT(d.fecha_diagnostico, "%Y/%m/%d") as fecha_diagnostico, d.edad, d.conclusiones, d.observaciones, d.post_tratamiento, d.estado_mujeres,
                d.id_grupo_etario, d.grupo_etario, d.id_grupo, d.grupo, d.pre_quirurgico,d.post_tratamiento, d.id_hospital, d.hospital, d.id_laboratorio, d.laboratorio, d.id_medico_solicitante, d.medico_solicitante,d.medico_diagnostico,d.laboratorio,
                d.id_medico_diagnostico, d.medico_diagnostico, d.id_comunidad, if(d.id_comunidad is null, 0, d.id_comunidad) as id_comunidad, if(d.comunidad is null, 'No', d.comunidad) as comunidad, d.id_municipio, d.municipio, d.id_red, d.red, d.positivo, d.negativo, d.indeterminado, d.codigo, d.estado
                
                from diagnostico d
                INNER JOIN paciente p on p.id = d.id_paciente 
                where d.positivo = 0 or d.negativo = 0 or d.indeterminado = 0
                group by d.codigo limit 10
                `;
    const [rows] = await pool.query(sql);
    return rows;
  };


  buscarPaciente = async (datoPaciente) => {
    const sql = `SELECT 
                IF(d.positivo = 0 and d.negativo = 0 and d.indeterminado = 0, 1,0) as grabar_resultados,d.conclusiones,d.observaciones,
                d.id as id_diagnostico, d.items_diagnostico, DATE_FORMAT(d.fecha_solicitud, "%Y/%m/%d") as fecha_solicitud, DATE_FORMAT(d.fecha_diagnostico, "%Y/%m/%d") as fecha_diagnostico, d.edad, d.conclusiones, d.observaciones, d.post_tratamiento, d.estado_mujeres,
                p.id, if(p.ci, p.ci, 'No tiene') as ci, p.nombre, p.ap1, p.ap2, if(p.sexo = 1, 'Masculino', 'Femenino') as sexo, DATE_FORMAT(p.fecha_nac, "%Y/%m/%d") as fecha_nacimiento,
                d.id, d.items_diagnostico, DATE_FORMAT(d.fecha_solicitud, "%Y/%m/%d") as fecha_solicitud, DATE_FORMAT(d.fecha_diagnostico, "%Y/%m/%d") as fecha_diagnostico, d.edad, d.conclusiones, d.observaciones, d.post_tratamiento, 
                d.id_grupo_etario, d.grupo_etario, d.id_grupo, d.grupo, d.pre_quirurgico,d.post_tratamiento, d.id_hospital, d.hospital, d.id_laboratorio, d.laboratorio, d.id_medico_solicitante, d.medico_solicitante, d.medico_diagnostico,d.laboratorio,
                d.id_medico_diagnostico, d.medico_diagnostico, d.id_comunidad, if(d.id_comunidad is null, 0, d.id_comunidad) as id_comunidad, if(d.comunidad is null, 'No', d.comunidad) as comunidad, d.id_municipio, d.municipio, d.id_red, d.red, d.positivo, d.negativo, d.indeterminado, d.codigo, d.estado
                from diagnostico d
                INNER JOIN paciente p on p.id = d.id_paciente 
                where  p.ci like "${datoPaciente}%" or p.nombre like "${datoPaciente}%" or p.ap1 like "${datoPaciente}%" or p.ap2 like "${datoPaciente}%"
                or d.hospital like "${datoPaciente}%" or d.municipio like "${datoPaciente}%"
                group by d.codigo
                `;
    const [rows] = await pool.query(sql);
    return rows;
  };



  listarParametros = async (codigo) => {
    const [rowsItemsDiagnosticosSolicitados] = await pool.query(`select id as id_items_diagnostico, items_diagnostico, DATE_FORMAT(modified_result, "%Y/%m/%d") as ultima_modificacion,DATE_FORMAT(fecha_diagnostico, "%Y/%m/%d") as fecha_diagnostico,
      IF(positivo = 0, 'No realizado', IF(positivo = 1, 'SI', 'NO')) as positivo, 
      IF(negativo = 0, 'No realizado', IF(negativo = 1, 'SI', 'NO')) as negativo, 
      IF(indeterminado = 0, 'No realizado', IF(indeterminado = 1, 'SI', 'NO')) as indeterminado, codigo 
      
      from diagnostico where codigo = ${pool.escape(codigo)}`);

    // console.log(rowsItemsDiagnosticosSolicitados);
    return rowsItemsDiagnosticosSolicitados;

  }

  modificar = async (datos,) => {
    // console.log(datos, 'datos modelo')
    const [rows] = await pool.query(`select * from diagnostico where codigo = ${pool.escape(datos[0].codigo)} and fecha_diagnostico is null group by codigo`);
    if (rows.length > 0) {  // si no hay diagnostico sin resultados
      let ok = true
      for (let e of datos) {
        const [row] = await pool.query(`UPDATE diagnostico SET  
            id_medico_diagnostico = ${pool.escape(e.id_medico_diagnostico)},
            medico_diagnostico = ${pool.escape(e.medico_diagnostico)},
            id_laboratorio = ${pool.escape(e.id_laboratorio)},
            laboratorio = ${pool.escape(e.laboratorio)},
            id_municipio_laboratorio ${pool.escape(e.id_municipio_laboratorio)},
            nombre_municipio_laboratorio ${pool.escape(e.nombre_municipio_laboratorio)},
            id_red_laboratorio ${pool.escape(e.id_red_laboratorio)},
            nombre_red_laboratorio ${pool.escape(e.nombre_red_laboratorio)},
            fecha_diagnostico = ${pool.escape(e.fecha_diagnostico)},
            positivo = ${pool.escape(e.positivo)},
            negativo = ${pool.escape(e.negativo)},
            indeterminado = ${pool.escape(e.indeterminado)},
            conclusiones = ${pool.escape(e.conclusiones)},
            observaciones = ${pool.escape(e.observaciones)}
            WHERE id = ${pool.escape(e.id_items_diagnostico)} and estado = 0 `); 
        if (row.affectedRows == 0) { 
          ok = false
        }
      }
      if (ok) {
        return true
      } else return false
    }
    else {  // si hay diagnostico sin resultados, solo se actualiza el resultado y la fecha de actualizacion de resultados
      let ok = true
      
      for (let e of datos) {
        const [row] = await pool.query(`UPDATE diagnostico SET  
            id_medico_diagnostico = ${pool.escape(e.id_medico_diagnostico)},
            medico_diagnostico = ${pool.escape(e.medico_diagnostico)},
            id_laboratorio = ${pool.escape(e.id_laboratorio)},
            laboratorio = ${pool.escape(e.laboratorio)},
            modified_result = ${pool.escape(e.fecha_diagnostico)},
            positivo = ${pool.escape(e.positivo)},
            negativo = ${pool.escape(e.negativo)},
            indeterminado = ${pool.escape(e.indeterminado)},
            conclusiones = ${pool.escape(e.conclusiones)},
            observaciones = ${pool.escape(e.observaciones)}
            WHERE id = ${pool.escape(e.id_items_diagnostico)} 
            AND estado = 0
            AND DATEDIFF(NOW(), fecha_diagnostico) <= 30`);
        // console.log(row, 'row sin fecha')
        if (row.affectedRows == 0) {
          ok = false
        }
      }
      if (ok) {
        return true
      } else return false
    }

  }



}
