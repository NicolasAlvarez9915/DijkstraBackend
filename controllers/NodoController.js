const NodoService = require("../service/NodoService");


const GetNodos = (req, res) => {
    let nodoService = new NodoService();
    let respuesta = nodoService.GetNodos();
    respuesta.then(result => {
        res.send(result);   
    });
}

const AddNodo = (req, res) => {
    let nodoService = new NodoService();
    let respuesta = nodoService.AddNodo({nombre: req.body.nombre, tipo: req.body.tipo});
    respuesta.then(result => {
        res.send(result);   
    });
}
const AddConnectionNodo = (req, res) => {
    let nodoService = new NodoService();
    let respuesta = nodoService.AddConnectionNodo({
        valor: req.body.valor,
        peso: req.body.peso,
        nodoInicio: req.body.nodoInicio,
        nodoFin: req.body.nodoFin
    });
    respuesta.then(result => {
        res.send(result);   
    });
}

const DeleteNodo = (req, res) => {
    let id = req.params.id;
    let nodoService = new NodoService();
    let respuesta = nodoService.DeleteNodo(id);
    respuesta.then(result => {
        res.send(result);
    });
}

const DeleteConnectionNodo = (req, res) => {
    let id = req.params.id;
    let nodoService = new NodoService();
    let respuesta = nodoService.DeleteConnectionsNodo(id);
    respuesta.then(result => {
        res.send(result);
    });
}

const CalculateRutas = (req, res) => {
    let idNodoInicio = req.params.nodoInicio;
    let idNodoFin = req.params.nodoFin;
    if(idNodoInicio == idNodoFin){
        res.send(500);
    }
    
    let nodoService = new NodoService();
    let respuesta = nodoService.CalculateRutas(idNodoInicio, idNodoFin);
    respuesta.then(result => {
        res.send(result);
    });
}

module.exports = { GetNodos, AddNodo, DeleteNodo, AddConnectionNodo, DeleteConnectionNodo, CalculateRutas };