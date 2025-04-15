  
const pool = require('../bdConfig.js')

module.exports = class Habitantes {


    listar = async () => {
        const sql =
            `SELECT cs.id, cs.latitud, cs.longitud, cs.altitud, cs.vm_intra, cs.vm_peri, cs.num_hab, cs.cv,  
            c.id as idcomunidad, c.nombre as comunidad, m.nombre as municipio, h.nombre as hospital, h.id as idhospital,
             m.id as idmunicipio, DATE_FORMAT(c.creating, "%Y/%m/%d") as creacion
                FROM casa cs
                inner join comunidad c on c.id = cs.comunidad
                inner join hospital h on h.id = c.est
                inner join municipio m on m.id = h.municipio
                order by c.nombre asc`;

        const [rows] = await pool.query(sql)
        return rows
    }


    buscar = async (dato) => {
        const sql =
            `SELECT cs.id, cs.latitud, cs.longitud, cs.altitud, cs.vm_intra, cs.vm_peri, cs.num_hab, cs.cv,  
            c.id as idcomunidad, c.nombre as comunidad, m.nombre as municipio, h.nombre as hospital, h.id as idhospital,
             m.id as idmunicipio, DATE_FORMAT(c.creating, "%Y/%m/%d") as creacion
                FROM casa cs
                inner join comunidad c on c.id = cs.comunidad
                inner join hospital h on h.id = c.est
                inner join municipio m on m.id = h.municipio
            where c.id =${pool.escape(dato)}`;
        const [rows] = await pool.query(sql)
        return rows
    }
    listarMunicipio = async () => {
        const sql =
            `SELECT id, nombre as label FROM municipio`
        const [rows] = await pool.query(sql)
        return rows
    }
    listarEst = async (id) => {
        const sql =
            `SELECT id, nombre as label FROM hospital
            where municipio = ${pool.escape(id)}`
        const [rows] = await pool.query(sql)
        return rows
    }

    listarComunidad = async (id) => {
        console.log(id)
        const sql =
            `SELECT id, nombre as label FROM comunidad where municipio = ${pool.escape(id)}`
        const [rows] = await pool.query(sql)
        return rows
    }


    insertar = async (datos) => {

        const sqlExists =
            `SELECT * FROM casa WHERE latitud = ${pool.escape(datos.latitud)} and longitud = ${pool.escape(datos.longitud)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sqlExists =
                `SELECT * FROM casa WHERE  cv = ${pool.escape(datos.cv)}`;
            const [result] = await pool.query(sqlExists)

            if (result.length === 0) {
                const [result] = await pool.query("INSERT INTO casa SET  ?", datos)
                if (result.insertId > 0) {
                    return true
                } else return false
            } else return -2

        } else return -1

    }



    actualizar = async (datos) => {
        console.log(datos)
        const sqlExists =
            `SELECT * FROM casa WHERE  cv = ${pool.escape(datos.cv)} and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sql_ = `UPDATE casa SET
                        comunidad = ${pool.escape(datos.comunidad)},
                        vm_intra = ${pool.escape(datos.num_intra)},
                        vm_peri = ${pool.escape(datos.num_peri)},
                        num_hab = ${pool.escape(datos.num_hab)},
                        cv = ${pool.escape(datos.cv)},
                        modified = ${pool.escape(datos.modified)},
                        user_modified = ${pool.escape(datos.user_modified)}
                        WHERE id = ${pool.escape(datos.id)}`;
            const result = await pool.query(sql_);

            if (result[0].affectedRows > 0) {
                return true
            } else return false
        } else return -1
    }


    actualizarCoordenadas = async (datos) => {
        console.log(datos)

        const sqlExists =
            `SELECT * FROM casa WHERE latitud = ${pool.escape(datos.latitud)} and longitud = ${pool.escape(datos.longitud)} and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sql_ = `UPDATE casa SET
                        latitud = ${pool.escape(datos.latitud)},
                        longitud = ${pool.escape(datos.longitud)},
                        altitud = ${pool.escape(datos.altitud)},
                        modified = ${pool.escape(datos.modified)},
                        user_modified = ${pool.escape(datos.user_modified)}
                        WHERE id = ${pool.escape(datos.id)}`;
            const result = await pool.query(sql_);

            if (result[0].affectedRows > 0) {
                return true
            } else return false
        } else return -1
    }


    eliminar = async (id) => {

        const sql_ = `delete from casa
                        WHERE id = ${pool.escape(id)}`;
        const result = await pool.query(sql_);
        if (result[0].affectedRows > 0) {
            return true
        } else return false

    }

}
