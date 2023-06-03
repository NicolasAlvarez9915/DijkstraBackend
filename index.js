const express = require('express');
const cors = require('cors');
const Connection = require('./database');
const app = express();
const {PORT} = require('./config.js');
const routes = require('./routes');
const NodoControllers = require('./controllers/NodoController');

const listaBlanca = ['*'];

app.use(express.json());
app.use(cors({
    origin: listaBlanca
}))
app.get("",NodoControllers.GetNodos);
app.use("/api/v1",routes);



app.listen(PORT, () => {
    console.log('proyecto funcionando');
});