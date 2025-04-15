
const pool = require('../../bdConfig.js')

module.exports = class Consolidado {

    listarMunicipios = async () => {
        let data = []
        data.push({ value: 2000, label: 'CONSOLIDADO' })
        const sql =
            `SELECT  id as value, nombre as label FROM municipio`
        const [rows] = await pool.query(sql)
        for (let r of rows) {
            data.push(r)
        }
        return data
    }

    buscar = async ({ municipio, corresponde, fecha1, fecha2 }) => {

        let rows = null


        if (municipio < 2000) {

            if (fecha1 && fecha2) {
                const sql =
                    `SELECT u.id, 
                    cm.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha,  DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where cm.municipio = ${pool.escape(municipio)} and  u.corresponde = ${pool.escape(corresponde)} and (u.fecha_recepcion between ${pool.escape(fecha1)} and ${pool.escape(fecha2)})   and u.estado = 2
                    group by  u.municipio
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)

            } else {
                const sql =
                    `SELECT u.id, 
                    cm.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha, DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where cm.municipio = ${pool.escape(municipio)} and  u.corresponde = ${pool.escape(corresponde)}  and u.estado = 2
                    group by u.municipio
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)

            }

            const sqlOtros =
                `SELECT   m.nombre as municipio,  r.nombre as red
                            FROM  municipio m
                            inner join red r on r.id = m.red
                            where m.id = ${pool.escape(municipio)}`
            const [rowsOtros] = await pool.query(sqlOtros)

            return [rows, rowsOtros]
        }

        else {

            if (fecha1 && fecha2) {
                const sql =
                    `SELECT u.id, 
                    m.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha,  DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join  municipio m on m.id = u.municipio
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where  u.corresponde = ${pool.escape(corresponde)} and (u.fecha_recepcion between ${pool.escape(fecha1)} and ${pool.escape(fecha2)})   and u.estado = 2
                    group by u.codigo
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)

            } else {
                const sql =
                    `SELECT u.id, 
                     m.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha, DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                   inner join  municipio m on m.id = u.municipio
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where   u.corresponde = ${pool.escape(corresponde)}  and u.estado = 2
                    group by u.codigo
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)
                // console.log(rows)

            }

            const sqlOtros =
                `SELECT   count(distinct r.id) as red,  count( m.id) as municipio
                    FROM  municipio m
                    inner join red r on r.id = m.red`
            const [rowsOtros] = await pool.query(sqlOtros)

            return [rows, rowsOtros]


        }

    }

    buscarBasico = async ({ municipio, corresponde, fecha1, fecha2 }) => {

        let rows = null


        if (municipio < 2000) {

            if (fecha1 && fecha2) {
                const sql =
                    `SELECT u.id, 
                    r.nombre as red,
                    m.nombre as municipio,
                    cm.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha_recepcion,  DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join municipio m on m.id = cm.municipio
                    inner join red r on r.id = m.red
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where cm.municipio = ${pool.escape(municipio)} and  u.corresponde = ${pool.escape(corresponde)} and (u.fecha_recepcion between ${pool.escape(fecha1)} and ${pool.escape(fecha2)})   and u.estado = 2
                    group by  u.municipio
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)

            } else {
                const sql =
                    `SELECT u.id, 
                    r.nombre as red,
                    m.nombre as municipio,
                    cm.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha_recepcion, DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join municipio m on m.id = cm.municipio
                    inner join red r on r.id = m.red
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where cm.municipio = ${pool.escape(municipio)} and  u.corresponde = ${pool.escape(corresponde)}  and u.estado = 2
                    group by u.municipio
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)

            }



            return rows
        }

        else {

            if (fecha1 && fecha2) {
                const sql =
                    `SELECT u.id, 
                    r.nombre as red,
                    m.nombre as municipio,
                    cm.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha_recepcion,  DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join  municipio m on m.id = cm.municipio
                    inner join red r on r.id = m.red
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where  u.corresponde = ${pool.escape(corresponde)} and (u.fecha_recepcion between ${pool.escape(fecha1)} and ${pool.escape(fecha2)})   and u.estado = 2
                    group by u.codigo
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)

            } else {
                const sql =
                    `SELECT u.id, 
                 r.nombre as red,
                    m.nombre as municipio,
                    cm.nombre as entidad,
                    sum(u.lci) as lci,
                    sum(u.lcp) as lcp, 
                    sum(u.ti) as ti, 
                    sum(u.ts) as ts, 
                    sum(u.tg) as tg, 
                    sum(u.pm) as pm, 
                    sum(u.otros) as otros, 
                    sum(u.vivos) as vivos,  
                    sum(u.muertos) as muertos, 
                    (sum(u.vivos) + sum(u.muertos)) as total, 
                    sum(u.num_adultos) as num_adultos, 
                    sum(u.num_ninfas) as num_ninfas,

                    sum(u.ahneg) as ahneg, 
                    sum(u.ahpos) as ahpos, 
                    sum(u.amneg) as amneg, 
                    sum(u.ampos) as ampos, 
                    sum(u.n1neg) as n1neg, 
                    sum(u.n1pos) as n1pos, 
                    sum(u.n2neg) as n2neg, 
                    sum(u.n2pos) as n2pos,
                    sum(u.n3neg) as n3neg, 
                    sum(u.n3pos) as n3pos, 
                    sum(u.n4neg) as n4neg, 
                    sum(u.n4pos) as n4pos, 
                    sum(u.n5neg) as n5neg, 
                    sum(u.n5pos) as n5pos, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg)) as total_negativo, 
                    sum((u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_positivo, 
                    sum((u.ahneg+u.amneg+u.n1neg+u.n2neg+u.n3neg+u.n4neg+u.n5neg+u.ahpos+ u.ampos+ u.n1pos+u.n2pos+u.n3pos+u.n4pos+u.n5pos)) as total_negativo_positivo, 
                    
                    
                    DATE_FORMAT(min(u.fecha_recepcion), '%Y-%m-%d') AS fecha_recepcion, DATE_FORMAT(u.fecha_examen, '%Y-%m-%d') AS fecha_examen,
                    u.codigo, 
                    concat(u1.nombre,' ', u1.ap1) as laboratorista, 
                    concat(u2.nombre,' ', u2.ap1) as tecnico,
                    u.observaciones, u.estado, u.corresponde, u.author

                    FROM  ube u
                    inner join casa c on c.id = u.casa
                    inner join comunidad cm on cm.id = c.comunidad
                    inner join  municipio m on m.id = cm.municipio
                    inner join red r on r.id = m.red
                    inner join usuario u1 on u1.id = u.usuario_recepcion 
                    left join usuario u2 on u2.id = u.usuario_capturador 
                    where   u.corresponde = ${pool.escape(corresponde)}  and u.estado = 2
                    group by u.codigo
                    order by u.fecha_recepcion asc`;
                [rows] = await pool.query(sql)
                // console.log(rows)

            }

            return rows


        }

    }


}
