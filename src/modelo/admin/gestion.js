
const pool = require('../bdConfig.js')

module.exports =  class Gestion {

    // METODOS

    listar = async () => {
        const sql =
            `SELECT g.id, g.gestion, g.estado FROM gestion g 
            where g.eliminado = false GROUP by g.id;`;
        const [rows] = await pool.query(sql)
     
        return rows
    } 


    activar = async (datos) => {
        const sql_ =
            `SELECT count(m.id) as meses, g.gestion FROM gestion g
            left join mes m on g.id = m.gestion
            where g.id = ${pool.escape(datos.id)}  GROUP by g.id;  `;
        const [rows_] = await pool.query(sql_)
        let gestion = rows_[0].gestion
        if (rows_[0].meses > 0) {
            const sql = `update gestion set estado = true, modificado = ${pool.escape(datos.modificado)}, usuario =${pool.escape(datos.usuario)}
                         WHERE id =  ${pool.escape(datos.id)}`;
            await pool.query(sql)
            return true
        } else {
            let meses = [
            {num:1, mes: 'ENERO', ini: gestion + '-01-01 19:08:38', fin: gestion + '-01-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:2, mes: 'FEBRERO', ini: gestion + '-02-01 19:08:38', fin: gestion + '-02-28 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:3, mes: 'MARZO', ini: gestion + '-03-01 19:08:38', fin: gestion + '-03-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:4, mes: 'ABRIL', ini: gestion + '-04-01 19:08:38', fin: gestion + '-04-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:5, mes: 'MAYO', ini: gestion + '-05-01 19:08:38', fin: gestion + '-05-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:6, mes: 'JUNIO', ini: gestion + '-06-01 19:08:38', fin: gestion + '-06-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:7, mes: 'JULIO', ini: gestion + '-07-01 19:08:38', fin: gestion + '-07-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:8, mes: 'AGOSTO', ini: gestion + '-08-01 19:08:38', fin: gestion + '-08-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:9, mes: 'SEPTIEMBRE', ini: gestion + '-09-01 19:08:38', fin: gestion + '-09-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:10, mes: 'OCTUBRE', ini: gestion + '-10-01 19:08:38', fin: gestion + '-10-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:11, mes: 'NOVIEMBRE', ini: gestion + '-11-01 19:08:38', fin: gestion + '-11-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id },
            {num:12, mes: 'DICIEMBRE', ini: gestion + '-12-01 19:08:38', fin: gestion + '-12-30 19:08:38', modificado: datos.modificado, usuario: datos.usuario, gestion: datos.id }]

            meses.forEach(async e=>{
                await pool.query("INSERT INTO mes SET  ?", e)
            })
            const sql = `update gestion set estado = true, modificado = ${pool.escape(datos.modificado)}, usuario =${pool.escape(datos.usuario)}
                         WHERE id =  ${pool.escape(datos.id)}`;
            await pool.query(sql)
            return true
        }
        
    }
    desactivar = async (datos) => {
        const sql = `update gestion set estado = false, modificado = ${pool.escape(datos.modificado)}, usuario =${pool.escape(datos.usuario)}
        WHERE id =  ${pool.escape(datos.id)}`;
        await pool.query(sql)
        return true
    }
}