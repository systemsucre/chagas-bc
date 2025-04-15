const pool = require('../bdConfig.js')

module.exports = class Usuario {
  // METODOS





  // metodos admin
  listar = async (id) => {
    const sql = `SELECT 
            u.id, r.id as idrol, r.rol, u.usuario, u.nombre, u.ap1, u.ap2, u.correo, u.celular, u.direccion, u.estado, h.id as idhospital, h.nombre as hospital,  m.id as idmunicipio, m.nombre as municipio, c.id as idcomunidad, c.nombre as comunidad,
            DATE_FORMAT(u.creating, '%d/%m/%Y') as creating, DATE_FORMAT(u.modified, '%d/%m/%Y') as editing 
            from usuario u 
            INNER join rol r on r.id = u.rol
            LEFT join hospital h on h.id = u.hospital
            left join municipio m on m.id = u.municipio
            left join comunidad c on c.id = u.comunidad
            where u.id != ${pool.escape(id)}
            ORDER by u.id desc `;

    const [rows] = await pool.query(sql);
    return rows
  };

  buscar = async (dato, user) => {
    const sql = `SELECT 
            u.id, r.id as idrol, r.rol, u.usuario, u.nombre, u.ap1, u.ap2, u.correo, u.celular, u.direccion, u.estado, h.id as idhospital, h.nombre as hospital,  m.id as idmunicipio, m.nombre as municipio, c.id as idcomunidad, c.nombre as comunidad,
            DATE_FORMAT(u.creating, '%d/%m/%Y') as creating, DATE_FORMAT(u.modified, '%d/%m/%Y') as editing
            from usuario u 
            INNER join rol r on r.id = u.rol
            LEFT join hospital h on h.id = u.hospital
            left join municipio m on m.id = u.municipio
            left join comunidad c on c.id = u.comunidad
            where (
            u.usuario like '${dato}%' or
            u.nombre like '${dato}%' or
            u.ap1 like '${dato}%' or
            m.nombre like '${dato}%' or
            u.ap2 like '${dato}%') and u.id != ${pool.escape(user)}
            ORDER by u.id asc`;
    const [rows] = await pool.query(sql);
    return rows;
  };

  listarRolMunicipio = async () => {

    const sql1 = `SELECT id AS value, rol as label from rol `;
    const [rows1] = await pool.query(sql1);

    const sql2 = `SELECT id AS value, nombre as label from municipio `;
    const [rows2] = await pool.query(sql2);
    // console.log(rows, "oficinaaa ");
    return [rows1, rows2];
  };


  listarHospital = async (municipio) => {
    const sql = `SELECT id AS value, nombre as label from hospital  where estado = 1 and municipio = ${pool.escape(municipio)} order by nombre asc`;
    const [rows] = await pool.query(sql);

    return rows;
  };

  listarComunidad = async (municipio) => {
    const sql = `SELECT id AS value, nombre as label from comunidad  where estado = 1 and municipio = ${pool.escape(municipio)} order by nombre asc`;
    const [rows] = await pool.query(sql);

    return rows;
  };



  insertar = async (datos) => {

    if (datos.rol == 5 || datos.rol == 6) {
      if (!datos.hospital) {
        return -3;
      }
    }

    if (datos.rol == 2 || datos.rol == 3 || datos.rol == 4 || datos.rol == 40) {
      if (!datos.municipio) {
        return -4;
      }
    }

    if (datos.rol == 40) {
      if (!datos.comunidad) { // 40 es el rol de EVALUADOR
        return -5;
      }
    }

    const sqlexisteC = `SELECT correo from usuario where
                correo = ${pool.escape(datos.correo)} `;
    const [rowsCorreo] = await pool.query(sqlexisteC);

    if (rowsCorreo.length === 0) {
      const sqlci = `SELECT usuario from usuario where
                    usuario = ${pool.escape(datos.usuario)}`;
      const [rows] = await pool.query(sqlci);

      if (rows.length === 0) {

        const [rows] = await pool.query("INSERT INTO usuario SET  ?", datos);
        if (rows.insertId > 0) return true
        else return false
      } else return -1;
    } else return -2;
  };

  actualizar = async (datos) => {

    if (datos.rol == 5 || datos.rol == 6) {
      if (!datos.hospital) {
        return -3;
      }
    }

    if (datos.rol == 2 || datos.rol == 3 || datos.rol == 4 || datos.rol == 40) {
      if (!datos.municipio) {
        return -4;
      }
    }

    if (datos.rol == 40) {
      if (!datos.comunidad) { // 40 es el rol de EVALUADOR
        return -5;
      }
    }

    const sqlcorreo = `SELECT correo from usuario where
                correo = ${pool.escape(datos.correo)} and id != ${pool.escape(datos.id)}`;
    const [rowsCorreo] = await pool.query(sqlcorreo);

    if (rowsCorreo.length === 0) {

      const sql = `UPDATE usuario SET
                rol = ${pool.escape(datos.rol)},
                nombre = ${pool.escape(datos.nombre)},
                ap1 = ${pool.escape(datos.ap1)},
                ap2 = ${pool.escape(datos.ap2)},
                municipio = ${pool.escape(datos.municipio)},
                comunidad = ${pool.escape(datos.comunidad)},
                hospital = ${pool.escape(datos.hospital)},
                celular = ${pool.escape(datos.celular)},
                correo = ${pool.escape(datos.correo)},
                direccion = ${pool.escape(datos.direccion)},
                estado=${pool.escape(datos.estado)},
                modified = ${pool.escape(datos.modified)},
                user_modified = ${pool.escape(datos.user_modified)}
                WHERE id = ${pool.escape(datos.id)}`;

      const [res] = await pool.query(sql);

      if (res.affectedRows > 0) {
        const sesion = `delete from sesion where
          usuario = ${pool.escape(datos.id)}`;
        await pool.query(sesion);
        return true
      }
      else return false

    } else return -2;
  };


  recet = async (datos) => {
    const sql = `UPDATE usuario SET
                contraseña = ${pool.escape(datos.otros)},
                user_modified = ${pool.escape(datos.user)},
                modified = ${pool.escape(datos.fecha_)}
                WHERE id = ${pool.escape(datos.id)}`;
    const [res] = await pool.query(sql);
    if (res.affectedRows > 0) {
      const sesion = `delete from sesion where
                    usuario = ${pool.escape(datos.id)}`;
      await pool.query(sesion);
      return true;
    } else return false;
  };

  eliminar = async (id) => {

    const sql_ = `delete from usuario
                    WHERE id = ${pool.escape(id)}`;
    const result = await pool.query(sql_);
    if (result[0].affectedRows > 0) {
      const sesion = `delete from sesion where
      usuario = ${pool.escape(id)}`;
      await pool.query(sesion);
      return true
    } else return false

  }


  // metodos, gestionar mi perfil
  cambiarMiContraseña = async (datos) => {
    const sqlExists = `SELECT * FROM usuario WHERE 
            contraseña = ${pool.escape(datos.contraseña_actual)} 
            and id = ${pool.escape(datos.user)}`;
    const [result] = await pool.query(sqlExists);

    if (result.length > 0) {
      const sql = `UPDATE usuario SET
                contraseña = ${pool.escape(datos.nueva_contraseña)}, modified = ${pool.escape(datos.modified)}, user_modified = ${pool.escape(datos.user)}
                WHERE id = ${pool.escape(datos.user)}`;

      await pool.query(sql);
      return true;
    } else return false;
  };

  actualizarMiPerfil = async (datos) => {
    // console.log(datos)
    const sqlexisteCorreo = `SELECT correo from usuario where correo = ${pool.escape(datos.correo)} and id != ${pool.escape(datos.usuario)}`;
    const [result] = await pool.query(sqlexisteCorreo);
    if (result.length === 0) {
      const sql = `UPDATE usuario SET
            nombre = ${pool.escape(datos.nombre)},
            ap1 = ${pool.escape(datos.ap1)},
            ap2 = ${pool.escape(datos.ap2)},
            celular = ${pool.escape(datos.celular)},
            direccion = ${pool.escape(datos.direccion)},
            correo = ${pool.escape(datos.correo)},
            modified = ${pool.escape(datos.fecha_)},
            user_modified = ${pool.escape(datos.user)}
            WHERE id = ${pool.escape(datos.user)}`;
      await pool.query(sql);
      return await this.miPerfil(datos.usuario);
    } else return { existe: 1 };
  };

  miPerfil = async (id) => {
    let sqlUser = `select u.id, u.nombre, u.ap1, u.ap2 , u.usuario as username,  u.correo, u.direccion,
                            u.celular, 
                            r.rol as rol,

                            if(u.comunidad>0, c.nombre, '-') as comunidad,
                            if(u.municipio>0, m.nombre, m1.nombre) as municipio,

                            if(re.id>0, re.nombre, red.nombre) as red,

                            if(u.hospital>0, h.nombre, '-') as hospital

                            from usuario u
                            inner join rol r on r.id = u.rol
                            left join comunidad c on c.id = u.comunidad
                            left join municipio m on m.id = u.municipio
                            left join red on red.id = m.red

                            left join hospital h on h.id = u.hospital

                            left join municipio m1 on m1.id = h.municipio
                            left join red re on re.id = m1.red
                          
                            where u.id  = ${pool.escape(id)}`;

    const [result] = await pool.query(sqlUser);
    // console.log(result)

    return result;
  };
}
