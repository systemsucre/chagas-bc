
const pool = require('../../bdConfig.js')

module.exports = class Rociado {


    listar = async (comunidad) => {
        const sql =
            `SELECT  r.id, cs.id as idcasa, cs.cv, cs.jefefamilia, 
                if((r.cerrada or r.renuente),null,  cs.habitantes) as habitantes, 
                if(r.cerrada, 'SI', 'NO') AS cerrada, 
                if(r.renuente, 'SI', 'NO') AS renuente, 
                r.cerrada as cerrada_n, r.renuente as renuente_n, 
                r.idr, r.idnr, r.corrales, r.gallineros, r.conejeras, r.zarzo, r.otros, r.numeroCargas, i.unidad,  r.dosis, r.lote, r.estado, DATE_FORMAT(r.fecha,"%Y/%m/%d") AS fecha, 
                r.insecticida, r.ciclo, i.nombre as nombreInsecticida, ci.ciclo as nombreCiclo, r.observaciones, u.id as idUsuarioBrigada, concat(u.nombre, ' ', u.ap1) as usuarioBrigada, 

                r.selectivo, r.total, r.denuncia,

                u1.id as  idUsuario1, concat(u1.nombre, ' ', u1.ap1) as usuario1, u2.id as  idUsuario2, concat(u2.nombre, ' ', u2.ap1) as usuario2,
                u3.id as  idUsuario3, concat(u3.nombre, ' ', u3.ap1) as usuario3, u4.id as  idUsuario4, concat(u4.nombre, ' ', u4.ap1) as usuario4, r.author

                FROM rociado r
                left join insecticida i on i.id = r.insecticida
                left join clicor ci on ci.id = r.ciclo 

                left join usuario u1 on u1.id = r.usuario1
                left join usuario u2 on u2.id = r.usuario2
                left join usuario u3 on u3.id = r.usuario3
                left join usuario u4 on u4.id = r.usuario4

                inner join casa cs on cs.id = r.casa
                left join usuario u on u.id = r.usuarioBrigada
                inner join comunidad c on c.id = cs.comunidad
                where   c.id = ${pool.escape(comunidad)} and r.estado = 0
                order by r.id  desc`;
        const [rows] = await pool.query(sql)
        console.log(comunidad, rows, 'parametros listar RR-1')
        return rows
    }


    buscar = async (fecha1, fecha2, usuario, comunidad) => {
        const sql =
            `SELECT  r.id, cs.id as idcasa, cs.cv, cs.jefefamilia, cs.habitantes, if(r.cerrada, 'SI', 'NO') AS cerrada, if(r.renuente, 'SI', 'NO') AS renuente, r.cerrada as cerrada_n, r.renuente as renuente_n, 
                r.idr, r.idnr, r.corrales, r.gallineros, r.conejeras, r.zarzo, r.otros, r.numeroCargas, i.unidad, r.dosis, r.lote, r.estado, DATE_FORMAT(r.fecha,"%Y/%m/%d") AS fecha, 
                r.insecticida, r.ciclo, i.nombre as nombreInsecticida, ci.ciclo as nombreCiclo, r.observaciones, u.id as idUsuarioBrigada, concat(u.nombre, ' ', u.ap1) as usuarioBrigada, 

                r.selectivo, r.total, r.denuncia,

                u1.id as  idUsuario1, concat(u1.nombre, ' ', u1.ap1) as usuario1, u2.id as  idUsuario2, concat(u2.nombre, ' ', u2.ap1) as usuario2,
                u3.id as  idUsuario3, concat(u3.nombre, ' ', u3.ap1) as usuario3, u4.id as  idUsuario4, concat(u4.nombre, ' ', u4.ap1) as usuario4, r.author
                FROM rociado r
                inner join insecticida i on i.id = r.insecticida
                inner join clicor ci on ci.id = r.ciclo


                left join usuario u1 on u1.id = r.usuario1
                left join usuario u2 on u2.id = r.usuario2
                left join usuario u3 on u3.id = r.usuario3
                left join usuario u4 on u4.id = r.usuario4
                
                inner join usuario u on u.id = r.usuarioBrigada   
                inner join casa cs on cs.id = r.casa
                inner join comunidad c on c.id = cs.comunidad
             WHERE  (r.fecha between ${pool.escape(fecha1)} and ${pool.escape(fecha2)}) and c.id = ${pool.escape(comunidad)}  order by r.id  desc`;
        // console.log(fecha1, fecha2, usuario, comunidad, sql)

        const [rows] = await pool.query(sql)
        return rows
    }

    listarUsuarios = async (municipio, id) => {
        const sql =
            `SELECT id as value, if(ap2,concat(nombre, ' ', ap1,' ',ap2) , concat(nombre, ' ', ap1) ) as label FROM usuario 
            where rol = 2 and municipio = ${pool.escape(municipio)}`
        const [rows] = await pool.query(sql)
        const sql1 =
            `SELECT id as value , if(ap2,concat(nombre, ' ', ap1,' ',ap2) , concat(nombre, ' ', ap1) ) as label FROM usuario 
        where rol = 3 and id!=${pool.escape(id)}`
        const [rows1] = await pool.query(sql1)

        return [rows, rows1]

    }



    listarMunicipios = async () => {
        const sql =
            `SELECT  id as value, nombre as label FROM municipio`
        const [rows] = await pool.query(sql)
        return rows
    }
    listarCiclos = async () => {
        const sql =
            `SELECT  id as value , ciclo as label FROM clicor`
        const [rows] = await pool.query(sql)
        return rows
    }
    listarInsecticida = async () => {
        const sql =
            `SELECT  id as value, concat(nombre, ' ', unidad)  as label FROM insecticida`
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
            `SELECT id as value, concat( jefefamilia, ' - cv: ', cv, ', Hab: ', num_hab) as label FROM casa where comunidad = ${pool.escape(comunidad)}`
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


    insertar = async (datos, comunidad) => {
        const sqlCasas =
            `SELECT * FROM casa  WHERE id = ${pool.escape(datos.casa)}`;
        const [resultCasa] = await pool.query(sqlCasas)
        if (resultCasa[0].num_hab !== parseInt(datos.idr) + parseInt(datos.idnr)) {
            console.log(datos)
            if (!datos.cerrada && !datos.renuente)
                return -4
        }

        const sqlExists =
            `SELECT * FROM casa  WHERE id = ${pool.escape(datos.casa)} and comunidad = ${pool.escape(comunidad)} `;
        const [result] = await pool.query(sqlExists)
        if (result.length > 0) {

            const sqlExists =
                `SELECT * FROM rociado  WHERE casa = ${pool.escape(datos.casa)} and comunidad = ${pool.escape(datos.comunidad)} and (estado = 0 ) `;
            const [result] = await pool.query(sqlExists)
            // console.log(result, ' Daos del rociado')

            if (result.length === 0) {

                const [result1] = await pool.query("INSERT INTO rociado set  ?", datos)
                if (result1.insertId > 0) {
                    pool.query(` UPDATE casa set fecha_rociado = ${pool.escape(datos.fecha.split(' ')[0])} WHERE id = ${pool.escape(datos.casa)}`)
                    const sql_ = `UPDATE casa SET ejemplares = 0 WHERE id = ${pool.escape(datos.casa)}`
                    pool.query(sql_)
                    return true
                } else return false
            } else return -2
        } else return -1

    }



    actualizar = async (datos) => {


        const sqlCasas = `SELECT * FROM casa  WHERE id = ${pool.escape(datos.casa)}`;
        const [resultCasa] = await pool.query(sqlCasas)
        if (resultCasa[0].num_hab !== parseInt(datos.idr) + parseInt(datos.idnr)) {
            console.log(datos)
            if (!datos.cerrada && !datos.renuente)
                return -4
        }

        const sqlExists =
            `SELECT * FROM rociado  WHERE casa = ${pool.escape(datos.casa)} and estado =  0 and comunidad = ${pool.escape(datos.comunidad)} and id != ${pool.escape(datos.id)} `;
        const [result] = await pool.query(sqlExists)
        if (result.length === 0) {

            const sqlExists =
                `SELECT * FROM rociado  WHERE casa = ${pool.escape(datos.casa)} and comunidad = ${pool.escape(datos.comunidad)} and estado = 0 and id !=  ${pool.escape(datos.id)}`;
            const [result] = await pool.query(sqlExists)
            if (result.length === 0) {

                const sql_ = `UPDATE rociado SET
                        casa  = ${pool.escape(datos.casa)},
                        fecha = ${pool.escape(datos.fecha)},
                        idr = ${pool.escape(datos.idr)},
                        idnr = ${pool.escape(datos.idnr)},
                        corrales  = ${pool.escape(datos.corrales)},
                        gallineros = ${pool.escape(datos.gallineros)},
                        conejeras = ${pool.escape(datos.conejeras)},
                        zarzo = ${pool.escape(datos.zarzo)},
                        otros = ${pool.escape(datos.otros)},
                        cerrada= ${pool.escape(datos.cerrada)},
                        renuente = ${pool.escape(datos.renuente)},
                        numeroCargas = ${pool.escape(datos.numeroCargas)},
                        modified  = ${pool.escape(datos.fecha)},
                        user_modified  = ${pool.escape(datos.usuario)},
                        author = ${pool.escape(datos.author)}
                        WHERE id = ${pool.escape(datos.id)} and estado = 0`;
                const result = await pool.query(sql_);

                if (result[0].affectedRows > 0) {
                    pool.query(` UPDATE casa set fecha_rociado = ${pool.escape(datos.fecha.split(' ')[0])} WHERE id = ${pool.escape(datos.casa)}`)
                    const sql_ = `UPDATE casa SET ejemplares = 0 WHERE id = ${pool.escape(datos.casa)}`
                    pool.query(sql_)
                    return true
                } else return false
            } else return -2
        } else return -1
    }



    eliminar = async (id, user, username, fecha) => {

        const sql_recover = `select * from rociado
        WHERE id = ${pool.escape(id)} `;
        const [result_recover] = await pool.query(sql_recover);

        const sql_ = `delete from rociado
                        WHERE id = ${pool.escape(id)} and estado = 0`;
        const result = await pool.query(sql_);

        if (result[0].affectedRows > 0) {
            pool.query('insert into delete_data set ?', {
                table_affected: 'rociado', content: JSON.stringify(result_recover), id_user_action: user, name_user_action: username,
                action_at: fecha
            })
            pool.query(` UPDATE casa set fecha_rociado = null WHERE id = ${pool.escape(result_recover[0].casa)}`)
            
            return true
        } else return false

    }

    // la validacion dela informacion se lo realizará solo cuando ya haya completado con toda la actividad rociando a todas las viviendas de la comunidad

    validar = async (datos) => {

        let codigo = 'C-' + datos.comunidad + '' + datos.fecha.split('-')[0] + '' + datos.fecha.split('-')[1] + datos.fecha.split('-')[2].split(' ')[0] + '-' +
            datos.fecha.split('-')[2].split(' ')[1].split(':')[0] + ' ' + datos.fecha.split('-')[2].split(' ')[1].split(':')[2] + '' + datos.fecha.split('-')[2].split(' ')[1].split(':')[2]
        const sql_ = `  update rociado set 
                        estado = 1, 
                        insecticida = ${pool.escape(datos.insecticida)},
                        dosis = ${pool.escape(datos.dosis)},
                        ciclo = ${pool.escape(datos.ciclo)},
                        lote = ${pool.escape(datos.lote)},
                        observaciones = ${pool.escape(datos.observaciones)},
                        usuarioBrigada = ${pool.escape(datos.usuarioBrigada)},
                        fecha_remision = ${pool.escape(datos.fecha)} ,
                        codigo = ${pool.escape(codigo)} ,
                        selectivo = ${pool.escape(datos.selectivo)},
                        fecha_rociado = ${pool.escape(datos.fecha.split(' ')[0])},
                        total = ${pool.escape(datos.total)},
                        denuncia = ${pool.escape(datos.denuncia)},
                        usuario = ${pool.escape(datos.usuario)} ,
                        usuario1 = ${pool.escape(datos.usuario1)} ,
                        usuario2 = ${pool.escape(datos.usuario2)} ,
                        usuario3 = ${pool.escape(datos.usuario3)} ,
                        usuario4 = ${pool.escape(datos.usuario4)} 
                        WHERE  estado = 0 and comunidad = ${pool.escape(datos.comunidad)}`;
        const result = await pool.query(sql_);
        if (result[0].affectedRows > 0) {
            pool.query(` UPDATE casa set riesgo = 0 WHERE comunidad = ${pool.escape(datos.comunidad)}`)

            return true
        } else return false

    }

}
