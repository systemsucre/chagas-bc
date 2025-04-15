
const pool = require('../../bdConfig.js')

module.exports = class EE1 {


    listar = async (comunidad) => {

        const sql =
            `SELECT  e.id, cs.id as idcasa, cs.cv, cs.jefefamilia, e.inicio, e.final, e.prerociado,

                if((e.cerrada or e.renuente) ,'00:00:00',SEC_TO_TIME(TIME_TO_SEC(e.final) - TIME_TO_SEC(e.inicio))) AS total,

                if((e.cerrada or e.renuente),null,  cs.num_hab) as num_hab, 
                if((e.cerrada or e.renuente),null,  cs.habitantes) as habitantes, 
                
                (select case when id = max(id) then   DATE_FORMAT(fecha_rociado, "%Y/%m/%d") end as fecha_rociado  FROM rociado where casa = cs.id and estado = 1) AS  fecha_rociado, 

                if((e.cerrada or e.renuente),-1 ,cs.vm_intra) as vm_intra, 
               if((e.cerrada or e.renuente),-1 ,cs.vm_peri) as vm_peri,  
                
                DATE_FORMAT(e.fecha, "%Y/%m/%d") as fecha,  

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


             
                
                
                
                e.estado,  cs.altitud, cs.latitud, cs.longitud, 
                m.nombre as comunidad, m.nombre as municipio, e.negativa, e.cerrada, e.renuente, 

                u1.id as  idUsuario1, concat(u1.nombre, ' ', u1.ap1) as usuario1, u2.id as  idUsuario2, concat(u2.nombre, ' ', u2.ap1) as usuario2,
                u3.id as  idUsuario3, concat(u3.nombre, ' ', u3.ap1) as usuario3, u4.id as  idUsuario4, concat(u4.nombre, ' ', u4.ap1) as usuario4, e.observaciones, e.codigo, DATE_FORMAT(e.fecha_remision, "%Y/%m/%d %H:%m:%s" ) as fecha_remision, e.author

                FROM ee1 e
                inner join casa cs on cs.id = e.casa
                inner join comunidad c on c.id = cs.comunidad
                inner join municipio m on m.id = c.municipio

                left join usuario u1 on u1.id = e.usuario1
                left join usuario u2 on u2.id = e.usuario2
                left join usuario u3 on u3.id = e.usuario3
                left join usuario u4 on u4.id = e.usuario4

                where  c.id = ${pool.escape(comunidad)} and e.estado = 0
                order by cs.cv asc`;
        const [rows] = await pool.query(sql)

        // console.log(rows, comunidad, ' comunidad para listar datos') 
        return rows
    }

    // DATE_FORMAT(cs.fecha_rociado, "%Y/%m/%d") AS  fecha_rociado, 

    buscar = async (fecha1, fecha2, usuario, comunidad) => {
        const sql =
            `SELECT  e.id, cs.id as idcasa, cs.cv, cs.jefefamilia, e.inicio, e.final, e.prerociado,

                if((e.cerrada or e.renuente) ,'00:00:00',SEC_TO_TIME(TIME_TO_SEC(e.final) - TIME_TO_SEC(e.inicio))) AS total,

                if((e.cerrada or e.renuente),null,  cs.num_hab) as num_hab, 
                if((e.cerrada or e.renuente),null,  cs.habitantes) as habitantes, 

                 ( select case when id = max(id) then   DATE_FORMAT(fecha_rociado, "%Y/%m/%d") end as fecha_rociado  FROM rociado where casa = cs.id and estado = 1 ) AS  fecha_rociado, 
                if((e.cerrada or e.renuente),-1 ,cs.vm_intra) as vm_intra, 
                if((e.cerrada or e.renuente),-1 ,cs.vm_peri) as vm_peri,  
                
                DATE_FORMAT(e.fecha, "%Y/%m/%d") as fecha,  

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


             
                
                
                
                e.estado,  cs.altitud, cs.latitud, cs.longitud, 
                m.nombre as comunidad, m.nombre as municipio, e.negativa, e.cerrada, e.renuente, 

                u1.id as  idUsuario1, concat(u1.nombre, ' ', u1.ap1) as usuario1, u2.id as  idUsuario2, concat(u2.nombre, ' ', u2.ap1) as usuario2,
                u3.id as  idUsuario3, concat(u3.nombre, ' ', u3.ap1) as usuario3, u4.id as  idUsuario4, concat(u4.nombre, ' ', u4.ap1) as usuario4, e.observaciones, e.codigo, DATE_FORMAT(e.fecha_remision, "%Y/%m/%d %H:%m:%s" ) as fecha_remision, e.author

                FROM ee1 e
                inner join casa cs on cs.id = e.casa
                inner join comunidad c on c.id = cs.comunidad
                inner join municipio m on m.id = c.municipio

                left join usuario u1 on u1.id = e.usuario1
                left join usuario u2 on u2.id = e.usuario2
                left join usuario u3 on u3.id = e.usuario3
                left join usuario u4 on u4.id = e.usuario4
             WHERE  (e.fecha between ${pool.escape(fecha1)} and  ${pool.escape(fecha2)}) and c.id = ${pool.escape(comunidad)} order by cs.cv asc`;
        const [rows] = await pool.query(sql)

        console.log(rows)
        return rows
    }

    listarUsuarios = async (usuario, municipio) => {
        const sql =
            `SELECT id as value, if(ap2,concat(nombre, ' ', ap1,' ',ap2) , concat(nombre, ' ', ap1) ) as label FROM usuario 
            where rol = 2 and municipio = ${pool.escape(municipio)}`
        const [rows] = await pool.query(sql)

        const sql1 =
            `SELECT id as value, if(ap2,concat(nombre, ' ', ap1,' ',ap2) , concat(nombre, ' ', ap1) ) as label FROM usuario 
            where rol = 3 and id!=${pool.escape(usuario)}`
        const [rows1] = await pool.query(sql1)
        return [rows, rows1]
    }

    listarMunicipios = async () => {
        const sql =
            `SELECT  id as value, nombre as label FROM municipio`
        const [rows] = await pool.query(sql)
        return rows
    }

    listarComunidad = async (municipio) => {
        const sql =
            `SELECT  id as value, nombre as label FROM comunidad where municipio = ${pool.escape(municipio)}`
        const [rows] = await pool.query(sql)
        return rows
    }

    listarCasas = async (comunidad) => {
        const sql =
            `SELECT id as value, concat(jefefamilia,' - cv: ',cv, ', Hab: ', num_hab) as label FROM casa where comunidad = ${pool.escape(comunidad)} order by cv asc`
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

        const sqlExists =
            `SELECT * FROM ee1  WHERE casa = ${pool.escape(datos.casa)} and  comunidad = ${pool.escape(datos.comunidad)} and (estado = 0) `;
        const [result] = await pool.query(sqlExists)
        if (result.length === 0) {

            const [result_save] = await pool.query("INSERT INTO ee1 SET  ?", datos)
            if (result_save.insertId > 0) {
                const sql_ = `UPDATE casa SET ejemplares = ${pool.escape(datos.ecin + datos.ecia + datos.ecpn + datos.ecpa)} WHERE id = ${pool.escape(datos.casa)}`
                pool.query(sql_)
                return true
            } else return false
        } else return -2

    }



    actualizar = async (datos) => {

        // console.log(datos)

        const sqlExists =
            `SELECT * FROM ee1  WHERE casa = ${pool.escape(datos.casa)}  and estado = 0 and comunidad = ${pool.escape(datos.comunidad)} and id != ${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)
        // console.log(result, sqlExists) 
        if (result.length === 0) {

            const sqlExists =
                `SELECT * FROM ee1  WHERE casa = ${pool.escape(datos.casa)} and comunidad = ${pool.escape(datos.comunidad)} and estado = 0 and id !=  ${pool.escape(datos.id)}`;
            const [result] = await pool.query(sqlExists)
            if (result.length === 0) {

                const sql_ = `UPDATE ee1 SET
                       fecha  = ${pool.escape(datos.fecha)},
                       casa  = ${pool.escape(datos.casa)},
                       inicio  = ${pool.escape(datos.inicio)},
                       final = ${pool.escape(datos.final)},
                       ecin = ${pool.escape(datos.ecin)},
                       ecia  = ${pool.escape(datos.ecia)},
                       ecpn = ${pool.escape(datos.ecpn)},
                       ecpa = ${pool.escape(datos.ecpa)},
                       lcipd  = ${pool.escape(datos.lcipd)},
                       lcicm = ${pool.escape(datos.lcicm)},
                       lcith = ${pool.escape(datos.lcith)},
                       lciot = ${pool.escape(datos.lciot)},
                       lcppd = ${pool.escape(datos.lcppd)},
                       lcpga= ${pool.escape(datos.lcpga)},
                       lcpcl = ${pool.escape(datos.lcpcl)},
                       lcpcj = ${pool.escape(datos.lcpcj)},
                       lcpz = ${pool.escape(datos.lcpz)},
                       lcpot = ${pool.escape(datos.lcpot)},
                       negativa = ${pool.escape(datos.negativa)},
                       cerrada = ${pool.escape(datos.cerrada)},
                       renuente = ${pool.escape(datos.renuente)},
                       modified_at  = ${pool.escape(datos.fecha)},
                       user_modified = ${pool.escape(datos.user)},
                       author = ${pool.escape(datos.author)}
                       WHERE id = ${pool.escape(datos.id)} and estado = 0`;
                const result = await pool.query(sql_);

                if (result[0].affectedRows > 0) {
                    const sql_ = `UPDATE casa SET ejemplares = ${pool.escape(datos.ecin + datos.ecia + datos.ecpn + datos.ecpa)} WHERE id = ${pool.escape(datos.casa)}`
                    pool.query(sql_)
                    return true
                } else return false
            } else return -2
        } else return -1
    }



    eliminar = async (id, user, username, fecha) => {

        const sql_recover = `select * from ee1
        WHERE id = ${pool.escape(id)} `;
        const [result_recover] = await pool.query(sql_recover);

        const sql_ = `delete from ee1
                        WHERE id = ${pool.escape(id)} and estado = 0`;
        const result = await pool.query(sql_);


        if (result[0].affectedRows > 0) {
            pool.query('insert into delete_data set ?', {
                table_affected: 'ee1', content: JSON.stringify(result_recover), id_user_action: user, name_user_action: username,
                action_at: fecha
            })
            const sql_ = `UPDATE casa SET ejemplares = 0 WHERE id = ${pool.escape(result_recover[0].casa)}`
            pool.query(sql_)
            return true
        } else return false

    }

    // la validacion dela informacion se lo realizará solo si el tecnico haya completado con toda la actividad visitando a todas las viviendas de la comunidad
    validar = async (fecha, usuario, comunidad, datos) => {

        const sqlCasas = `select * from casa where comunidad = ${pool.escape(comunidad)}`
        const sqlEE1 = `select * from ee1 where estado = 0 and comunidad = ${pool.escape(comunidad)}`

        const [casas] = await pool.query(sqlCasas)
        const [ee1] = await pool.query(sqlEE1)


        // console.log(casas.length, ee1.length)

        if (casas.length != ee1.length) { // colo sera permitido validar informacion cuando se haya completado con todas las viviendas de la comunidad
            return -1
        }


        // calculo de la cobertura de la actividad, debe ser mayor al 70%
        let c = 0
        for (let e of ee1) {
            if (e.estado > 0)
                if (!e.cerrada && !e.renuente)
                    c++
        }


        if (((c * 100) / ee1.length < 70)) {
            return -2
        }

        let codigo = 'C-' + comunidad + '' + fecha.split('-')[0] + '' + fecha.split('-')[1] + fecha.split('-')[2].split(' ')[0] + '-' +
            fecha.split('-')[2].split(' ')[1].split(':')[0] + ' ' + fecha.split('-')[2].split(' ')[1].split(':')[2] + '' + fecha.split('-')[2].split(' ')[1].split(':')[2]




        const sql_ = `update ee1 set estado = 1, 
                        fecha_remision = ${pool.escape(fecha)},
                        num_viviendas_actual = ${pool.escape(casas.length)},
                        codigo = ${pool.escape(codigo)}, 
                        prerociado = ${pool.escape(datos.prerociado)} ,
                        jefeBrigada = ${pool.escape(datos.jefeBrigada)} ,
                        usuario = ${pool.escape(usuario)} ,
                        usuario1 = ${pool.escape(datos.usuario1)} ,
                        usuario2 = ${pool.escape(datos.usuario2)} ,
                        usuario3 = ${pool.escape(datos.usuario3)} ,
                        usuario4 = ${pool.escape(datos.usuario4)} , 
                        estado = 1,
                        observaciones = ${pool.escape(datos.observaciones)} 
                        WHERE estado = 0 and comunidad = ${pool.escape(comunidad)}`;
        const result = await pool.query(sql_);
        if (result[0].affectedRows > 0) {
            const sql_ = `update comunidad set num_viviendas_actual = ${pool.escape(casas.length)}
                        WHERE id = ${pool.escape(comunidad)}`;
            await pool.query(sql_);


            let num_casas = casas[0].num_viviendas_actual ? casas[0].num_viviendas_actual : casas.length
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
                where e.codigo = ${pool.escape(codigo)}
                group by e.codigo`)

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
            await pool.query(`update casa set riesgo = ${pool.escape(total)} where comunidad = ${pool.escape(comunidad)}`)
            return true
        } else return false

    }

}
