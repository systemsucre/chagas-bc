const express = require("express")
const pool = require("../modelo/bdConfig.js")
const pool1 = require("../modelo/bdConfigAux.js")
const { KEY, CLAVEGMAIL } = require("../config.js")

const jwt = require("jsonwebtoken")

const { getTime, getDate } = require("util-tiempo")




const miPerfil = require("../controlador/miPerfil.js");

// Admiministrador

const casa = require("../controlador/admin/casa.js")
const comunidad = require("../controlador/admin/comunidad.js")
const entidad = require("../controlador/admin/entidad.js")
const usuario = require("../controlador/admin/usuario.js")
const gestion = require("../controlador/admin/gestion.js")
const mes = require("../controlador/admin/mes.js")

//TECNICO
const evaluacion1 = require("../controlador/evaluacion/tecnico/ee1.js")
const evaluacion_ee1_municipal = require("../controlador/evaluacion/tecnico/evaluador.ee1.municipal.js")
const rociado1 = require("../controlador/evaluacion/tecnico/rociado.js")

// JEFE DE BRIGADA
const EE2_Encargado = require("../controlador/evaluacion/encargado/ee-2.js")
const RR2_Rociado = require("../controlador/evaluacion/encargado/rociado.js")


//ESTADISTICA DEPARTAMENTAL
const estadisticaDepartamental = require("../controlador/evaluacion/estadistica/ee-2.js")
const estadisticaDepartamentalRR2 = require("../controlador/evaluacion/estadistica/rociado.js")
const estratificado = require("../controlador/estadistica/estratificado/estratificado.js")
const estadistica_ube_consolidado = require("../controlador/estadistica/ube/consolidado.js")

//COMPONENTE UBE
const recepcion = require("../controlador/ube/ube.js")
const Laboratorio = require("../controlador/ube/laboratorio.js")
const consolidado = require("../controlador/ube/consolidado.js")

// DIAGNOSTICO Y TRATAMIENTO 

const pacientes = require("../controlador/tratamiento/paciente.js")

// TRATAMIENTO
const tratamiento = require("../controlador/tratamiento/tratamiento/tratamiento.js")
const consultas = require("../controlador/tratamiento/tratamiento/consultas.js")
const diagnostico = require("../controlador/tratamiento/tratamiento/diagnostico.js")


const reportesTratamientoDepto = require("../controlador/tratamiento/reportes/reportes_tratamiento_dapto.js")


// laboratorio
const laboratorioDiagnostico = require("../controlador/tratamiento/laboratorio/laboratorio.js")
const reportesDiagnosticoDepto = require("../controlador/tratamiento/reportes/reportes_diagnostico_depto.js")

//IEC
const iec = require("../controlador/IEC/iec.js")


//PUBLICOS
const public = require("../controlador/Public/public.js")

//EVALUADOR
const evaluador = require("../controlador/evaluacion/evaluador/evaluador.ee1.js")


// import { createOrder, recivedWebhook } from "../controlador/controller/payment.controller.js";



const rutas = express();

// +*********************************************************** login****************************************

// ruta de autentidicacion
rutas.get("/", async (req, res) => {
  try {
    const sql = `SELECT 
          u.id, u.correo,u.celular,u.usuario,
          u.nombre,u.ap1, 
          
          h.id as hospital, h.nombre as hospital_des,
          m.id as municipio, m.nombre as municipio_des,
          r.id as red, r.nombre as red_des,
          UPPER(ro.rol) as rol_des, ro.id as rol, 

          mu.id as idmunicipio_tec, mu.nombre as municipio_tec, c.id as idcomunidad, c.nombre as comunidad_des

          from usuario u 
          left join comunidad c on c.id = u.comunidad
          left join municipio mu on mu.id = u.municipio
          left join hospital h on h.id = u.hospital
          left join municipio m on m.id = h.municipio
          left join red r on r.id = m.red
          left join rol ro on u.rol = ro.id
          where u.usuario = ${pool.escape(req.query.intel)} and u.contraseña = ${pool.escape(req.query.viva)} and u.estado = true`;
    const [result] = await pool.query(sql);
    // console.log(result, 'iniciio de sesion', req.query.intel, req.query.viva)
    if (result.length === 1) {
      const payload = {
        municipio: result[0].municipio_des,
        name: result[0].nombre + result[0].ap1,
        hospital: result[0].hospital_des,
        fecha: new Date(),
      };
      const token = jwt.sign(payload, KEY, {
        expiresIn: "7d",
      });

      let fecha = getDate({ timeZone: "America/La_Paz", })
      const datos = {
        usuario: result[0].id,
        usuario_des: result[0].usuario,
        rol: result[0].rol,
        rol_des: result[0].rol_des,

        nombre: result[0].nombre + ' ' + result[0].ap1,
        token,
        fecha: fecha.split('/')[2] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[0],
        hora: getTime({ timezone: "America/La_Paz" }),

        hospital: result[0].hospital,
        hospital_des: result[0].hospital_des,
        red: result[0].red,
        red_des: result[0].red_des,
        municipio: result[0].municipio,
        municipio_des: result[0].municipio_des,
        municipio_tec: result[0].municipio_tec,
        municipio_id_tec: result[0].idmunicipio_tec,
        id_comunidad: result[0].idcomunidad,
        comunidad: result[0].comunidad_des,// para el caso de evaluador


      };

      const [sesion] = await pool.query(`INSERT INTO sesion SET ?`, datos);
      // console.log('dentro del bloque', sesion)

      if (sesion.insertId > 0) {
        return res.json({
          token: token,
          username: result[0].usuario,
          nombre: result[0].nombre + ' ' + result[0].ap1,
          celular: result[0].celular,
          correo: result[0].correo,
          rol_des: result[0].rol_des,
          rol: result[0].rol,

          hospital_des: result[0].hospital_des,
          red_des: result[0].red_des,
          municipio_des: result[0].municipio_des,
          id_comunidad: result[0].idcomunidad,
          comunidad: result[0].comunidad_des,
          municipio_des: result[0].municipio_tec,
          id_: result[0].id,
          est_: result[0].hospital,
          ok: true,
          msg: "Acceso correcto",
        });
      } else {
        return res.json({ msg: "Intente nuevamente ", ok: false });
      }
    } else {
      return res.json({ msg: "Credenciales de acceso incorrectos ", ok: false });
    }
  } catch (error) {
    console.log(error);
    return res.json({ msg: "El servidor no responde !", ok: false });
  }
});

rutas.post("/logout", (req, res) => {
  try {
    // console.log(req.body);
    if (req.body.token) {
      const sql = `delete from sesion where token = ${pool.escape(
        req.body.token
      )} `;
      pool.query(sql);
    }
  } catch (error) { }
});



// rutas.get("/est", async (req, res) => {
//   try {

//     const sql = `select * from establecimiento`

//     const [rows] = await pool.query(sql)

//     for (let m of rows) {
//       await pool1.query('insert into ests  set ?', {  nombre: m.establecimiento, municipio_id: m.municipio, codigo: m.cod })
//     }

//     console.log(rows)

//     return res.json(rows)
//   } catch (error) {
//     console.log(error)
//   }
// });





//VERIFICACION DE LA SESION QUE ESTA ALMACENADA EN LA BD
const verificacion = express();

verificacion.use((req, res, next) => {
  try {

    let fecha = getDate({ timeZone: "America/La_Paz", })
    let formato = fecha.split('/')[2] + '-' + fecha.split('/')[1] + '-' + fecha.split('/')[0] + ' ' + getTime({ timezone: "America/La_Paz" })
    // console.log(formato, ' hora peru')
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      const bearetoken = bearerHeader.split(" ")[1];
      // console.log('pasa la primera condicional, se ha obtenido los encabezados', bearetoken )

      jwt.verify(bearetoken, KEY, async (errtoken, authData) => {
        if (errtoken) {
          console.log('error en la verificacion token alterado: ', bearetoken)
          pool.query("delete from sesion where token = ?", [bearetoken]);
          return res.json({
            ok: false,
            sesion: false,
            msg: "Su token a expirado, cierre sesion y vuelva a iniciar sesion",
          });
        }

        const sql = `SELECT usuario, usuario_des, rol,  nombre,   hospital_des, hospital, municipio_tec, municipio_id_tec, municipio, municipio_des, red, red_des, comunidad, id_comunidad from sesion s 
                  where token  = ${pool.escape(bearetoken)}`;
        const [result] = await pool.query(sql);
        // console.log('pasa la verificacion del token', result[0].idusuario)

        if (result.length > 0) {
          req.body.user = await result[0].usuario;
          req.body.usernameS = await result[0].usuario_des;
          req.body.srol = await result[0].rol;
          req.body.shospital = await result[0].hospital_des;
          req.body.sidhospital = await result[0].hospital;
          req.body.sidmunicpio = await result[0].municipio;
          req.body.smunicipio_des = await result[0].municipio_des;
          req.body.sidred = await result[0].red;
          req.body.sred_des = await result[0].red_des;
          req.body.sidcomunidad = await result[0].id_comunidad;
          req.body.scomunidad = await result[0].comunidad;
          req.body.municipio_tec = await result[0].municipio_tec;
          req.body.municipio_id_tec = await result[0].municipio_id_tec;
          req.body.nombreusuarioS = await result[0].nombre;
          req.body.fecha_ = formato;
          next();
        } else {
          return res.json({
            ok: false,
            sesion: false,
            msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
          });
        }
      });
    } else {
      return res.json({
        ok: false,
        sesion: false,
        msg: "El Servidor no puede interpretar su autenticidad",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, sesion: false, msg: "Error en el servidor" });
  }
});

const admin = (req, res, next) => {
  if (parseInt(req.body.srol) === 1) {
    // console.log(req.body.numero, 'numero rol')
    next();
  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const tecnico = (req, res, next) => {
  if (parseInt(req.body.srol) === 3) {
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const encargado = (req, res, next) => {
  if (parseInt(req.body.srol) === 2) {
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};
const accesoEstadisticaDepartamental = (req, res, next) => {
  if (parseInt(req.body.srol) === 20) {
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const ube = (req, res, next) => {
  if (parseInt(req.body.srol) === 4) {
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const funcionesCompartidos = (req, res, next) => {
  if (parseInt(req.body.srol) === 1 || parseInt(req.body.srol) === 2 || parseInt(req.body.srol) === 3 || parseInt(req.body.srol) === 4 || parseInt(req.body.srol) === 5 || parseInt(req.body.srol) === 6 || parseInt(req.body.srol) === 20 || parseInt(req.body.srol) === 30 ||
    parseInt(req.body.srol) === 40 ||
    parseInt(req.body.srol) === 7) {
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const funcionesCompartidosLabConsultorio = (req, res, next) => {
  if (parseInt(req.body.srol) === 5) {  // usuario diagnostico y tratamiento
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const funcionesTratamientoNivelHospital = (req, res, next) => {
  if (parseInt(req.body.srol) === 5) {  // usuario diagnostico y tratamiento
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const funcionesReportesTratamientoDepto = (req, res, next) => {
  if (parseInt(req.body.srol) === 7 || parseInt(req.body.srol) === 20) {  // usuario diagnostico y tratamiento
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const funcionesReportesDiagnosticoDepto = (req, res, next) => {
  if (parseInt(req.body.srol) === 7 || parseInt(req.body.srol) === 20) {  // usuario diagnostico y tratamiento
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};




const funcionesLaboratorio = (req, res, next) => {

  if (parseInt(req.body.srol) === 6) {  // usuario laboratorio
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const funcionesIEC = (req, res, next) => {

  if (parseInt(req.body.srol) === 30) {  // usuario laboratorio
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};

const funcionesEvaluador = (req, res, next) => {

  if (parseInt(req.body.srol) === 40) {  // usuario laboratorio
    next();

  } else
    return res.json({
      ok: false,
      sesion: false,
      msg: "El Servidor no puede identificar su autencidad, cierre sesion y vuelva a intentar",
    });
};






// ADMINISTRADOR

rutas.use("/comunidad", verificacion, admin, comunidad);
rutas.use("/hospital", verificacion, admin, entidad);
rutas.use("/usuarios", verificacion, admin, usuario);
rutas.use("/gestion", verificacion, admin, gestion);
rutas.use("/mes", verificacion, admin, mes);


// estadistica departamental
rutas.use("/estadistica-departamental", verificacion, accesoEstadisticaDepartamental, estadisticaDepartamental);
rutas.use("/estadistica-departamental-RR2", verificacion, accesoEstadisticaDepartamental, estadisticaDepartamentalRR2);
rutas.use("/estratificado", verificacion, accesoEstadisticaDepartamental, estratificado);
rutas.use("/estadistica-ube-consolidado", verificacion, accesoEstadisticaDepartamental, estadistica_ube_consolidado);


// JEFE DE BRIGADA MUNICIPAL

rutas.use("/ee-2-encargado", verificacion, encargado, EE2_Encargado);
rutas.use("/rr-2", verificacion, encargado, RR2_Rociado);



// tecnico operativo
rutas.use("/ee-1", verificacion, tecnico, evaluacion1);
rutas.use("/evaluador-ee1-municipal", verificacion, tecnico, evaluacion_ee1_municipal);
rutas.use("/rociado-1", verificacion, tecnico, rociado1);

// EVALUADOR
rutas.use("/evaluador-ee1", verificacion, funcionesEvaluador, evaluador)


// componente ube
rutas.use("/ube", verificacion, ube, recepcion);
rutas.use("/laboratorio", verificacion, ube, Laboratorio);
rutas.use("/consolidado", verificacion, ube, consolidado);

//DIAGNOSTICO Y TRATAMIENTO

rutas.use("/pacientes", verificacion, funcionesCompartidosLabConsultorio, pacientes);
rutas.use("/tratamiento", verificacion, funcionesTratamientoNivelHospital, tratamiento);

rutas.use("/consultas", verificacion, funcionesTratamientoNivelHospital, consultas);
rutas.use("/diagnostico", verificacion, funcionesTratamientoNivelHospital, diagnostico);

//REPORTES TRATAMIENTO DEPARTAMENTAL
rutas.use("/reportes-tratamiento-depto", verificacion, funcionesReportesTratamientoDepto, reportesTratamientoDepto);
rutas.use("/reportes-diagnostico-depto", verificacion, funcionesReportesDiagnosticoDepto, reportesDiagnosticoDepto);


// laboratorio
rutas.use("/laboratorio-diagnostico", verificacion, funcionesLaboratorio, laboratorioDiagnostico);


//REPORTES DIAGNOSTICO DEPARTAMENTAL




//IEC
rutas.use("/iec", verificacion, funcionesIEC, iec);
rutas.use("/casa", verificacion, funcionesCompartidos, casa);



rutas.use("/miPerfil", verificacion, miPerfil);
rutas.use("/public", public);


module.exports = rutas
