const pool = require("../../bdConfig.js");

module.exports = class Diagnostico {
  // METODOSfecha_consulta
  listar = async (id_paciente, medico) => {
    console.log(id_paciente, medico, 'id_paciente y medico')
    const sql = `SELECT 
                p.id, if(p.ci, p.ci, 'No tiene') as ci, p.nombre, p.ap1, p.ap2, if(p.sexo = 1, 'Masculino', 'Femenino') as sexo, DATE_FORMAT(p.fecha_nac, "%Y/%m/%d") as fecha_nacimiento,
                d.id, d.items_diagnostico, DATE_FORMAT(d.fecha_solicitud, "%Y/%m/%d") as fecha_solicitud, DATE_FORMAT(d.fecha_diagnostico, "%Y/%m/%d") as fecha_diagnostico, d.edad, d.conclusiones, d.observaciones, d.post_tratamiento, d.id_estado_mujeres, d.estado_mujeres,
                d.id_grupo_etario, d.grupo_etario, d.id_grupo, d.grupo, d.pre_quirurgico,d.post_tratamiento, d.id_hospital, d.hospital, d.id_laboratorio, d.laboratorio, d.id_medico_solicitante, d.medico_solicitante, d.medico_diagnostico,d.laboratorio,
                d.id_medico_diagnostico, d.medico_diagnostico, d.id_comunidad, if(d.id_comunidad is null, 0, d.id_comunidad) as id_comunidad, if(d.comunidad is null, 'No', d.comunidad) as comunidad, d.id_municipio, d.municipio, d.id_red, d.red, d.positivo, d.negativo, d.indeterminado, d.codigo

                from diagnostico d
                INNER JOIN paciente p on p.id = d.id_paciente where d.id_paciente = ${pool.escape(id_paciente)} group by d.codigo order by d.fecha_diagnostico desc`;
    const [rows] = await pool.query(sql);
    const [rowsPaciente] = await pool.query(`SELECT p.ci, p.id, p.nombre, p.ap1, p.ap2,  if(p.sexo = 1, 'Masculino', 'Femenino') as sexo,     IF(d.id_medico_solicitante = ${pool.escape(medico)}, 1, 0) as editable,
                                                DATE_FORMAT(p.fecha_nac, "%Y/%m/%d") as fecha_nacimiento, c.id as id_comunidad, c.nombre as comunidad
                                                from paciente p 
                                                left join comunidad c on c.id = p.comunidad
                                                left join diagnostico d on d.id_paciente = p.id  
                                                where p.id = ${pool.escape(id_paciente)}`);

    // console.log(rowsPaciente);
    const [rowsGruposEtario] = await pool.query(`SELECT id, descripcion as label, inf, sup, id_grupo,categoria_tiempo as categoria from grupo_etario where estado = 1`);
    return [rows, rowsPaciente, rowsGruposEtario];
  };



  listarParametros = async (codigo) => {
    const [rowsGruposEtario] = await pool.query(`SELECT id as value, nombre as label  from grupo where estado = 1`);
    const [rowsItemsDiagnosticos] = await pool.query(`SELECT id as value, nombre as label  from items_diagnostico where estado = 1`);
    const [rowsItemsDiagnosticosSolicitados] = await pool.query(`select id_items_diagnostico, items_diagnostico, DATE_FORMAT(modified_result, "%Y/%m/%d") as ultima_modificacion,  DATE_FORMAT(fecha_diagnostico, "%Y/%m/%d") as fecha_diagnostico,
      IF(positivo = 0, 'No realizado', IF(positivo = 1, 'SI', 'NO')) as positivo, 
      IF(negativo = 0, 'No realizado', IF(negativo = 1, 'SI', 'NO')) as negativo, 
      IF(indeterminado = 0, 'No realizado', IF(indeterminado = 1, 'SI', 'NO')) as indeterminado 
      
      from diagnostico where codigo = ${pool.escape(codigo)}`);

    // console.log(rowsItemsDiagnosticosSolicitados);
    return [rowsGruposEtario, rowsItemsDiagnosticos, rowsItemsDiagnosticosSolicitados];

  }


  listarGrupoEtario = async (id_grupo) => {
    const [rowsGruposEtario] = await pool.query(`SELECT id as value, descripcion as label  from grupo_etario where estado = 1 and id_grupo = ${pool.escape(id_grupo)}`);
    return rowsGruposEtario;
  }





  insertar = async (datos) => { 
    for (let e of datos) {
      await pool.query("INSERT INTO diagnostico SET ?", e);
    }
    return true;
  };


  modificar = async (datos,) => {

    const [rowsDiagnostico] = await pool.query(`SELECT id FROM diagnostico WHERE codigo = ${pool.escape(datos.codigo)} and positivo != 0 and negativo != 0 and indeterminado != 0`);
    // console.log(rowsDiagnostico, datos, 'rowsDiagnostico')
    if (rowsDiagnostico.length > 0) {
      return -1
    }

    const [row] = await pool.query(`DELETE FROM diagnostico 
      WHERE codigo = ${pool.escape(datos[0].codigo)} and id_medico_solicitante = ${pool.escape(datos[0].id_medico_solicitante)}`);
    if (row.affectedRows > 0) {
      for (let e of datos) {
        await pool.query("INSERT INTO diagnostico SET ?", e);
      }
      return true;

    } else return false;
  }


  eliminar = async (codigo, medico) => {
    console.log(codigo, medico, 'codigo y medico')
    const sql = `DELETE FROM diagnostico WHERE codigo = ${pool.escape(codigo)} and id_medico_solicitante = ${pool.escape(medico)} and positivo =0 and negativo =0 and indeterminado =0`;
    const [row] = await pool.query(sql);
    if (row.affectedRows > 0)
      return true
    else return false
  };

}
