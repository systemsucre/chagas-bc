
const pool = require('../../bdConfig.js')

module.exports = class Rociado {


    listarMunicipios = async (municipio, nombre_municipio) => {

        let data = [{ value: 1000, label: '-- ' + nombre_municipio + ' --', nivel: 1 }]
        const sqlComunidad =
            `SELECT  id as value, concat('➡️',nombre) as   label from comunidad where municipio = ${pool.escape(municipio)}`
        const [rowsComunidad] = await pool.query(sqlComunidad)


        const sqlAños =
            `SELECT  id as value, gestion  as label from gestion`
        const [rowsAños] = await pool.query(sqlAños)

        for (const row of rowsComunidad) {
            data.push(row)
        }

        return [data, rowsAños]
    }

    listarMeses = async (gestion) => {

        const sqlMeses =
            `SELECT  m.num as value, concat( m.mes,' - ', g.gestion)  as label from mes m
            inner join gestion g on g.id = m.gestion where g.id = ${pool.escape(gestion)} order by m.num asc`
        const [rowsMeses] = await pool.query(sqlMeses)


        return rowsMeses
    }

    listarPorComunidad = async (datos) => {
        const sql =
            `SELECT  r.id as rociado,  cs.id as idcasa, cs.cv, cs.jefefamilia, if(r.id>0, 1, 0) as estado,cs.num_hab, r.gestion, r.mes,

            r.nombre_hospital, r.nombre_comunidad, r.nombre_municipio, r.nombre_red,

            if((r.cerrada or r.renuente),null,  cs.habitantes) as habitantes, 
            if(r.cerrada, 'SI', 'NO') AS cerrada, 
            if(r.renuente, 'SI', 'NO') AS renuente, 
            r.cerrada as cerrada_n, r.renuente as renuente_n, 
            r.idr, r.idnr, r.corrales, r.gallineros, r.conejeras, r.zarzo, r.otros, r.numeroCargas, i.unidad,  r.dosis, r.lote, DATE_FORMAT(r.fecha_rociado,"%Y/%m/%d") AS fecha, 
            r.insecticida, r.ciclo, i.nombre as nombreInsecticida, ci.ciclo as nombreCiclo, r.observaciones, 
            r.selectivo, r.total, r.denuncia,
            r.author

            FROM casa cs 
            left join rociado r on r.casa = cs.id  and r.id_mes = ${pool.escape(datos.mes)} 
            left join insecticida i on i.id = r.insecticida
            left join clicor ci on ci.id = r.ciclo 
            where  cs.comunidad = ${pool.escape(datos.comunidad)}
            order by CAST(cs.cv AS INT) asc`;
        const [rows] = await pool.query(sql)
        // console.log(codigo, rows,'parametros listar rociado por comundiad')

        return rows
    }

    buscar = async (datos) => {
        const sql =
            `SELECT  r.id, r.comunidad as id_comunidad, r.nombre_comunidad as comunidad,r.nombre_red as red,r.nombre_municipio as municipio, r.nombre_hospital as hospital,r.id_mes, r.id_gestion,r.mes,

                DATE_FORMAT(min(r.fecha_rociado), '%Y/%m/%d') as inicio, 
                DATE_FORMAT(max(r.fecha_rociado), '%Y/%m/%d') as final, 
                   
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.num_hab ELSE 0 END) AS num_hab, 
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.habitantes ELSE 0 END) AS habitantes, 

                (select count(id) as viv_existentes from casa where comunidad = r.comunidad) viv_existentes,
                (COUNT(r.id) -(sum(r.cerrada)+ sum(r.renuente)))  as  'viv_rociadas', 

                sum(r.cerrada) as cerrada, 
                sum(r.renuente) as renuente,  

                sum(r.idr) as idr,
                sum(r.idnr) as idnr,
                (SELECT count(id) as total from rociado where idr>0 and codigo = r.codigo ) as total,
                (SELECT count(id) as parcial from rociado where idnr>0 and codigo = r.codigo ) as parcial,

                sum(r.corrales) as corrales,
                sum(r.gallineros) as gallineros,
                sum(r.conejeras) as conejeras,  
                sum(r.zarzo) as zarzo,
                sum(r.otros) as otros,
                r.dosis,i.nombre as insecticida,
                sum(r.numeroCargas) as totalCargas,
                round((sum(r.numeroCargas*r.dosis)/1000), 2) as totalUnidad,
                ci.ciclo,
                r.codigo, r.author


                FROM rociado r
                inner join insecticida i on i.id = r.insecticida
                inner join clicor ci on ci.id = r.ciclo
                inner join casa cs on cs.id = r.casa
                inner join mes m on m.id = r.id_mes  

                where 
                ${datos.entidad === 1000 ? ` r.municipio = ${pool.escape(datos.municipio_id_tec)}` : `r.comunidad = ${pool.escape(datos.entidad)}`}

                and (m.num BETWEEN ${pool.escape(datos.fecha1)} and ${pool.escape(datos.fecha2)})  and r.id_gestion = ${pool.escape(datos.gestion)}
                group by r.comunidad
                order by r.id  asc`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        return rows
    }


}
