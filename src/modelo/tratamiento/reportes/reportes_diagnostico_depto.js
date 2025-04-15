const pool = require("../../bdConfig.js");

module.exports = class ReportesDiagnosticoDepto {
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

    const [rowsGrupo] = await pool.query("SELECT id , nombre as label FROM grupo")
    const [rowsItems] = await pool.query("SELECT id , nombre as label FROM items_diagnostico")

    return [data, rowsGrupo, rowsItems]

  };

  listarGruposEtarios = async (grupo) => {
    const [rows] = await pool.query(`SELECT id , descripcion as label FROM grupo_etario where id_grupo = ${pool.escape(grupo)}`)
    return rows
  }

  listarParametrosTipoConsulta = async () => {
    const [rowsMedicamentos] = await pool.query(`SELECT id as value, nombre as label FROM medicamentos`)
    const [rowsInfecciones] = await pool.query(`SELECT id as value, nombre as label FROM infeccion `)
    const [rowsMujeresTratamiento] = await pool.query(`SELECT id as value, nombre as label FROM mujeres_tratamiento `)
    const [rowsReaccionDermatologica] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_dermatologica `)
    const [rowsReaccionDigestiva] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_digestiva `)
    const [rowsReaccionNeurologica] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_neurologica `)
    const [rowsReaccionHematologica] = await pool.query(`SELECT id as value, nombre as label FROM reaccion_hematologica `)
    const [rowsCronicoCongenito] = await pool.query(`SELECT id as value, nombre as label FROM grupo`)
    const [rowsGrupoEtario] = await pool.query(`SELECT id as value, descripcion as label FROM grupo_etario `)
    const [rowsItemDiagnostico] = await pool.query(`SELECT id as value, nombre as label FROM items_diagnostico `)
    return [rowsMedicamentos, rowsInfecciones, rowsMujeresTratamiento, rowsReaccionDermatologica, rowsReaccionDigestiva, rowsReaccionNeurologica, rowsReaccionHematologica, rowsCronicoCongenito,
      rowsGrupoEtario, rowsItemDiagnostico
    ]
  };



  buscarConsolidado = async (fecha1, fecha2, grupo, grupoEtario, itemDiagnostico, estadoMujeres) => {

    const sql = `SELECT 

                  d.paciente as paciente_diagnostico,
                  d.edad as edad_diagnostico,
                  d.grupo_etario as grupo_etario_diagnostico,
                  d.grupo as grupo_diagnostico,  
                  d.comunidad as comunidad_diagnostico,



                  t.medico as medico_tratamiento,
                  t.hospital as hospital_tratamiento,
                  t.municipio as municipio_tratamiento,
                  t.red as red_tratamiento,
                  DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini_tratamiento,
                  DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin_tratamiento,
                  t.observacion as observacion_tratamiento,


                  d.codigo as codigo_diagnostico,
                  GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
                  date_format(d.fecha_solicitud, '%d/%m/%Y') as fecha_solicitud_diagnostico,
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  d.conclusiones as conclusiones_diagnostico,
                  d.observaciones as observaciones_diagnostico,
                  d.medico_diagnostico as medico_diagnostico, 
                  d.laboratorio as laboratorio_diagnostico,
                  d.nombre_municipio_laboratorio, 
                  d.nombre_red_laboratorio, 
                  d.pre_quirurgico as pre_quirurgico_diagnostico,
                  d.post_tratamiento as post_tratamiento_diagnostico,
                  d.estado_mujeres as estado_mujeres_diagnostico,

                  ${itemDiagnostico ? `IF(d.positivo = 0, 'No realizado', IF(d.positivo = 1, 'SI', 'NO')) as positivo, ` : `"-" as positivo, `}
                  ${itemDiagnostico ? `IF(d.negativo = 0, 'No realizado', IF(d.negativo = 1, 'SI', 'NO')) as negativo, ` : `"-" as negativo, `}
                  ${itemDiagnostico ? `IF(d.indeterminado = 0, 'No realizado', IF(d.indeterminado = 1, 'SI', 'NO')) as indeterminado, ` : `"-" as indeterminado, `}
                  if(d.estado=1, 'resultado revisado', 'resultado no revisado') AS estado_diagnostico


                 FROM diagnostico d
                 left join tratamiento t on t.id = d.id_tratamiento
                 WHERE d.fecha_solicitud between '${fecha1}' and '${fecha2}'
                 ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
                 ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
                 ${itemDiagnostico ? ` AND d.id_items_diagnostico = ${pool.escape(itemDiagnostico)}` : ''}
                 ${estadoMujeres ? ` AND d.id_estado_mujeres = ${pool.escape(estadoMujeres)}` : ''}
                 ${itemDiagnostico ? '' : `group by d.codigo`} order by d.fecha_solicitud desc`
    const [rows] = await pool.query(sql)
    if (rows[0]?.codigo_diagnostico === null) return []
    else return rows
  }



  buscarPorRed = async (fecha1, fecha2, red, grupo, grupoEtario, itemDiagnostico, estadoMujeres) => {

    const sql = `SELECT 

                  d.paciente as paciente_diagnostico,
                  d.edad as edad_diagnostico,
                  d.grupo_etario as grupo_etario_diagnostico,
                  d.grupo as grupo_diagnostico,  
                  d.comunidad as comunidad_diagnostico,



                  t.medico as medico_tratamiento,
                  t.hospital as hospital_tratamiento,
                  t.municipio as municipio_tratamiento,
                  t.red as red_tratamiento,
                  DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini_tratamiento,
                  DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin_tratamiento,
                  t.observacion as observacion_tratamiento,


                  d.codigo as codigo_diagnostico,
                  GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
                  date_format(d.fecha_solicitud, '%d/%m/%Y') as fecha_solicitud_diagnostico,
                  date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
                  d.conclusiones as conclusiones_diagnostico,
                  d.observaciones as observaciones_diagnostico,
                  d.medico_diagnostico as medico_diagnostico, 
                  d.laboratorio as laboratorio_diagnostico,
                      d.nombre_municipio_laboratorio, 
                  d.nombre_red_laboratorio, 
                  d.pre_quirurgico as pre_quirurgico_diagnostico,
                  d.post_tratamiento as post_tratamiento_diagnostico,
                  d.estado_mujeres as estado_mujeres_diagnostico,

                  ${itemDiagnostico ? `IF(d.positivo = 0, 'No realizado', IF(d.positivo = 1, 'SI', 'NO')) as positivo, ` : `"-" as positivo, `}
                  ${itemDiagnostico ? `IF(d.negativo = 0, 'No realizado', IF(d.negativo = 1, 'SI', 'NO')) as negativo, ` : `"-" as negativo, `}
                  ${itemDiagnostico ? `IF(d.indeterminado = 0, 'No realizado', IF(d.indeterminado = 1, 'SI', 'NO')) as indeterminado, ` : `"-" as indeterminado, `}
                  if(d.estado=1, 'resultado revisado', 'resultado no revisado') AS estado_diagnostico


                 FROM diagnostico d
                 left join tratamiento t on t.id = d.id_tratamiento
                 WHERE d.fecha_solicitud between '${fecha1}' and '${fecha2}'
                 ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
                 ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
                 ${itemDiagnostico ? ` AND d.id_items_diagnostico = ${pool.escape(itemDiagnostico)}` : ''}
                 ${estadoMujeres ? ` AND d.id_estado_mujeres = ${pool.escape(estadoMujeres)}` : ''} and d.id_red_laboratorio = ${pool.escape(red)} 
                 ${itemDiagnostico ? '' : `group by d.codigo`} order by d.fecha_solicitud desc
                 `
    const [rows] = await pool.query(sql)
    if (rows[0]?.codigo_diagnostico === null) return []
    else return rows
  }



  buscarPorMunicipio = async (fecha1, fecha2, municipio, grupo, grupoEtario, itemDiagnostico, estadoMujeres) => {

    const sql = `SELECT 

    d.paciente as paciente_diagnostico,
    d.edad as edad_diagnostico,
    d.grupo_etario as grupo_etario_diagnostico,
    d.grupo as grupo_diagnostico,  
    d.comunidad as comunidad_diagnostico,



    t.medico as medico_tratamiento,
    t.hospital as hospital_tratamiento,
    t.municipio as municipio_tratamiento,
    t.red as red_tratamiento,
    DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini_tratamiento,
    DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin_tratamiento,
    t.observacion as observacion_tratamiento,


    d.codigo as codigo_diagnostico,
    GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
    date_format(d.fecha_solicitud, '%d/%m/%Y') as fecha_solicitud_diagnostico,
    date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
    d.conclusiones as conclusiones_diagnostico,
    d.observaciones as observaciones_diagnostico,
    d.medico_diagnostico as medico_diagnostico, 
    d.laboratorio as laboratorio_diagnostico,
        d.nombre_municipio_laboratorio, 
                  d.nombre_red_laboratorio, 
    d.pre_quirurgico as pre_quirurgico_diagnostico,
    d.post_tratamiento as post_tratamiento_diagnostico,
    d.estado_mujeres as estado_mujeres_diagnostico,

    ${itemDiagnostico ? `IF(d.positivo = 0, 'No realizado', IF(d.positivo = 1, 'SI', 'NO')) as positivo, ` : `"-" as positivo, `}
    ${itemDiagnostico ? `IF(d.negativo = 0, 'No realizado', IF(d.negativo = 1, 'SI', 'NO')) as negativo, ` : `"-" as negativo, `}
    ${itemDiagnostico ? `IF(d.indeterminado = 0, 'No realizado', IF(d.indeterminado = 1, 'SI', 'NO')) as indeterminado, ` : `"-" as indeterminado, `}
    if(d.estado=1, 'resultado revisado', 'resultado no revisado') AS estado_diagnostico


   FROM diagnostico d
   left join tratamiento t on t.id = d.id_tratamiento
   WHERE d.fecha_solicitud between '${fecha1}' and '${fecha2}'
   ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
   ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
   ${itemDiagnostico ? ` AND d.id_items_diagnostico = ${pool.escape(itemDiagnostico)}` : ''}
   ${estadoMujeres ? ` AND d.id_estado_mujeres = ${pool.escape(estadoMujeres)}` : ''} and  d.id_municipio_laboratorio = ${pool.escape(municipio)} 
   ${itemDiagnostico ? '' : `group by d.codigo`} order by d.fecha_solicitud desc
   `
    const [rows] = await pool.query(sql)
    if (rows[0]?.codigo_diagnostico === null) return []
    else return rows
  }



  buscarPorHospital = async (fecha1, fecha2, hospital, grupo, grupoEtario, itemDiagnostico, estadoMujeres) => {

    const sql = `SELECT 

    d.paciente as paciente_diagnostico,
    d.edad as edad_diagnostico,
    d.grupo_etario as grupo_etario_diagnostico,
    d.grupo as grupo_diagnostico,  
    d.comunidad as comunidad_diagnostico,



    t.medico as medico_tratamiento,
    t.hospital as hospital_tratamiento,
    t.municipio as municipio_tratamiento,
    t.red as red_tratamiento,
    DATE_FORMAT(t.fecha_ini, '%d/%m/%Y') as fecha_ini_tratamiento,
    DATE_FORMAT(t.fecha_fin, '%d/%m/%Y') as fecha_fin_tratamiento,
    t.observacion as observacion_tratamiento,


    d.codigo as codigo_diagnostico,
    GROUP_CONCAT(DISTINCT concat(d.items_diagnostico) SEPARATOR ', ') as diagnostico,
    date_format(d.fecha_solicitud, '%d/%m/%Y') as fecha_solicitud_diagnostico,
    date_format(d.fecha_diagnostico, '%d/%m/%Y') as fecha_diagnostico,
    d.conclusiones as conclusiones_diagnostico,
    d.observaciones as observaciones_diagnostico,
    d.medico_diagnostico as medico_diagnostico, 
    d.laboratorio as laboratorio_diagnostico,
        d.nombre_municipio_laboratorio, 
                  d.nombre_red_laboratorio, 
    d.pre_quirurgico as pre_quirurgico_diagnostico,
    d.post_tratamiento as post_tratamiento_diagnostico,
    d.estado_mujeres as estado_mujeres_diagnostico,

    ${itemDiagnostico ? `IF(d.positivo = 0, 'No realizado', IF(d.positivo = 1, 'SI', 'NO')) as positivo, ` : `"-" as positivo, `}
    ${itemDiagnostico ? `IF(d.negativo = 0, 'No realizado', IF(d.negativo = 1, 'SI', 'NO')) as negativo, ` : `"-" as negativo, `}
    ${itemDiagnostico ? `IF(d.indeterminado = 0, 'No realizado', IF(d.indeterminado = 1, 'SI', 'NO')) as indeterminado, ` : `"-" as indeterminado, `}
    if(d.estado=1, 'resultado revisado', 'resultado no revisado') AS estado_diagnostico


   FROM diagnostico d
   left join tratamiento t on t.id = d.id_tratamiento
   WHERE d.fecha_solicitud between '${fecha1}' and '${fecha2}'
   ${grupo ? ` AND d.id_grupo = ${pool.escape(grupo)}` : ''}
   ${grupoEtario ? ` AND d.id_grupo_etario = ${pool.escape(grupoEtario)}` : ''}
   ${itemDiagnostico ? ` AND d.id_items_diagnostico = ${pool.escape(itemDiagnostico)}` : ''}
   ${estadoMujeres ? ` AND d.id_estado_mujeres = ${pool.escape(estadoMujeres)}` : ''} and  d.id_laboratorio = ${pool.escape(hospital)} 
   ${itemDiagnostico ? '' : `group by d.codigo`} order by d.fecha_solicitud desc
   `
    const [rows] = await pool.query(sql)

    if (rows[0]?.codigo_diagnostico === null) return []
    else return rows

  }




}
