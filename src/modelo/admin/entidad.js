
const pool = require('../bdConfig.js')

module.exports = class Entidad {


    listar = async () => {
        const sql =
            `SELECT h.id, h.nombre, m.nombre as municipio,h.laboratorio, h.codigo, m.id as idmunicipio, n.id as idnivel, n.nombre as nivel, r.nombre as red, h.estado,DATE_FORMAT(h.creating, "%Y/%m/%d") as creacion
                        FROM hospital h
            inner join municipio m on m.id = h.municipio
            inner join nivel n on n.id = h.nivel
            inner join red r on r.id = m.red order by h.nombre asc`;
        const [rows] = await pool.query(sql)
        return rows
    }


    buscar = async (dato) => {
        const sql =
            `SELECT h.id, h.nombre, m.nombre as municipio,h.codigo, h.laboratorio, m.id as idmunicipio,n.id as idnivel, n.nombre as nivel,r.nombre as red, h.estado,DATE_FORMAT(h.creating, "%Y/%m/%d") as creacion
                        FROM hospital h
            inner join municipio m on m.id = h.municipio
            inner join red r on r.id = m.red
             inner join nivel n on n.id = h.nivel
            where h.nombre like '${dato}%' or n.nombre like '${dato}%' or m.nombre like '${dato}%' order by h.nombre asc`;
        const [rows] = await pool.query(sql)
        return rows
    }
    listarMunicipio = async () => {
        const sql =
            `SELECT id, nombre as label FROM municipio order by red asc`
        const [rows] = await pool.query(sql)
        return rows
    }
    listarNiveles = async () => {
        const sql =
            `SELECT numero as id, nombre as label FROM nivel`
        const [rows] = await pool.query(sql)
        return rows
    }


    insertar = async (datos) => {

        const sqlExists = `SELECT * FROM hospital WHERE nombre = ${pool.escape(datos.nombre)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sqlExists = `SELECT * FROM hospital WHERE codigo = ${pool.escape(datos.codigo)}`;
            const [result] = await pool.query(sqlExists)
            if (result.length === 0) {
                const [result] = await pool.query("INSERT INTO hospital SET  ?", datos)
                if (result.insertId > 0) {
                    return true
                } else return false
            } else return -2

        } else return -1

    }



    actualizar = async (datos) => {
        const sqlExists =
            `SELECT * FROM hospital WHERE nombre = ${pool.escape(datos.nombre)} and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {
            const sqlExists = `SELECT * FROM hospital WHERE codigo = ${pool.escape(datos.codigo)} and id !=${pool.escape(datos.id)}`;
            const [result] = await pool.query(sqlExists)
            if (result.length === 0) {
                const sql_ = `UPDATE hospital SET
                        nombre = ${pool.escape(datos.nombre)},
                        municipio = ${pool.escape(datos.municipio)},
                        nivel = ${pool.escape(datos.nivel)},
                        modified = ${pool.escape(datos.modified)},
                        laboratorio = ${pool.escape(datos.laboratorio)},
                        codigo = ${pool.escape(datos.codigo)},
                        user_modified = ${pool.escape(datos.user_modified)},
                        estado = ${pool.escape(datos.estado)}
                        WHERE id = ${pool.escape(datos.id)}`;
                const result = await pool.query(sql_);

                if (result[0].affectedRows > 0) {
                    return true
                } else return false
            } else return -2
        } else return -1
    }

    eliminar = async (id) => {

        const sql_ = `delete from hospital
                        WHERE id = ${pool.escape(id)}`;
        const result = await pool.query(sql_);
        if (result[0].affectedRows > 0) {
            return true
        } else return false

    }

}
