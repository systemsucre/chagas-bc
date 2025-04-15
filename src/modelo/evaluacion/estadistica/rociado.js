
const pool = require('../../bdConfig.js')

module.exports = class Rociado {




    listarMunicipios = async () => {


        let data = [{ value: 10000, label: 'CONSOLIDADO', nivel: 1 }]


        const sqlRed =
            `SELECT  id as value, concat('RED: ',nombre) as label, 2 as nivel from red`
        const [rowsRed] = await pool.query(sqlRed)

        for (let r of rowsRed) {
            data.push(r)
            const sqlMunicipio =
                `SELECT  id as value, concat('MUNICIPIO: ',nombre) as label, 3 as nivel from municipio where red = ${pool.escape(r.value)} order by nombre asc`
            const [rowsMunicipio] = await pool.query(sqlMunicipio)
            for (let m of rowsMunicipio) {
                data.push(m)
                const sqlComunidad =
                    `SELECT  id as value, concat('COMUNIDAD: ',nombre) as   label, 4 as nivel from comunidad where municipio = ${pool.escape(m.value)} order by nombre asc`
                const [rowsComunidad] = await pool.query(sqlComunidad)
                for (let c of rowsComunidad) {
                    data.push(c)
                }
            }
        }

        const sqlAños =
            `SELECT  id as value, gestion  as label from gestion`
        const [rowsAños] = await pool.query(sqlAños)

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
                ${datos.entidad !== 10000 ? datos.nivel === 2 ? ` r.red = ${pool.escape(datos.entidad)} and` : datos.nivel === 3 ? ` r.municipio= ${pool.escape(datos.entidad)} and` :
                datos.nivel === 4 ? ` r.comunidad= ${pool.escape(datos.entidad)} and` : '' : ''}

                (m.num BETWEEN ${pool.escape(datos.fecha1)} and ${pool.escape(datos.fecha2)})  and r.id_gestion = ${pool.escape(datos.gestion)}
                group by r.comunidad
                order by r.id  asc`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        return rows
    }











    listarConsolidado = async (fecha1, fecha2) => {
        const sql =
            `SELECT  r.id, c.id as idcomunidad, c.nombre as comunidad, m.nombre as municipio, re.nombre as red,r.mes,


                (select DATE_FORMAT(min(fecha), '%Y/%m/%d') from rociado where codigo = r.codigo) as inicio, 
                (select DATE_FORMAT(max(fecha), '%Y/%m/%d') from rociado where codigo = r.codigo) as final, 
                
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.num_hab ELSE 0 END) AS num_hab, 
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.habitantes ELSE 0 END) AS habitantes, 

                (select count(id) as viv_existentes from casa where comunidad = c.id) viv_existentes,
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
                DATE_FORMAT(r.fecha_remision, '%Y/%m/%d') AS fecha_remision, 
                DATE_FORMAT(r.fecha_remision_jefeBrigada, '%Y/%m/%d') AS fecha_remision_jefeBrigada, 
                r.estado, r.codigo, r.author


                FROM rociado r
                
                inner join insecticida i on i.id = r.insecticida
                inner join clicor ci on ci.id = r.ciclo
                inner join casa cs on cs.id = r.casa
                inner join comunidad c on c.id = cs.comunidad
                inner join municipio m on m.id = c.municipio
                inner join red re on re.id = m.red
                where (r.fecha BETWEEN ${pool.escape(fecha1)} and ${pool.escape(fecha2)}) and r.estado >0
                group by r.codigo
                order by r.id  desc `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarPorMunicipio = async (municipio, fecha1, fecha2) => {
        const sql =
            `SELECT  r.id, c.id as idcomunidad, c.nombre as comunidad, m.nombre as municipio,r.mes,


                (select DATE_FORMAT(min(fecha), '%Y/%m/%d') from rociado where codigo = r.codigo) as inicio, 
                (select DATE_FORMAT(max(fecha), '%Y/%m/%d') from rociado where codigo = r.codigo) as final, 
                
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.num_hab ELSE 0 END) AS num_hab, 
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.habitantes ELSE 0 END) AS habitantes, 

                (select count(id) as viv_existentes from casa where comunidad = c.id) viv_existentes,
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
                DATE_FORMAT(r.fecha_remision, '%Y/%m/%d') AS fecha_remision, 
                DATE_FORMAT(r.fecha_remision_jefeBrigada, '%Y/%m/%d') AS fecha_remision_jefeBrigada, 
                r.estado, r.codigo, r.author


                FROM rociado r
                inner join insecticida i on i.id = r.insecticida
                inner join clicor ci on ci.id = r.ciclo
                inner join casa cs on cs.id = r.casa
                inner join comunidad c on c.id = cs.comunidad
                inner join municipio m on m.id = r.municipio
                where m.id = ${pool.escape(municipio)} and (r.fecha BETWEEN ${pool.escape(fecha1)} and ${pool.escape(fecha2)}) and r.estado >0
                group by r.codigo
                order by r.id  desc `;
        const [rows] = await pool.query(sql)
        const sqlOtros =
            `SELECT  m.nombre as municipio,  r.nombre as red
            FROM  municipio m 
            inner join red r on r.id = m.red
            where m.id = ${pool.escape(municipio)}`
        const [rowsOtros] = await pool.query(sqlOtros)


        return [rows, rowsOtros]
    }





    listarPorComunidadRR2 = async (comunidad, fecha1, fecha2) => {
        const sql =
            `SELECT  r.id, c.id as idcomunidad, c.nombre as comunidad,
                DATE_FORMAT(min(r.fecha), '%Y/%m/%d') as inicio, DATE_FORMAT(max(r.fecha), '%Y/%m/%d') as final, 
                
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.num_hab ELSE 0 END) AS num_hab, 
                SUM(CASE WHEN (r.cerrada=0 and r.renuente=0) THEN cs.habitantes ELSE 0 END) AS habitantes, 

                (select count(id) as viv_existentes from casa where comunidad = c.id) viv_existentes,
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
                DATE_FORMAT(r.fecha_remision, '%Y/%m/%d') AS fecha_remision, 
                DATE_FORMAT(r.fecha_remision_jefeBrigada, '%Y/%m/%d') AS fecha_remision_jefeBrigada, 
                r.estado, r.codigo, r.author


                FROM rociado r
                inner join insecticida i on i.id = r.insecticida
                inner join clicor ci on ci.id = r.ciclo
                inner join casa cs on cs.id = r.casa
                inner join comunidad c on c.id = cs.comunidad
                inner join municipio m on m.id = c.municipio





                where c.id = ${pool.escape(comunidad)} and (r.fecha BETWEEN ${pool.escape(fecha1)} and ${pool.escape(fecha2)}) and r.estado =1
                group by r.codigo
                order by r.id  desc `;
        const [rows] = await pool.query(sql)
        const sqlOtros =
            `SELECT  c.id as idcomunidad, h.nombre as hospital, c.nombre as comunidad, m.nombre as municipio,  r.nombre as red
            FROM comunidad c
            inner join hospital h on h.id = c.est
            inner join municipio m on m.id = c.municipio
            inner join red r on r.id = m.red
            where c.id = ${pool.escape(comunidad)}`
        const [rowsOtros] = await pool.query(sqlOtros)


        return [rows, rowsOtros]
    }




}
