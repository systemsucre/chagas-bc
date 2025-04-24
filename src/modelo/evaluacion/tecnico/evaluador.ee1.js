
const pool = require('../../bdConfig.js')

module.exports = class EE1 {




    listarGestion = async () => {
        const sql =
            `SELECT id as value, gestion as label FROM gestion where estado = 1 and eliminado = false ORDER BY id ASC `;
        const [rows] = await pool.query(sql)
        return rows
    }


    filtarEvaluacionesViviendas = async (gestion, user, municipio) => {
        const sql =
            `
            SELECT 
            id,  SUBSTR(mes, 1 , 3 ) as mes
            from ee1 
            where id_gestion = ${pool.escape(gestion)} and municipio = ${pool.escape(municipio)}`
        const [rows] = await pool.query(sql)
        // console.log(sql)

        const sqlViviendas =
            `
            SELECT 
            co.id as id_comunidad, codigo as nombre_comunidad, if(sum(c.habitantes)>0,sum(c.habitantes),0)  as habitantes
            from comunidad co 
            left join casa c on c.comunidad = co.id
            where co.municipio = ${pool.escape(municipio)} group by co.id order by co.nombre asc`
        const [rowsViviendas] = await pool.query(sqlViviendas)

        // let data = []
        // for (let c of rowsViviendas) {
        //     const [cm_us] = await pool.query(`select id from usuario where comunidad = ${pool.escape(c.comunidad)} and estado = 1`)
        //     if (cm_us.length == 0) {
        //         data.push(c)
        //     }
        // }

        return [rows.length > 0 ? rows : [], rowsViviendas.length > 0 ? rowsViviendas : []]
    }


    listarMeses = async (gestion, fecha) => {
        const sql =
            `SELECT m.id as value, concat(m.mes, ' - ',g.gestion) as label, m.estado, m.gestion
            FROM mes m
            inner join gestion g on g.id = m.gestion 
            where  ${pool.escape(fecha)} >= m.ini and ${pool.escape(fecha)} <= m.fin
            and m.eliminado = false and g.id = ${pool.escape(gestion)} ORDER BY m.num asc `;
        const [rows] = await pool.query(sql)
        // console.log(sql, rows)

        return rows
    }


    listarComunidades = async (municipio) => {
        const sql =
            `SELECT id as value, nombre as label 
            from comunidad  where municipio = ${pool.escape(municipio)}`;
        const [comunidad] = await pool.query(sql)

        let data = []
        for (let c of comunidad) {
            const [cm_us] = await pool.query(`select id from usuario where comunidad = ${pool.escape(c.value)} and estado = 1`)
            if (cm_us.length == 0) {
                data.push(c)
            }
        }
        return data
    }


    listarCasas = async (comunidad, mes) => {
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
                 DATE_FORMAT(e.created_at, "%Y/%m/%d" ) as fecha, e.author, e.usuario
            
            FROM casa cs
            left join ee1 e on cs.id = e.casa and e.id_mes = ${pool.escape(mes)} 
            where cs.comunidad = ${pool.escape(comunidad)}  order by CAST(cs.cv AS INT) asc`
        const [rows] = await pool.query(sql)

        const sqlOtros =
            `SELECT   c.nombre as comunidad, m.nombre as municipio, h.nombre as hospital, r.nombre as red
            FROM comunidad c
            inner join hospital h on h.id = c.est
            inner join municipio m on m.id = c.municipio
            inner join red r on r.id = m.red
            where c.id = ${pool.escape(comunidad)}`
        const [rowsOtros] = await pool.query(sqlOtros)

        return [rows, rowsOtros]
    }


    insertar = async (datos) => {

        const sqlCasa = `select count(id) as cantidad 

        from casa where comunidad = ${pool.escape(datos.comunidad)}`
        const [rowsCasa] = await pool.query(sqlCasa)
        const [mes] = await pool.query(`select num from mes where id = ${pool.escape(datos.id_mes)}`)
        const sqlEstructura = `select h.id as id_hospital, h.nombre as nombre_hospital, r.id as id_red, r.nombre as nombre_red

                from comunidad c
                inner join hospital h on h.id = c.est
                inner join municipio m on m.id = c.municipio
                inner join red r on r.id = m.red 

                where c.id = ${pool.escape(datos.comunidad)}`
        const [rowsEstructura] = await pool.query(sqlEstructura)

        datos.id_hospital = rowsEstructura[0].id_hospital
        datos.nombre_hospital = rowsEstructura[0].nombre_hospital
        datos.id_red = rowsEstructura[0].id_red
        datos.nombre_red = rowsEstructura[0].nombre_red
        datos.num_mes = mes[0].num

        const sqlDelet =
            `DELETE FROM ee1 WHERE casa = ${pool.escape(datos.casa)} and id_mes = ${pool.escape(datos.id_mes)}`;
        await pool.query(sqlDelet)

        const [result_save] = await pool.query("INSERT INTO ee1 SET  ?", datos)


        if (result_save.insertId > 0) {
            const sql_prerociado = `UPDATE ee1 SET prerociado = ${pool.escape(datos.prerociado)}
             WHERE mes = ${pool.escape(datos.mes)} and comunidad = ${pool.escape(datos.comunidad)}`
            await pool.query(sql_prerociado)

            const [last_ee1] = await pool.query(`select  max(num_mes) as num_mes from ee1 where id_gestion =${pool.escape(datos.id_gestion)}`)
            const [cantidad_eval_ee1] = await pool.query(`select  * from ee1 where id_mes =${pool.escape(datos.id_mes)} and comunidad = ${pool.escape(datos.comunidad)}`)

            if (last_ee1[0].num_mes >= mes[0].num) {

                const sql_ = `UPDATE casa SET ejemplares = ${pool.escape(datos.ecin + datos.ecia + datos.ecpn + datos.ecpa)} WHERE id = ${pool.escape(datos.casa)}`
                await pool.query(sql_)


                if (rowsCasa[0].cantidad == cantidad_eval_ee1.length) {

                    // console.log(rowsCasa[0].cantidad, '  ', cantidad_eval_ee1.length, ' ', datos.created_at,)

                    let fecha = datos.created_at

                    let codigo = 'C-' + datos.comunidad + '' + fecha.split('-')[0] + '' + fecha.split('-')[1] + fecha.split('-')[2].split(' ')[0] + '-' +
                        fecha.split('-')[2].split(' ')[1].split(':')[0] + ' ' + fecha.split('-')[2].split(' ')[1].split(':')[2] + '' + fecha.split('-')[2].split(' ')[1].split(':')[2]

                    const result = await pool.query(`update ee1 set  
                                num_viviendas_actual = ${pool.escape(rowsCasa[0].cantidad)},
                                codigo = ${pool.escape(codigo)}
                                WHERE id_mes = ${pool.escape(datos.id_mes)} and comunidad = ${datos.comunidad}`);

                    if (result[0].affectedRows > 0) {
                        let num_casas = rowsCasa[0].cantidad
                        const [rowsIds] = await pool.query(`SELECT  e.id,  
                    
                        COUNT(cs.id) AS viv_existentes,         
                        ${pool.escape(num_casas)} as num_viviendas_actual,
        
                        round(( (${pool.escape(num_casas)}) / COUNT(cs.id) )*100 , 2) as viv_porc,
                        
                        count(case when (ecin+  ecia+ecpn+ ecpa)>0 then e.id end) AS viv_pos,
        
                        round((  count(case when (ecin + ecia + ecpn+ ecpa)>0 then e.id end) / ${pool.escape(num_casas)} ) *100 , 2) as viv_pos_porc,
                        
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
                        where e.id_mes = ${pool.escape(datos.id_mes)} and e.comunidad = ${pool.escape(datos.comunidad)}`)

                        let total = 0
                        for (let e of rowsIds) {
                            total = (e.viv_pos >= 1 ? 1 :
                                e.viv_pos < 1 ? 0 : 0) + (e.pos_ninfas_intra >= 1 ? 1 :
                                    e.pos_ninfas_intra < 1 ? 0 : 0) + (
                                    e.iii > e.iip ? 1 :
                                        e.iii < e.iip ? 0 : 0
                                ) + (e.iii > 0 && e.iii <= 3 ? 1 :
                                    e.iii > 3 && e.iii <= 7 ? 2 :
                                        e.iii > 7 ? 3 : null)
                        }
                        await pool.query(`update casa set riesgo = ${pool.escape(total)} where comunidad = ${pool.escape(datos.comunidad)}`)
                    }
                    return true
                }
                return true
            }
            else return true
        } else return false

    }



    deleted = async (evaluacion, user, username, fecha) => {
        const [result_recover] = await pool.query(`select * from ee1 WHERE id = ${pool.escape(evaluacion)}`);
        const sql = `delete from ee1 where id = ${pool.escape(evaluacion)} and usuario = ${pool.escape(user)}`
        const [result] = await pool.query(sql)
        if (result.affectedRows > 0) {
            pool.query('insert into delete_data set ?', {
                table_affected: 'ee1 (delete)',
                content: JSON.stringify(result_recover),
                id_user_action: user,
                name_user_action: username,
                action_at: fecha
            })
            return true
        }
        else return false
    }


}
