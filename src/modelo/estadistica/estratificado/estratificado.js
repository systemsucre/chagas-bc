
const pool = require('../../bdConfig.js')

module.exports = class Estratificado {


    listarMunicipios = async () => {

        const sqlMunicipio =
            `SELECT  id as value, nombre as label, 2 as nivel from municipio`
        const [rowsMunicipio] = await pool.query(sqlMunicipio)
        const sqlAños =
            `SELECT  id as value, gestion  as label from gestion`
        const [rowsAños] = await pool.query(sqlAños)

        return [rowsMunicipio, rowsAños]
    }

    listarMeses = async (gestion) => {

        const sqlMeses =
            `SELECT  m.num as value, concat( m.mes,' - ', g.gestion)  as label from mes m
            inner join gestion g on g.id = m.gestion where g.id = ${pool.escape(gestion)} order by m.num asc`
        const [rowsMeses] = await pool.query(sqlMeses)
        return rowsMeses

    }



    listarPorMunicipio = async (municipio, mes1, mes2, gestion) => {
        const sql =
            `SELECT  e.id,  e.comunidad as id_comunidad, e.id_mes,
                h.nombre as hospital, 
                c.nombre as comunidad, 
                e.codigo,
                
                min(DATE_FORMAT(created_at, '%Y/%m/%d')) as inicio, 
                max(DATE_FORMAT(created_at, '%Y/%m/%d')) as final, 

                (select count(id) from casa where  comunidad = c.id) viv_existentes,           
                e.num_viviendas_actual,

                round(( (e.num_viviendas_actual) / (select count(id) from casa where  comunidad = c.id) )*100 , 2) as viv_porc,

                
                count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end) AS viv_pos,

                round((  count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end) / e.num_viviendas_actual ) *100 , 2) as viv_pos_porc,
                

 

                count(case when (ecin + ecia) >0 then e.id end) AS pos_intra,
                round((count(case when (ecin + ecia) >0 then e.id end)/count(case when e.cerrada =0 and e.renuente=0 then e.id end))*100, 2) as iii,

                count(case when (ecpn + ecpa) >0 then e.id end) AS pos_peri, 
                round((count(case when (ecpn + ecpa) >0 then e.id end)/count(case when e.cerrada =0 and e.renuente=0 then e.id end))*100,2) as iip,

                

                count(case when (ecin+ ecpn) >0 then e.id end) AS pos_ninfas,
               round((count(case when (ecin+ ecpn) >0 then e.id end) /count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end))*100, 2) as iic,

                count(case when (ecin) >0 then e.id end) AS pos_ninfas_intra,
                round(count(case when (ecin) >0 then e.id end)/count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end)*100, 2) as ici,

                count(case when (ecpn) >0 then e.id end) AS pos_ninfas_peri,
                round(count(case when (ecpn) >0 then e.id end)/count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end)*100, 2) as icp





                FROM ee1 e
                inner join casa cs on cs.id = e.casa
                inner join comunidad c on c.id = cs.comunidad
                inner join hospital h on h.id = c.est  
                
                where e.num_mes between ${pool.escape(mes1)} and ${pool.escape(mes2)} and e.municipio = ${pool.escape(municipio)} and e.id_gestion = ${pool.escape(gestion)}
            
                group by e.codigo
                order by e.id  desc`;

                // console.log('datos de es')
        const [rows] = await pool.query(sql)

        const sqlOtros =
            `SELECT  m.nombre as municipio,  r.nombre as red
                FROM  municipio m 
                inner join red r on r.id = m.red
                where m.id = ${pool.escape(municipio)}`
        const [rowsOtros] = await pool.query(sqlOtros)

        return [rows, rowsOtros]
    }



    listarPorComunidad = async (comunidad, mes) => {

        const sql =
            `
        SELECT 
            cs.id as idcasa, e.id as idee1, cs.cv, cs.jefefamilia, cs.num_hab,e.gestion, 
            e.mes, if(e.id>0, 1, 0) as estado,

            e.id as evaluacion, e.inicio, e.final, e.prerociado,

            if((e.cerrada or e.renuente) ,'00:00:00',SEC_TO_TIME(TIME_TO_SEC(e.final) - TIME_TO_SEC(e.inicio))) AS total,

            if((e.cerrada or e.renuente),null,  cs.num_hab) as num_hab, 
            if((e.cerrada or e.renuente),null,  cs.habitantes) as habitantes, 
            
            (select case when id = max(id) then   DATE_FORMAT(fecha_rociado, "%Y/%m/%d") end as fecha_rociado  FROM rociado where casa = cs.id and estado = 1) AS  fecha_rociado, 
            if((e.cerrada or e.renuente),-1 ,cs.vm_intra) as vm_intra, 
            if((e.cerrada or e.renuente),-1 ,cs.vm_peri) as vm_peri,  
          

            if((e.cerrada or e.renuente), null, e.ecin) as ecin, 
            if((e.cerrada or e.renuente), null, e.ecia) as ecia, 
            if((e.cerrada or e.renuente), null, e.ecpn) as ecpn, 
            if((e.cerrada or e.renuente), null,e.ecpa) as ecpa, 

            if((e.cerrada or e.renuente), null,e.lcipd) as lcipd , 
            if((e.cerrada or e.renuente), null,e.lcicm) as lcicm, 
            if((e.cerrada or e.renuente), null,e.lcith) as lcith, 
            if((e.cerrada or e.renuente), null,e.lciot) as lciot , 
            if((e.cerrada or e.renuente), null,e.lcppd) as  lcppd, 
            if((e.cerrada or e.renuente), null,e.lcpga) as lcpga, 
            if((e.cerrada or e.renuente), null,e.lcpcl) as lcpcl, 
            if((e.cerrada or e.renuente), null,e.lcpcj) as lcpcj, 
            if((e.cerrada or e.renuente), null,e.lcpz) as lcpz, 
            if((e.cerrada or e.renuente), null,e.lcpot) as lcpot, 

            e.id_gestion,e.id_mes,

            cs.altitud, cs.latitud, cs.longitud, 
            e.negativa, e.cerrada, e.renuente, 
            DATE_FORMAT(e.created_at, "%Y/%m/%d" ) as fecha, e.author
        
            FROM casa cs
            left join ee1 e on cs.id = e.casa and e.id_mes = ${pool.escape(mes)} 
            where cs.comunidad = ${pool.escape(comunidad)}  order by CAST(cs.cv AS INT) asc`
        const [rows] = await pool.query(sql)
        return rows
    }


}
