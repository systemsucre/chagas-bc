
const pool = require('../bdConfig.js')

module.exports = class Ube {

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
            `SELECT id as value, concat( jefefamilia, ' - cv: ', cv, ', Hab: ', num_hab) as label FROM casa where comunidad = ${pool.escape(comunidad)}`
        const [rows] = await pool.query(sql)
        return rows
    }

    listarDatosEE1 = async (casa) => {
        const sqlData = 
            `SELECT  * 
            FROM ee1
            where casa = ${pool.escape(casa)} and laboratorio = false`;
        const [rowsData] = await pool.query(sqlData)
        return rowsData
    }
    listarUsuarios = async () => {
        const sql =
            `SELECT id as value, if(ap2,concat(nombre, ' ', ap1,' ',ap2) , concat(nombre, ' ', ap1) ) as label FROM usuario 
            where rol = 3 `
        const [rows] = await pool.query(sql)

        return rows
    }

    listar = async (comunidad) => {
        const sql =
            `SELECT u.id,  c.id as casa,   concat( c.jefefamilia, ' - cv: ', c.cv, ', Hab: ', c.num_hab) as detalleCasa, c.jefefamilia, c.cv, u.corresponde, u.lci, u.lcp, u.ti, u.ts, u.tg, u.pm, u.otros, u.num_envase, u.vivos, u.muertos, (u.vivos+u.muertos) as total, u.num_adultos, u.num_ninfas, DATE_FORMAT(u.fecha_recepcion, '%Y-%m-%d') AS fecha, u.estado, u.codigo, u.corresponde, u.author
                FROM  ube u
                inner join casa c on c.id = u.casa
                inner join comunidad cm on cm.id = c.comunidad
                where cm.id = ${pool.escape(comunidad)} and u.estado = 0
                order by c.cv asc`;
        const [rows] = await pool.query(sql)

        const sqlOtros =
            `SELECT   c.nombre as comunidad, m.nombre as municipio, h.nombre as    hospital, r.nombre as red
                FROM comunidad c
                inner join hospital h on h.id = c.est
                inner join municipio m on m.id = c.municipio
                inner join red r on r.id = m.red
                where c.id = ${pool.escape(comunidad)}`
        const [rowsOtros] = await pool.query(sqlOtros)


        console.log(comunidad, rowsOtros)
        return [rows, rowsOtros]
    }


    buscar = async ({ comunidad, fecha1, fecha2 }) => {

        let rows = null

        if (fecha1 && fecha2) {
            const sql =
                `SELECT u.id, c.id as casa,  concat( c.jefefamilia, ' - cv: ', c.cv, ', Hab: ', c.num_hab) as detalleCasa, c.jefefamilia, c.cv, u.corresponde, u.lci, u.lcp, u.ti, u.ts, u.tg, u.pm, u.otros, u.num_envase, u.vivos, u.muertos, (u.vivos+u.muertos) as total, u.num_adultos, u.num_ninfas, DATE_FORMAT(u.fecha_recepcion, '%Y-%m-%d') AS fecha, u.estado, u.codigo, u.corresponde, u.author,
                concat(u1.nombre,' ', u1.ap1) as laboratorista, concat(u2.nombre,' ', u2.ap1) as tecnico

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where  cm.id = ${pool.escape(comunidad)} and (u.fecha_recepcion between ${pool.escape(fecha1)} and ${pool.escape(fecha2)})
                    order by c.cv asc`;
            [rows] = await pool.query(sql)

        } else {
            const sql =
                `SELECT u.id, c.id as casa,  concat( c.jefefamilia, ' - cv: ', c.cv, ', Hab: ', c.num_hab) as detalleCasa, c.jefefamilia, c.cv, u.corresponde, u.lci, u.lcp, u.ti, u.ts, u.tg, u.pm, u.otros, u.num_envase, u.vivos, u.muertos, (u.vivos+u.muertos) as total, u.num_adultos, u.num_ninfas, DATE_FORMAT(u.fecha_recepcion, '%Y-%m-%d') AS fecha, u.estado, u.codigo, u.corresponde, u.author,
                concat(u1.nombre,' ', u1.ap1) as laboratorista, concat(u2.nombre,' ', u2.ap1) as tecnico
                
                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where  cm.id = ${pool.escape(comunidad)}
                    order by c.cv asc`;
            [rows] = await pool.query(sql)

        }

        const sqlOtros =
            `SELECT   c.nombre as comunidad, m.nombre as municipio, h. nombre as hospital, r.nombre as red
                            FROM comunidad c
                            inner join hospital h on h.id = c.est
                            inner join municipio m on m.id = c.municipio
                            inner join red r on r.id = m.red
                            where c.id = ${pool.escape(comunidad)}`
        const [rowsOtros] = await pool.query(sqlOtros)

        return [rows, rowsOtros]
    }



    insertar = async (datos) => {

        const dataEE1 = await this.listarDatosEE1(datos.casa)

        if (dataEE1.length > 0)
            if (dataEE1[0].laboratorio) {
                if (datos.lci !== (dataEE1[0].ecin + dataEE1[0].ecia)) {
                    return -1
                }

                if (datos.lcp !== (dataEE1[0].ecpn + dataEE1[0].ecpa)) {
                    return -1
                }
            }

        const sqlEstructura = `select m.id as municipio, cm.id as comunidad 
                                from casa c 
                                inner join comunidad cm on cm.id = c.comunidad 
                                inner join municipio m on m.id = cm.municipio 
                                where c.id = ${pool.escape(datos.casa)}`
        const [rowEstructura] = await pool.query(sqlEstructura)
        datos.comunidad = rowEstructura[0].comunidad
        datos.municipio = rowEstructura[0].municipio
        const [result] = await pool.query("INSERT INTO ube set  ?", datos)
        if (result.insertId > 0) {
            pool.query(`update ee1 set laboratorio = 1, ube = ${pool.escape(result.insertId)} where casa = ${datos.casa} and laboratorio = 0 `)
            return true
        } else return false
    }



    actualizar = async (datos) => {

        const dataEE1 = await this.listarDatosEE1(datos.casa)

        if (dataEE1.length > 0)
            if (dataEE1[0].laboratorio) {
                if (datos.lci !== (dataEE1[0].ecin + dataEE1[0].ecia)) {
                    return -1
                }

                if (datos.lcp !== (dataEE1[0].ecpn + dataEE1[0].ecpa)) {
                    return -1
                }
            }

        const sql_ = `UPDATE ube SET
                        lci = ${pool.escape(datos.lci)},
                        lcp = ${pool.escape(datos.lcp)},
                        ti  = ${pool.escape(datos.ti)},
                        ts = ${pool.escape(datos.ts)},
                        tg = ${pool.escape(datos.tg)},
                        pm = ${pool.escape(datos.pm)},
                        otros = ${pool.escape(datos.otros)},
                        num_envase= ${pool.escape(datos.num_envase)},
                        muertos = ${pool.escape(datos.muertos)},
                        vivos = ${pool.escape(datos.vivos)},
                        vivos = ${pool.escape(datos.num_adultos)},
                        num_ninfas = ${pool.escape(datos.num_ninfas)},
                        fecha_modified  = ${pool.escape(datos.fecha_modified)},
                        user_modified  = ${pool.escape(datos.user_modified)},
                        author = ${pool.escape(datos.author)}
                        WHERE id = ${pool.escape(datos.id)} and estado = 0`;
        const result = await pool.query(sql_);

        if (result[0].affectedRows > 0) {
            return true
        } else return false

    }



    eliminar = async (id) => {

        const sql_ = `delete from ube
                        WHERE id = ${pool.escape(id)} and estado = 0`;
        const result = await pool.query(sql_);


        // console.log(result[0].affectedRows)

        if (result[0].affectedRows > 0) {
            const sql_ = `update ee1 set laboratorio = null, ube = null
                WHERE   ube = ${pool.escape(id)}`;
            await pool.query(sql_);
            return true
        } else return false

    }

    validar = async (fecha, datos) => {


        let codigo = 'C-' + datos.comunidad + '' + fecha.split('-')[0] + '' + fecha.split('-')[1] + fecha.split('-')[2].split(' ')[0] + '-' +
            fecha.split('-')[2].split(' ')[1].split(':')[0] + ' ' + fecha.split('-')[2].split(' ')[1].split(':')[2] + '' + fecha.split('-')[2].split(' ')[1].split(':')[2]


        const sql_ = `update ube set estado = 1, 
                        corresponde= ${pool.escape(datos.corresponde)},
                        usuario_capturador = ${pool.escape(datos.tecnico)},
                        fecha_terminacion_registro = ${pool.escape(fecha)},
                        observaciones = ${pool.escape(datos.observaciones)},
                        codigo = ${pool.escape(codigo)} 
                        WHERE estado = 0 and comunidad = ${pool.escape(datos.comunidad)}`;
        const result = await pool.query(sql_);

        if (result[0].affectedRows > 0) {
            return true
        } else return false

    }

}
