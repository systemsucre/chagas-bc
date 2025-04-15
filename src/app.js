const express =  require( 'express')

const path = require("path") 
const cors = require("cors")

const { PORT } = require("./config")
const ruta = require('./rutas/rutas')

//inicializar
const app = express();


app.use('/server_chagas', express.static(path.join(__dirname, '../public')))


// app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: false, parameterLimit:51200000}));
app.set("puerto", PORT);
app.use(cors());


app.disable("x-powered-by"); // evita que el atacante sepa que
//ejecutamos express js como servidor
// app.use(rutas);
app.use('/server_chagas',ruta) 

app.listen(app.get("puerto"), () => {
  console.log("servidor corriendo en: ", PORT);
});
