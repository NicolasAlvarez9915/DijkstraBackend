const express = require('express');
const cors = require('cors');
const Connection = require('./database');
const app = express();
const {PORT} = require('./config.js');
const routes = require('./routes');

app.use(express.json());
app.use(cors({
    origin: '*'
}));
app.get("",(req, res) =>res.send("Api funcionando correctamente"));
app.use("/api/v1",routes);



app.listen(PORT, () => {
    console.log('proyecto funcionando');
});