
const pool = require('../bdConfig.js')

module.exports = class Comunidad {


    listar = async () => {
        const sql =
            `SELECT c.id, c.nombre,c.codigo, m.nombre as municipio,h.nombre as hospital, h.id as idhospital,
             m.id as idmunicipio,r.nombre as red, c.estado, DATE_FORMAT(c.creating, "%Y/%m/%d") as creacion
                FROM comunidad c
                inner join hospital h on h.id = c.est
                inner join municipio m on m.id = c.municipio
                inner join red r on r.id = m.red order by c.nombre asc`;

        const [rows] = await pool.query(sql)
        return rows
    }


    buscar = async (dato) => {
        const sql =
            `SELECT c.id, c.nombre, c.codigo, m.nombre as municipio,h.nombre as hospital,h.id as idhospital,
             m.id as idmunicipio,r.nombre as red, c.estado, DATE_FORMAT(c.creating, "%Y/%m/%d") as creacion
                FROM comunidad c
                inner join hospital h on h.id = c.est
                inner join municipio m on m.id = c.municipio
               inner join red r on r.id = m.red
            where c.nombre like '${dato}%' or m.nombre like '${dato}%'`;
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
                where municipio = ${pool.escape(id)}
                
            `
        const [rows] = await pool.query(sql)
        return rows
    }


    insertar = async (datos) => {

        const sqlExists = `SELECT * FROM comunidad WHERE nombre = ${pool.escape(datos.nombre)}`;
        const [result] = await pool.query(sqlExists)


        if (result.length === 0) {

            const sqlExistsCodigo = `SELECT * FROM comunidad WHERE codigo = ${pool.escape(datos.codigo)}`;
            const [resultCodigo] = await pool.query(sqlExistsCodigo)

            if (resultCodigo.length === 0) {
                const [result] = await pool.query("INSERT INTO comunidad SET  ?", datos)
                if (result.insertId > 0) {
                    return true
                } else return false


            } else return -2
        } else return -1

    }



    actualizar = async (datos) => {
        const sqlExists =
            `SELECT * FROM comunidad WHERE nombre = ${pool.escape(datos.nombre)} and id !=${pool.escape(datos.id)}`;
        const [result] = await pool.query(sqlExists)

        if (result.length === 0) {

            const sqlExistsCodigo = `SELECT * FROM comunidad WHERE codigo = ${pool.escape(datos.codigo)} and id !=${pool.escape(datos.id)}`;
            const [resultCodigo] = await pool.query(sqlExistsCodigo)
            if (resultCodigo.length === 0) {

                const sql_ = `UPDATE comunidad SET
                        nombre = ${pool.escape(datos.nombre)},
                        codigo = ${pool.escape(datos.codigo)},
                        municipio = ${pool.escape(datos.municipio)},
                        est = ${pool.escape(datos.hospital)},
                        modified = ${pool.escape(datos.modified)},
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

        const sql_ = `delete from comunidad
                        WHERE id = ${pool.escape(id)}`;
        const result = await pool.query(sql_);
        if (result[0].affectedRows > 0) {
            return true
        } else return false

    }

}
