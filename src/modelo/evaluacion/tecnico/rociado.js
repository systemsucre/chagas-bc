
const pool = require('../../bdConfig.js')

module.exports = class Rociado {


    listarGestion = async () => {
        const sql =
            `SELECT id as value, gestion as label FROM gestion where estado = 1 and eliminado = false ORDER BY id ASC `;
        const [rows] = await pool.query(sql)
        return rows
    }

    listarComunidad = async (municipio) => {
        const sql =
            `SELECT  id as value, nombre as label FROM comunidad where municipio = ${pool.escape(municipio)}`
        const [rows] = await pool.query(sql)
        return rows
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

    listarCasas = async (comunidad, mes) => {

        const sql =
            `SELECT  r.id as rociado,  cs.id as idcasa, cs.cv, cs.jefefamilia, if(r.id>0, 1, 0) as estado,cs.num_hab, r.mes,
            if((r.cerrada or r.renuente),null,  cs.habitantes) as habitantes, 
            if(r.cerrada, 'SI', 'NO') AS cerrada, 
            if(r.renuente, 'SI', 'NO') AS renuente, 
            r.cerrada as cerrada_n, r.renuente as renuente_n, 
            r.idr, r.idnr, r.corrales, r.gallineros, r.conejeras, r.zarzo, r.otros, r.numeroCargas, i.unidad,  r.dosis, r.lote, DATE_FORMAT(r.fecha_rociado,"%Y/%m/%d") AS fecha, 
            r.insecticida, r.ciclo, i.nombre as nombreInsecticida, ci.ciclo as nombreCiclo, r.observaciones, 
            r.selectivo, r.total, r.denuncia,
            r.author, , r.usuario

            FROM casa cs 
            left join rociado r on r.casa = cs.id  and r.id_mes = ${pool.escape(mes)} 
            left join insecticida i on i.id = r.insecticida
            left join clicor ci on ci.id = r.ciclo 
            where   cs.comunidad = ${pool.escape(comunidad)} 
            order by CAST(cs.cv AS INT) asc`;
        const [rows] = await pool.query(sql)
        // console.log(rows, comunidad, mes)
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

    insertar = async (datos, validaciones) => {

        const sqlCasas =
            `SELECT * FROM casa  WHERE id = ${pool.escape(datos.casa)}`;
        const [resultCasa] = await pool.query(sqlCasas)
        if (resultCasa[0].num_hab !== parseInt(datos.idr) + parseInt(datos.idnr)) {
            if (!datos.cerrada && !datos.renuente)
                return -4
        }


        const [mes] = await pool.query(`select num from mes where ${pool.escape(datos.id_mes)}`)
        const sqlEstructura = `select h.id as id_hospital, h.nombre as nombre_hospital, r.id as id_red, r.nombre as nombre_red

                from comunidad c
                inner join hospital h on h.id = c.est
                inner join municipio m on m.id = c.municipio
                inner join red r on r.id = m.red 

                where c.id = ${pool.escape(datos.comunidad)}`
        const [rowsEstructura] = await pool.query(sqlEstructura)

        datos.id_hospital = rowsEstructura[0].id_hospital
        datos.nombre_hospital = rowsEstructura[0].nombre_hospital
        datos.red = rowsEstructura[0].id_red
        datos.nombre_red = rowsEstructura[0].nombre_red
        datos.num_mes = mes[0].num

        const sqlDelet =
            `DELETE FROM rociado WHERE casa = ${pool.escape(datos.casa)} and id_mes = ${pool.escape(datos.id_mes)}`;
        await pool.query(sqlDelet)

        const [result1] = await pool.query("INSERT INTO rociado set  ?", datos)
        if (result1.insertId > 0) {

            const [last_ee1] = await pool.query(`select  max(num_mes) as num_mes from rociado where id_gestion =${pool.escape(datos.id_gestion)}`)

            if (last_ee1[0].num_mes >= mes[0].num) {

                const [rowsCasa] = await pool.query(`select count(id) as cantidad from casa where comunidad = ${pool.escape(datos.comunidad)}`)

                const [cantidad_eval_ee1] = await pool.query(`select  * from rociado where id_mes =${pool.escape(datos.id_mes)} and comunidad = ${pool.escape(datos.comunidad)}`)

                if (rowsCasa[0].cantidad == cantidad_eval_ee1.length) {

                    // console.log(rowsCasa[0].cantidad, '  ', cantidad_eval_ee1.length, ' ', datos.created_at,)

                    let fecha = datos.created_at

                    let codigo = 'C-' + datos.comunidad + '' + fecha.split('-')[0] + '' + fecha.split('-')[1] + fecha.split('-')[2].split(' ')[0] + '-' +
                        fecha.split('-')[2].split(' ')[1].split(':')[0] + ' ' + fecha.split('-')[2].split(' ')[1].split(':')[2] + '' + fecha.split('-')[2].split(' ')[1].split(':')[2]

                    const sql_ = `  update rociado set 
                        insecticida = ${pool.escape(validaciones.insecticida)},
                        dosis = ${pool.escape(validaciones.dosis)},
                        ciclo = ${pool.escape(validaciones.ciclo)},
                        lote = ${pool.escape(validaciones.lote)},
                        observaciones = ${pool.escape(validaciones.observaciones)},
                        codigo = ${pool.escape(codigo)} ,
                        selectivo = ${pool.escape(validaciones.selectivo)},
                        total = ${pool.escape(validaciones.total)},
                        denuncia = ${pool.escape(validaciones.denuncia)}
                       
                        WHERE comunidad = ${pool.escape(datos.comunidad)} and id_mes = ${pool.escape(datos.id_mes)}`;
                    await pool.query(sql_);




                    return true
                }
                return true
            }
            else return true


            return true
        } else return false

    }

    deleted = async (rociado, user, username, fecha) => {
        const [result_recover] = await pool.query(`select * from rociado WHERE id = ${pool.escape(rociado)}`);
        const sql = `delete from rociado where id = ${pool.escape(rociado)} and usuario = ${pool.escape(user)}`
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


}
