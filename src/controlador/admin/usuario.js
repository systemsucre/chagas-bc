const { Router } = require("express");
const Usuario = require("../../modelo/admin/usuario.js");
const {
  buscar,
  insertar,
  actualizar,
  recet,
} = require("../../validacion/admin/usuario.js");


const rutas = Router();
const usuarios = new Usuario();

rutas.post("/listar", async (req, res) => {
  try {
    const resultado = await usuarios.listar(req.body.user);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

rutas.post("/buscar", buscar, async (req, res) => {
  // console.log(req.body)
  const dato = req.body.dato;
  const user = req.body.user;
  try {
    const resultado = await usuarios.buscar(dato, user);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});


rutas.post("/listar-rol-municipio", async (req, res) => {
  try {
    const resultado = await usuarios.listarRolMunicipio();
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/listar-hospital", async (req, res) => {
  try {
    const resultado = await usuarios.listarHospital(req.body.municipio);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});

rutas.post("/listar-comunidad", async (req, res) => {
  try {
    const resultado = await usuarios.listarComunidad(req.body.municipio);
    return res.json({ data: resultado, ok: true });
  } catch (error) {
    console.log(error);
    return res.json({ error: 500, msg: error.sqlMessage });
  }
});








rutas.post("/registrar", insertar, async (req, res) => {

  try {
    const {
      usuario, contraseña, rol, municipio, hospital, comunidad,              
      nombre, ap1, ap2,
      direccion, celular, correo, fecha_, user
    } = req.body;
    const datos = {
      usuario, contraseña, rol, municipio, hospital, comunidad,
      nombre, ap1, ap2,
      direccion, celular, correo, creating: fecha_, user_creating: user
    };

    const resultado = await usuarios.insertar(datos);
    if (resultado === true)
      return res.json({
        ok: true,
        msg: "El Usuario se ha registrado correctamente",
      });
    if (resultado === -2)
      return res.json({ ok: false, msg: "Este Correo ya esta registrado" });
    if (resultado === -1)
      return res.json({ ok: false, msg: "Este usuario ya esta registrado" });
    if (resultado === -3)
      return res.json({ ok: false, msg: "Debe seleccionar un hospital" });
    if (resultado === -4)
      return res.json({ ok: false, msg: "Debe seleccionar un municipio" });
    if (resultado === -5)
      return res.json({ ok: false, msg: "Debe seleccionar una comunidad" });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: error.sqlMessage });
  }
});

rutas.post("/actualizar", actualizar, async (req, res) => {

  try {
    const {
      id,
      usuario, contraseña, rol, municipio, hospital, comunidad,      nombre, ap1, ap2,
      direccion, celular, correo,
      fecha_, user, estado,
    } = req.body;
    const datos = {
      id,
      usuario, contraseña, rol, municipio, hospital, comunidad,
      nombre, ap1, ap2,
      direccion, celular, correo, modified: fecha_, user_modified: user, estado
    };
    const resultado = await usuarios.actualizar(datos);
    // console.log(resultado)
    if (resultado === -3)
      return res.json({ ok: false, msg: "Debe seleccionar un hospital" });
    if (resultado === -4)
      return res.json({ ok: false, msg: "Debe seleccionar un municipio" });
    if (resultado === -2)
      return res.json({ ok: false, msg: "Falló al modificar el registro!" });
    if (resultado === -5)
      return res.json({ ok: false, msg: "Debe seleccionar una comunidad" });
    if (resultado)
      return res.json({
        ok: true,
        msg: "Registro actualizado correctamente",
      });
    if (!resultado)
      return res.json({
        ok: false,
        msg: "El registro no se ha actualizado",
      });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: error.sqlMessage });
  }
});

rutas.post("/recet", recet, async (req, res) => {
  console.log(req.body)
  try {
    const { id, otros, fecha_, user } = req.body;
    const datos = {
      id,
      otros,
      fecha_,
      user,
    };
    const resultado = await usuarios.recet(datos);
    if (resultado)
      return res.json({
        ok: true,
        msg: "Contraseña se ha reiciado correctamete",
      });
    else
      return res.json({ ok: false, msg: "Contraseña no se ha actualizado!" });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, msg: error.sqlMessage });
  }
});

rutas.post("/eliminar", async (req, res) => {
  try {
    const id = req.body.id;
    const resultado = await usuarios.eliminar(id)
    if (!resultado) {
      return res.json({ msg: 'Ops! No se ha eliminado el registro.', ok: false })
    }
    return res.json({ ok: true, msg: 'Registro eliminado correctamete' })

  } catch (error) {
    console.log(error)
    return res.json({ ok: false, msg: error.sqlMessage + '. Puede existir valores dependientes a este registro. COnsulte con el administrador' });
  }
})

module.exports = rutas;
