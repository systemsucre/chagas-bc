
const pool = require('../bdConfig.js')

module.exports = class Laboratorio {

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

    listar = async (comunidad, codigo) => {
        const sql =
            `SELECT u.id,  c.id as casa,   concat( c.jefefamilia, ' - cv: ', c.cv, ', Hab: ', c.num_hab) as detalleCasa, c.jefefamilia, c.cv, u.corresponde, u.lci, u.lcp, u.ti, u.ts, u.tg, u.pm, u.otros, u.num_envase, u.vivos, u.muertos, (u.vivos+u.muertos) as total, u.num_adultos, u.num_ninfas,
                    
            u.ahneg, u.ahpos, u.amneg, u.ampos, u.n1neg, u.n1pos, u.n2neg, u.n2pos,u.n3neg, u.n3pos, u.n4neg, u.n4pos, u.n5neg, u.n5pos, 
            (u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg) as total_negativo, 
            (u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos) as total_positivo, 
            (u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos) as total_negativo_positivo, 
            
            DATE_FORMAT(u.fecha_recepcion, '%Y-%m-%d') AS fecha,  DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen, u.estado, u.codigo, u.corresponde, u.author
                FROM  ube u
                inner join casa c on c.id = u.casa
                where u.codigo = ${pool.escape(codigo)}
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
                `SELECT u.id, c.id as casa,  concat( c.jefefamilia, ' - cv: ', c.cv, ', Hab: ', c.num_hab) as detalleCasa, c.jefefamilia, c.cv, u.corresponde, u.lci, u.lcp, u.ti, u.ts, u.tg, u.pm, u.otros, u.num_envase, u.vivos, u.muertos, (u.vivos+u.muertos) as total, u.num_adultos, u.num_ninfas,

                u.ahneg, u.ahpos, u.amneg, u.ampos, u.n1neg, u.n1pos, u.n2neg, u.n2pos,u.n3neg, u.n3pos, u.n4neg, u.n4pos, u.n5neg, u.n5pos, 
                (u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg) as total_negativo, 
                (u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos) as total_positivo, 
                (u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos) as total_negativo_positivo, 
                
                
                DATE_FORMAT(u.fecha_recepcion, '%Y-%m-%d') AS fecha,   DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen, u.estado, u.estado, u.codigo, u.corresponde,
                concat(u1.nombre,' ', u1.ap1) as laboratorista, concat(u2.nombre,' ', u2.ap1) as tecnico, u.author

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
                `SELECT u.id, c.id as casa,  concat( c.jefefamilia, ' - cv: ', c.cv, ', Hab: ', c.num_hab) as detalleCasa, c.jefefamilia, c.cv, u.corresponde, u.lci, u.lcp, u.ti, u.ts, u.tg, u.pm, u.otros, u.num_envase, u.vivos, u.muertos, (u.vivos+u.muertos) as total, u.num_adultos, u.num_ninfas, 
                
                
                u.ahneg, u.ahpos, u.amneg, u.ampos, u.n1neg, u.n1pos, u.n2neg, u.n2pos,u.n3neg, u.n3pos, u.n4neg, u.n4pos, u.n5neg, u.n5pos, 
                (u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg) as total_negativo, 
                (u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos) as total_positivo, 
               (u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos) as total_negativo_positivo, 
                
                DATE_FORMAT(u.fecha_recepcion, '%Y-%m-%d') AS fecha,   DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen, u.estado, u.estado, u.codigo, u.corresponde,
                concat(u1.nombre,' ', u1.ap1) as laboratorista, concat(u2.nombre,' ', u2.ap1) as tecnico, u.author
                
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



    actualizar = async (datos) => {

        const sql_ = `UPDATE ube SET
                        ahneg = ${pool.escape(datos.ahneg)},
                        ahpos = ${pool.escape(datos.ahpos)},
                        amneg  = ${pool.escape(datos.amneg)},
                        ampos = ${pool.escape(datos.ampos)},
                        n1neg = ${pool.escape(datos.n1neg)},
                        n1pos = ${pool.escape(datos.n1pos)},
                        n2pos = ${pool.escape(datos.n2pos)},
                        n3neg= ${pool.escape(datos.n3neg)},
                        n3pos = ${pool.escape(datos.n3pos)},
                        n4neg = ${pool.escape(datos.n4neg)},
                        n4pos = ${pool.escape(datos.n4pos)},
                        n5neg = ${pool.escape(datos.n5neg)},
                        n5pos = ${pool.escape(datos.n5pos)},
                        estado = 2,
                        fecha_examen  = ${pool.escape(datos.fecha_modified)},
                        laboratorista  = ${pool.escape(datos.user_modified)}
                        WHERE id = ${pool.escape(datos.id)} and estado = 1 and num_adultos = ${pool.escape(datos.ahneg+datos.ahpos+datos.amneg+datos.ampos)} 
                        and num_ninfas = ${pool.escape(datos.n1neg+ datos.n1pos  + datos.n2neg+ datos.n2pos+ datos.n3neg+ datos.n3pos+ datos.n4neg+ datos.n4pos+ datos.n5neg+ datos.n5pos )} `;
        const result = await pool.query(sql_);

        if (result[0].affectedRows > 0) {
            return true
        } else return false

    }



}
