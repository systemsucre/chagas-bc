
const pool = require('../../bdConfig.js')

module.exports = class EE2 {


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
            `SELECT  
            
                e.nombre_comunidad, e.nombre_municipio,

                e.nombre_hospital,e.nombre_red,

                cs.id as idcasa, e.id as idee1, cs.cv, cs.jefefamilia, cs.num_hab,e.gestion, 
                e.mes, if(e.id>0, 1, 0) as estado,

                e.inicio, e.final, e.prerociado,

                
            
                if((e.cerrada or e.renuente) ,'00:00:00',SEC_TO_TIME(TIME_TO_SEC(e.final) - TIME_TO_SEC(e.inicio))) AS total,


                if((e.cerrada or e.renuente),null,  cs.num_hab) as num_hab, 
                if((e.cerrada or e.renuente),null,  cs.habitantes) as habitantes, 

                ( select case when id = max(id) then   DATE_FORMAT(fecha_rociado, "%Y/%m/%d") end as fecha_rociado  FROM rociado where casa = cs.id and estado = 1) AS  fecha_rociado, 

               if((e.cerrada or e.renuente),-1 ,cs.vm_intra) as vm_intra, 
               if((e.cerrada or e.renuente),-1 ,cs.vm_peri) as vm_peri,   
                
                DATE_FORMAT(e.created_at, "%Y/%m/%d") as fecha,  

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
                inner join comunidad c on c.id = cs.comunidad
                left join ee1 e on cs.id = e.casa         AND e.comunidad = ${pool.escape(datos.comunidad)}
                and e.id_mes = ${pool.escape(datos.mes)} and e.id_gestion = ${pool.escape(datos.gestion)}

                where cs.comunidad = ${pool.escape(datos.comunidad)}
                order by CAST(cs.cv AS INT) asc`;
        const [rows] = await pool.query(sql)

        return rows
    }

    buscar = async (datos) => {

        const sql =
            `SELECT  
                e.id, e.comunidad as idcomunidad, e.nombre_comunidad as comunidad, e.nombre_red,e.nombre_municipio,e.mes,
                e.prerociado,e.id_gestion, e.id_mes,

                DATE_FORMAT(min(e.created_at), '%Y/%m/%d') as inicio,
                DATE_FORMAT(max(e.created_at), '%Y/%m/%d') as final,

                case when (e.cerrada=1 or e.renuente=1) then  sum(cs.num_hab) end as num_hab, 

                SUM(CASE WHEN (e.cerrada=0 and e.renuente=0) THEN cs.num_hab ELSE 0 END) AS num_hab, 
                SUM(CASE WHEN (e.cerrada=0 and e.renuente=0) THEN cs.habitantes ELSE 0 END) AS habitantes, 

                (select count(id)  from casa where comunidad = e.comunidad) AS viv_existentes,         
                if((e.num_viviendas_actual is null),0, e.num_viviendas_actual) as num_viviendas_actual,
                count(case when e.cerrada =0 and e.renuente=0 then e.id end) AS evaluadas,
                round(((count(case when e.cerrada =0 and e.renuente=0 then e.id end)/COUNT(e.id))*100), 2) as cob,

                count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end) AS viv_pos,
                round((count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end)/ count(case when e.cerrada =0 and e.renuente=0 then e.id end) )*100 , 2) as iiv,

                count(case when (ecin + ecia) >0 then e.id end) AS pos_intra,
                round((count(case when (ecin + ecia) >0 then e.id end)/count(case when e.cerrada =0 and e.renuente=0 then e.id end))*100, 2) as iii,

                count(case when (ecpn + ecpa) >0 then e.id end) AS pos_peri,
                round((count(case when (ecpn + ecpa) >0 then e.id end)/count(case when e.cerrada =0 and e.renuente=0 then e.id end))*100,2) as iip,

                count(case when (ecin+ ecpn) >0 then e.id end) AS pos_ninfas,
                round((count(case when (ecin+ ecpn) >0 then e.id end) /count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end))*100, 2) as iic,

                count(case when (ecin) >0 then e.id end) AS pos_ninfas_intra,
                round(count(case when (ecin) >0 then e.id end)/count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end)*100, 2) as ici,

                count(case when (ecpn) >0 then e.id end) AS pos_ninfas_peri,
                round(count(case when (ecpn) >0 then e.id end)/count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end)*100, 2) as icp,

                count(case when vm_intra = 1 then e.id end) AS vm_intra_si,
                count(case when vm_intra = 0 then e.id end) AS vm_intra_no,

                count(case when vm_peri = 1 then e.id end) AS vm_peri_si,
                count(case when vm_peri = 0 then e.id end) AS vm_peri_no,

                sum(e.ecin) as ecin,  sum(e.ecia) as ecia, sum(e.ecpn) as ecpn, sum(e.ecpa) as ecpa, 
                sum(e.lcipd) as lcipd, sum(e.lcicm) as lcicm, sum(e.lcith) as lcith, sum(e. lciot) as lciot , sum(e.lcppd) as lcppd,
                sum(e.lcpga) as lcpga, sum(e.lcpcl) as lcpcl, sum(e.lcpcj) as lcpcj, sum(e.lcpz) as lcpz, sum(e.lcpot) as lcpot,
                
                cs.altitud, cs.latitud, cs.longitud,  e.author



                FROM ee1 e
                inner join casa cs on cs.id = e.casa 
                inner join mes m on m.id = e.id_mes  
                where
                ${datos.entidad !== 10000 ? datos.nivel === 2 ? ` e.id_red = ${pool.escape(datos.entidad)} and` : datos.nivel === 3 ? ` e.municipio= ${pool.escape(datos.entidad)} and` :
                datos.nivel === 4 ? ` e.comunidad= ${pool.escape(datos.entidad)} and` : '':''
                }
                 (m.num BETWEEN ${pool.escape(datos.fecha1)} and ${pool.escape(datos.fecha2)})  and id_gestion = ${pool.escape(datos.gestion)}
                group by e.comunidad
                order by e.id  desc`;
        const [rows] = await pool.query(sql)
        return rows
    }


}
