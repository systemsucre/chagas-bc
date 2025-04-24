const express =  require( 'express')

const  {dirname}  = require("path");
const { fileURLToPath } = require("url")
const path = require("path")
const cors = require("cors")

const { PORT } = require("./src/config.js")
const ruta = require('./src/rutas/rutas.js')

//inicializar
const app = express();
app.use(cors());

// const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "./imagenes")));

// app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: false, parameterLimit:51200000}));
app.set("puerto", PORT);




app.disable("x-powered-by"); // evita que el atacante sepa que
//ejecutamos express js como servidor
// app.use(rutas);
app.use(express.static(path.join(__dirname,"./front/build")));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, "/front/build", "index.html"))
// })

app.use('/server_chagas',ruta)




app.listen(app.get("puerto"), () => {
  console.log("servidor corriendo en: ", PORT);
});
