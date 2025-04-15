
const pool = require('../bdConfig.js')

module.exports = class IEC {


    listar = async () => {
        const sql =
            `SELECT i.id,i.titulo,i.descripcion, c.nombre as categoria, DATE_FORMAT(i.create_at,"%Y/%m/%d") as fecha, i.views
            from item_iec i
            inner join categorias_iec c on c.id = i.id_categoria_iec
            where c.formato = 1
            ORDER by i.id DESC`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }
    buscar = async (dato) => {
        const sql =
            `SELECT i.id,i.titulo,i.descripcion, c.nombre as categoria, DATE_FORMAT(i.create_at,"%Y/%m/%d") as fecha, i.views
            from item_iec i
            inner join categorias_iec c on c.id = i.id_categoria_iec
            where c.formato = 1 and (i.id_categoria_iec = ${pool.escape(dato)} or i.titulo like '%${dato}%')
            ORDER by i.id DESC;`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        return rows
    }



    
    contarVisita = async (id) => {
        const sql = `UPDATE item_iec SET views = views + 1 WHERE id = ${pool.escape(id)}`;
        const rows = await pool.query(sql)
        if (rows[0].affectedRows > 0) {
            return true
        } else {
            return false
        }
    }



    guardar = async (datos) => {

        const [data] = await pool.query("INSERT INTO item_iec SET  ?", datos)
        if (data.insertId > 0) {
            return data.insertId
        } else {
            return false
        }
    }



    delete = async (id) => {
        // console.log(id, 'eliminar imagen')
        const result = await pool.query(`DELETE FROM item_iec where id = ${pool.escape(id)}`)
        console.log(result, 'result')
        if (result[0].affectedRows > 0) {
            return true
        } else {
            return false
        }
    }





    ////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////


    

    listarFolletos = async () => {
        const sql =
            `SELECT i.id,i.titulo,i.descripcion, c.nombre as categoria, DATE_FORMAT(i.create_at,"%Y/%m/%d") as fecha, i.views, s.nombre as subcategoria
            from item_iec i
            inner join categorias_iec c on c.id = i.id_categoria_iec
            INNER JOIN sub_categoria_iec s on s.id = i.id_sub_categoria_iec
            where c.formato = 2
            ORDER by i.id DESC`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        const [rows2] = await pool.query(`SELECT id, nombre as label FROM sub_categoria_iec`)
        return [rows, rows2]
    }


    buscarFolletos = async (dato) => {
        const sql =
            `SELECT i.id,i.titulo,i.descripcion, c.nombre as categoria, DATE_FORMAT(i.create_at,"%Y/%m/%d") as fecha, i.views, s.nombre as subcategoria, s.id as id_subcategoria
            from item_iec i
            inner join categorias_iec c on c.id = i.id_categoria_iec
            INNER JOIN sub_categoria_iec s on s.id = i.id_sub_categoria_iec
            where c.formato = 2 and s.id = ${pool.escape(dato)}
            ORDER by i.id DESC;`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        return rows
    }



    guardarFolleto = async (datos) => {

        const [data] = await pool.query("INSERT INTO item_iec SET  ?", datos)
        if (data.insertId > 0) {
            return data.insertId
        } else {
            return false
        }
    }















    ////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////


    

    listarVideos = async () => {
        const sql =
            `SELECT i.id,i.titulo,i.descripcion,i.direccion, c.nombre as categoria, DATE_FORMAT(i.create_at,"%Y/%m/%d") as fecha, i.views
            from item_iec i
            inner join categorias_iec c on c.id = i.id_categoria_iec
            where c.formato = 3
            ORDER by i.id DESC`;
        const [rows] = await pool.query(sql)
        // console.log(rows, 'lista')
        return rows
    }


    buscarVideos = async (dato) => {
        const sql =
            `SELECT i.id,i.titulo,i.descripcion,i.direccion, c.nombre as categoria, DATE_FORMAT(i.create_at,"%Y/%m/%d") as fecha, i.views
            from item_iec i
            inner join categorias_iec c on c.id = i.id_categoria_iec
           
            where c.formato = 3  and (i.titulo like '%${dato}%' or i.descripcion like '%${dato}%')
            ORDER by i.id DESC;`;
        // console.log(sql)
        const [rows] = await pool.query(sql)
        return rows
    }


    guardarVideos = async (datos) => {

        const [data] = await pool.query("INSERT INTO item_iec SET  ?", datos)
        if (data.insertId > 0) {
            return true
        } else {
            return false
        }
    }











}