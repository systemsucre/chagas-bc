const pool = require("../../bdConfig.js");

module.exports = class ReportesTratamientoDepto {
  // METODOS

  listarParametros = async () => {
    let data = [{ value: 1000000, nivel: 1000000, label: 'CONSOLIDADO', }]
    const [rowsRed] = await pool.query("SELECT id as value, concat(nombre,' (R)') as label, 1 as nivel FROM red")
    for (const rowRed of rowsRed) {
      data.push(rowRed)
      const sqlMunicipio =
        `SELECT  id as value, concat(' __',nombre,' (M)') as label, 2 as nivel from municipio where red = ${rowRed.value}`
      const [rowsMunicipio] = await pool.query(sqlMunicipio)

      for (const row of rowsMunicipio) {
        data.push(row)
        const sqlHospital =
          `SELECT  id as value, concat(' ____',nombre,' (H)') as label, 3 as nivel from hospital where municipio = ${row.value}`
        const [rowsHospital] = await pool.query(sqlHospital)
        for (const rowHospital of rowsHospital) {
          data.push(rowHospital)
        }
      }
    }
    return data

  };

  listarGruposEtarios = async (grupo) => {
    const [rows] = await pool.query(`SELECT id , descripcion as label FROM grupo_etario where id_grupo = ${pool.escape(grupo)}`)
    return rows
  }

  listarParametrosTipoConsulta = async () => {
    const [rowsMedicamentos] = await pool.query(`SELECT id as value, nombre as label FROM medicamentos`)
    const [rowsMujeresTratamiento] = await pool.query(`SELECT id as value, nombre as label FROM mujeres_tratamiento `)
    const [rowsReaccionDermatologica] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_dermatologica `)
    const [rowsReaccionDigestiva] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_digestiva `)
    const [rowsReaccionNeurologica] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_neurologica `)
    const [rowsReaccionHematologica] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_hematologica `)
    const [rowsCronicoCongenito] = await pool.query(`SELECT id , nombre as label FROM grupo`)
    return [rowsMedicamentos, rowsMujeresTratamiento, rowsReaccionDermatologica, rowsReaccionDigestiva, rowsReaccionNeurologica, rowsReaccionHematologica, rowsCronicoCongenito]
  };

  buscarConsolidado = async (fecha1, fecha2, grupo, grupoEtario, idMedicamento, idMujeresTratamiento, idReaccionDermatologica, idReaccionDigestiva, idReaccionNeurologica, idReaccionHematologica) => {

    const sql = `SELECT 
                  t.id,
                  t.red,t.municipio, t.hospital, t.medico, 
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  p.nombre,
                  p.ap1, p.ap2,
                  date_format(p.fecha_nac, '%d/%m/%Y') as fecha_nacimiento,
                  p.celular,
                  p.ci,
                  if(p.sexo = 1, 'MASCULINO', 'FEMENINO') as sexo,
                  d.edad,
                  GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  
                  CONCAT( d.grupo_etario, ' (', d.grupo,')') as grupo_etario,

                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.id_mujeres_tratamiento END) as id_mujeres_tratamiento,
                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.mujeres_tratamiento END) as mujeres_tratamiento,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.id_reaccion_dermatologica END) as id_reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.reaccion_dermatologica END) as reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.id_reaccion_digestiva END) as id_reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.reaccion_digestiva END) as reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.id_reaccion_neurologica END) as id_reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.reaccion_neurologica END) as reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.id_reaccion_hematologica END) as id_reaccion_hematologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.reaccion_hematologica END) as reaccion_hematologica,
                  DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini,
                  DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin,  
                  t.suspension,
                  t.abandono,
                  t.observacion,
                  t.epidemica,
                  t.complementarios, c.medicamento, c.dosis
                 FROM 
                 tratamiento t
                 LEFT JOIN consultas c on c.id_tratamiento = t.id
                 LEFT JOIN diagnostico d on d.id_tratamiento = t.id
                 inner join paciente p on p.id = t.paciente
                 WHERE t.created between '${fecha1}' and '${fecha2}' 


                 ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
                 ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
                 ${idMedicamento ? ` AND c.id_medicamento = ${pool.escape(idMedicamento)}` : ''}
                 ${idMujeresTratamiento ? ` AND c.id_mujeres_tratamiento = ${pool.escape(idMujeresTratamiento)}` : ''}
                 ${idReaccionDermatologica ? ` AND c.id_reaccion_dermatologica = ${pool.escape(idReaccionDermatologica)}` : ''}
                 ${idReaccionDigestiva ? ` AND c.id_reaccion_digestiva = ${pool.escape(idReaccionDigestiva)}` : ''}
                 ${idReaccionNeurologica ? ` AND c.id_reaccion_neurologica = ${pool.escape(idReaccionNeurologica)}` : ''}
                 ${idReaccionHematologica ? ` AND c.id_reaccion_hematologica = ${pool.escape(idReaccionHematologica)}` : ''}

                 group by t.id order by t.id desc`
    const [rows] = await pool.query(sql)
    // console.log(sql, ' resultado')
    return rows
  }



  buscarPorRed = async (fecha1, fecha2, red, grupo, grupoEtario, idMedicamento, idMujeresTratamiento, idReaccionDermatologica, idReaccionDigestiva, idReaccionNeurologica, idReaccionHematologica) => {

    const sql = `SELECT 
                  t.id,
                  t.red,t.municipio, t.hospital, t.medico, 
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  p.nombre,
                  p.ap1, p.ap2,
                  date_format(p.fecha_nac, '%d/%m/%Y') as fecha_nacimiento,
                  p.celular,
                  p.ci,
                  if(p.sexo = 1, 'MASCULINO', 'FEMENINO') as sexo,
                  d.edad,
                  GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,

                  
                  CONCAT( d.grupo_etario, ' (', d.grupo,')') as grupo_etario,

                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.id_mujeres_tratamiento END) as id_mujeres_tratamiento,
                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.mujeres_tratamiento END) as mujeres_tratamiento,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.id_reaccion_dermatologica END) as id_reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.reaccion_dermatologica END) as reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.id_reaccion_digestiva END) as id_reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.reaccion_digestiva END) as reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.id_reaccion_neurologica END) as id_reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.reaccion_neurologica END) as reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.id_reaccion_hematologica END) as id_reaccion_hematologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.reaccion_hematologica END) as reaccion_hematologica,
                  DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini,
                  DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin,
                  t.suspension,
                  t.abandono,
                  t.observacion,
                  t.epidemica,
                  t.complementarios, c.medicamento, c.dosis
                 FROM 
                 consultas c
                 left join tratamiento t on t.id = c.id_tratamiento
                 LEFT join diagnostico d on d.id_tratamiento = t.id
                 inner join paciente p on p.id = t.paciente
                
                 WHERE c.fecha_consulta between '${fecha1}' and '${fecha2}' AND t.id_red = ${pool.escape(red)} 

                  ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
                 ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
                 ${idMedicamento ? ` AND c.id_medicamento = ${pool.escape(idMedicamento)}` : ''}
                 ${idMujeresTratamiento ? ` AND c.id_mujeres_tratamiento = ${pool.escape(idMujeresTratamiento)}` : ''}
                 ${idReaccionDermatologica ? ` AND c.id_reaccion_dermatologica = ${pool.escape(idReaccionDermatologica)}` : ''}
                 ${idReaccionDigestiva ? ` AND c.id_reaccion_digestiva = ${pool.escape(idReaccionDigestiva)}` : ''}
                 ${idReaccionNeurologica ? ` AND c.id_reaccion_neurologica = ${pool.escape(idReaccionNeurologica)}` : ''}
                 ${idReaccionHematologica ? ` AND c.id_reaccion_hematologica = ${pool.escape(idReaccionHematologica)}` : ''}
                 group by t.id order by t.id desc
                 `
    const [rows] = await pool.query(sql)
    return rows
  }



  buscarPorMunicipio = async (fecha1, fecha2, municipio, grupo, grupoEtario, idMedicamento, idMujeresTratamiento, idReaccionDermatologica, idReaccionDigestiva, idReaccionNeurologica, idReaccionHematologica) => {

    const sql = `SELECT 
                  t.id,
                  t.red,t.municipio, t.hospital, t.medico, 
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  p.nombre,
                  p.ap1, p.ap2,
                  date_format(p.fecha_nac, '%d/%m/%Y') as fecha_nacimiento,
                  p.celular,
                  p.ci,
                  if(p.sexo = 1, 'MASCULINO', 'FEMENINO') as sexo,
                  d.edad,
                  GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,

                  
                  CONCAT( d.grupo_etario, ' (', d.grupo,')') as grupo_etario,

                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.id_mujeres_tratamiento END) as id_mujeres_tratamiento,
                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.mujeres_tratamiento END) as mujeres_tratamiento,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.id_reaccion_dermatologica END) as id_reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.reaccion_dermatologica END) as reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.id_reaccion_digestiva END) as id_reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.reaccion_digestiva END) as reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.id_reaccion_neurologica END) as id_reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.reaccion_neurologica END) as reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.id_reaccion_hematologica END) as id_reaccion_hematologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.reaccion_hematologica END) as reaccion_hematologica,
                  DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini,
                  DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin,
                  t.suspension,
                  t.abandono,
                  t.observacion, c.medicamento, c.dosis
                 FROM 
                 consultas c
                 LEFT join tratamiento t on t.id = c.id_tratamiento
                 LEFT join diagnostico d on d.id_tratamiento = t.id
                 inner join paciente p on p.id = t.paciente
                
                 WHERE c.fecha_consulta between '${fecha1}' and '${fecha2}' AND t.id_municipio = ${pool.escape(municipio)} 
                  ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
                 ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
                 ${idMedicamento ? ` AND c.id_medicamento = ${pool.escape(idMedicamento)}` : ''}
                 ${idMujeresTratamiento ? ` AND c.id_mujeres_tratamiento = ${pool.escape(idMujeresTratamiento)}` : ''}
                 ${idReaccionDermatologica ? ` AND c.id_reaccion_dermatologica = ${pool.escape(idReaccionDermatologica)}` : ''}
                 ${idReaccionDigestiva ? ` AND c.id_reaccion_digestiva = ${pool.escape(idReaccionDigestiva)}` : ''}
                 ${idReaccionNeurologica ? ` AND c.id_reaccion_neurologica = ${pool.escape(idReaccionNeurologica)}` : ''}
                 ${idReaccionHematologica ? ` AND c.id_reaccion_hematologica = ${pool.escape(idReaccionHematologica)}` : ''}
                 group by t.id order by t.id desc
                 `
    const [rows] = await pool.query(sql)
    return rows
  }



  buscarPorHospital = async (fecha1, fecha2, hospital, grupo, grupoEtario, idMedicamento, idMujeresTratamiento, idReaccionDermatologica, idReaccionDigestiva, idReaccionNeurologica, idReaccionHematologica) => {

    const sql = `SELECT 
                  t.id,
                  t.red,t.municipio, t.hospital, t.medico, 
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  p.nombre,
                  p.ap1, p.ap2,
                  date_format(p.fecha_nac, '%d/%m/%Y') as fecha_nacimiento,
                  p.celular,
                  p.ci,
                  if(p.sexo = 1, 'MASCULINO', 'FEMENINO') as sexo,
                  d.edad,
                  GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
                   date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  
                  CONCAT( d.grupo_etario, ' (', d.grupo,')') as grupo_etario,

                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.id_mujeres_tratamiento END) as id_mujeres_tratamiento,
                  MAX(CASE WHEN c.id_mujeres_tratamiento > 0 THEN c.mujeres_tratamiento END) as mujeres_tratamiento,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.id_reaccion_dermatologica END) as id_reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_dermatologica > 0 THEN c.reaccion_dermatologica END) as reaccion_dermatologica,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.id_reaccion_digestiva END) as id_reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_digestiva > 0 THEN c.reaccion_digestiva END) as reaccion_digestiva,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.id_reaccion_neurologica END) as id_reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_neurologica > 0 THEN c.reaccion_neurologica END) as reaccion_neurologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.id_reaccion_hematologica END) as id_reaccion_hematologica,
                  MAX(CASE WHEN c.id_reaccion_hematologica > 0 THEN c.reaccion_hematologica END) as reaccion_hematologica,
                  DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini,
                  DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin,
                  t.suspension,
                  t.abandono,
                  t.observacion, c.medicamento, c.dosis
                 FROM 
                 consultas c
                 LEFT join tratamiento t on t.id = c.id_tratamiento
                 LEFT join diagnostico d on d.id_tratamiento = t.id
                 inner join paciente p on p.id = t.paciente
                
                 WHERE c.fecha_consulta between '${fecha1}' and '${fecha2}' AND t.id_hospital = ${pool.escape(hospital)} 
                  ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
                 ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
                 ${idMedicamento ? ` AND c.id_medicamento = ${pool.escape(idMedicamento)}` : ''}
                 ${idMujeresTratamiento ? ` AND c.id_mujeres_tratamiento = ${pool.escape(idMujeresTratamiento)}` : ''}
                 ${idReaccionDermatologica ? ` AND c.id_reaccion_dermatologica = ${pool.escape(idReaccionDermatologica)}` : ''}
                 ${idReaccionDigestiva ? ` AND c.id_reaccion_digestiva = ${pool.escape(idReaccionDigestiva)}` : ''}
                 ${idReaccionNeurologica ? ` AND c.id_reaccion_neurologica = ${pool.escape(idReaccionNeurologica)}` : ''}
                 ${idReaccionHematologica ? ` AND c.id_reaccion_hematologica = ${pool.escape(idReaccionHematologica)}` : ''}
                 group by t.id order by t.id desc
                 `
    const [rows] = await pool.query(sql)
    return rows
  }




}
