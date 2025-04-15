const pool = require("../bdConfig.js")

module.exports = class Paciente {
  // METODOS

  listar = async (hospital) => {
    const sql = `SELECT p.id, p.ci, p.ap1, p.ap2 , p.nombre, p.ap1,p.ocupacion, p.ap2, DATE_FORMAT(p.fecha_nac, '%Y-%m-%d') as fecha,DATE_FORMAT(p.created, '%Y-%m-%d') as fecha_creacion, p.celular,   p.direccion,  p.sexo,
                  p.ant_per,p.ant_fam, p.otros, c.nombre as comunidad, c.id as id_comunidad, p.persona_referencia, p.celular_referencia, c.nombre as comunidad_nombre, p.user_created, p.id_hospital, p.hospital, p.usuario
                  from paciente p
                  left join comunidad c on c.id = p.comunidad
                  ORDER by id DESC LIMIT 20`;
    const [rows] = await pool.query(sql);

    const sqlComunidad = `SELECT c.id as value, concat(m.nombre, ' - ', c.nombre) as label from comunidad c 
                          inner join municipio m on m.id = c.municipio
                           ORDER by m.nombre asc, c.nombre asc`;
    const [rowsComunidad] = await pool.query(sqlComunidad);

    return [rows, rowsComunidad]
  };





  buscar = async (dato,) => {
    // console.log('los datos han llegado', dato)
    const sql = `SELECT p.id, p.ci, p.ap1, p.ap2 , p.nombre, p.ap1, p.ap2,p.ocupacion, DATE_FORMAT(p.fecha_nac, '%Y-%m-%d') as fecha,DATE_FORMAT(p.created, '%Y-%m-%d') as fecha_creacion, p.celular,   p.direccion,  p.sexo,
                  p.ant_per,p.ant_fam, p.otros, c.nombre as comunidad, c.id as id_comunidad, p.persona_referencia, p.celular_referencia, c.nombre as comunidad_nombre, p.user_created, p.id_hospital, p.hospital, p.usuario
                  from paciente p
                  left join comunidad c on c.id = p.comunidad 
                   
                  where (
                  p.nombre like '${dato}%' or
                  p.ci like '${dato}%' or
                  p.ap1  like '${dato}%' or
                  p.ap2  like '${dato}%'
                )
                  ORDER by p.nombre asc`;
    const [rows] = await pool.query(sql);
    return rows;
  };


  insertar = async (datos) => {
    const sqlCi = `SELECT ci from paciente where
                ci = ${pool.escape(datos.ci)} `;
    const [rows] = await pool.query(sqlCi);

    if (rows.length === 0) {
      const [resultado] = await pool.query("INSERT INTO paciente SET  ?", datos);
      if (resultado.insertId > 0)
        return true;

    } else return false;
  };




  actualizar = async (datos) => {
    const sqlexisteusername = `SELECT ci from paciente where
                ci = ${pool.escape(datos.nhc)} and id != ${pool.escape(datos.id)} `;
    const [rows] = await pool.query(sqlexisteusername);

    // console.log(datos)
    if (rows.length === 0) {
      const sql = `UPDATE paciente SET
                ci = ${pool.escape(datos.ci)},
                ap1 = ${pool.escape(datos.ap1)},
                ap2 = ${pool.escape(datos.ap2)},
                nombre = ${pool.escape(datos.nombre)},
                fecha_nac= ${pool.escape(datos.fecha_nac)},
                celular = ${pool.escape(datos.celular)},
                sexo = ${pool.escape(datos.sexo)},
                ocupacion = ${pool.escape(datos.ocupacion)},
                direccion = ${pool.escape(datos.direccion)},
                comunidad = ${pool.escape(datos.comunidad)},
                comunidad_nombre = ${pool.escape(datos.comunidad_nombre)},
                ant_per= ${pool.escape(datos.ant_per)},
                ant_fam= ${pool.escape(datos.ant_fam)},               
                otros= ${pool.escape(datos.otros)},
                persona_referencia = ${pool.escape(datos.persona_referencia)}, 
                celular_referencia = ${pool.escape(datos.celular_referencia)}, 
                modified = ${pool.escape(datos.modified)},
                user_created = ${pool.escape(datos.user)},
                usuario = ${pool.escape(datos.usuario)},
                id_hospital = ${pool.escape(datos.id_hospital)},
                hospital = ${pool.escape(datos.hospital)}
                WHERE id = ${pool.escape(datos.id)} and user_created = ${pool.escape(datos.user)} and id_hospital = ${pool.escape(datos.id_hospital)}`;

      const [fila] = await pool.query(sql);
      // console.log(datos,fila, 'filakkkk')

      if (fila.affectedRows > 0) {
        return true
      } else return false
    } else return { repeat: true };
  }

  eliminar = async (id, user, hospital) => {

    const sql = `delete from paciente 
                WHERE id = ${pool.escape(id)} and user_created = ${pool.escape(user)} and id_hospital = ${pool.escape(hospital)}`;
    const [fila] = await pool.query(sql);

    if (fila.affectedRows > 0) {
      return true
    } else return false
  }
}
