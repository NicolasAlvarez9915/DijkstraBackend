const mysql = require('mysql2');
const Nodo = require('../Models/Nodo');
const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_PORT
} = require('./config.js');
const ConexionNodo = require('../Models/ConexionNodo');

class Connection{
    
        
    constructor(){
        
    }

    async GetModosAndConnections(id){
        return new Promise((resolve, reject) =>{
            let respuesta = this.GetNodos(id) ;
            respuesta.then(nodos =>{
                if(nodos.length == 0){
                    resolve([]);
                    return;
                }
                let respuestaNodos =  this.GetConeccionNodos(nodos);
                respuestaNodos.then(NodosConConecciones =>{
                    resolve(NodosConConecciones);
                });
            });
        });
        
    }

    async GetNodos(id){
        const connection = this.configurarConeccion();

        try {

            connection.connect(); 
            return new Promise((resolve, reject) => {
                const query =  id == 0 ? `SELECT * FROM nodo` : `SELECT * FROM nodo where id=${id}`;
                connection.query(query, (error, results, fields) => {
                  if (error) {
                    reject(error);
                    return;
                  } 
                  let nodos = [];
                  results.forEach(item => {
                      let nodo = new Nodo();
                      nodo.id = item.id;
                      nodo.nombre = item.nombre;
                      nodo.tipo = item.tipo;
                      nodos.push(nodo);
                  });
                  
                  resolve(nodos);
                });
              });
                    
        } catch (error) {
            console.error(error);
        } finally {
            connection.end();
        }

    }

    async GetConexiones(id){
        const connection = this.configurarConeccion();

        try {

            connection.connect(); 
            return new Promise((resolve, reject) => {
                const query =  id == 0 ? `SELECT * FROM conexionnodo` : `SELECT * FROM conexionnodo where id=${id}`;
                connection.query(query, (error, results, fields) => {
                  if (error) {
                    reject(error);
                  } 
                  let conexiones = [];
                  results.forEach(itemConnection  => {
                        let conexionNodo = new ConexionNodo();
                        conexionNodo.id = itemConnection.id;
                        conexionNodo.nodoFin = itemConnection.nodofin;
                        conexionNodo.nodoInicio = itemConnection.nodoInicio;
                        conexionNodo.peso = itemConnection.peso;
                        conexionNodo.valor = itemConnection.valor;
                        conexiones.push(conexionNodo);
                });
                  
                  resolve(conexiones);
                });
              });
                    
        } catch (error) {
            console.error(error);
        } finally {
            connection.end();
        }

    }

    async GetConeccionNodos(nodos){
        const connection = this.configurarConeccion();
        try{
            
            connection.connect();
            let ids = nodos.map(item => item.id);
            return new Promise((resolve, reject) => {
                    
                connection.query('Select * from conexionnodo where nodoInicio in ('+ids.toString()+') or nodoFin in ('+ids.toString()+')', (err, results, field) => {
                    if(err){
                        reject(err);
                        
                    }
                    nodos.forEach(item =>{
                        results.forEach(itemConnection  => {
                            if(itemConnection.nodoInicio === item.id || itemConnection.nodofin === item.id)
                            {
                                let conexionNodo = new ConexionNodo();
                                conexionNodo.id = itemConnection.id;
                                conexionNodo.nodoFin = itemConnection.nodofin;
                                conexionNodo.nodoInicio = itemConnection.nodoInicio;
                                conexionNodo.peso = itemConnection.peso;
                                conexionNodo.valor = itemConnection.valor;
                                item.nodosConectados.push(conexionNodo);
                            }
                        });
                    });
                    resolve(nodos);
                });
            });
        } catch (error) {
            console.error(error);
        } finally {
            connection.end();
        }
    }

    async AddNodo(nodo){
        const connection = this.configurarConeccion();
        try{
            connection.connect();
            return new Promise((resolve, reject) => {
                const sql = 'INSERT INTO nodo (nombre, tipo) VALUES (?, ?)';
                const values = [nodo.nombre, nodo.tipo];
                connection.query(sql, values, (error, result) => {
                    if (error) {
                        reject('Error al ejecutar la consulta:', error);
                        return;
                    }
                    nodo.id = result.insertId;
                    nodo.nodosConectados = [];
                    resolve({ nodo: nodo });
                });
            });
        }catch (error) {
            console.error(error);
        } finally {
            connection.end();
        }
    }

    async AddConnectionNodo(connectionNodo){
        const connection = this.configurarConeccion();
        try{
            connection.connect();
            return new Promise((resolve, reject) => {
                const sql = 'INSERT INTO conexionnodo (valor, peso, nodoInicio, nodoFin) VALUES (?, ?, ?, ?)';
                const values = [connectionNodo.valor, 
                    connectionNodo.peso, 
                    connectionNodo.nodoInicio, 
                    connectionNodo.nodoFin];
                connection.query(sql, values, (error, result) => {
                    if (error) {
                        reject('Error al ejecutar la consulta:', error);
                        return;
                    }
                    resolve({ Respuesta: 'Inserción exitosa'});
                });
            });
        }catch (error) {
            console.error(error);
        } finally {
            connection.end();
        }
    }

    async DeleteNodo(id){
        const connection = this.configurarConeccion();
        try{

            connection.connect();
            return new Promise((resolve, reject) => {
                const sql = 'DELETE FROM nodo WHERE id = ?;';
                const values = [id];
                connection.query(sql, values, (error, result) => {
                    if (error) {
                        console.error("error",error);
                        reject('Error al ejecutar la consulta:', error);
                        return;
                    }
                    resolve({Respuesta: 'Eliminacion exitosa'});
                });
            });
        }catch (error) {
            console.error("error",error);
        } finally {
            connection.end();
        }
    }

    async DeleteConnectionNodoById(id){
        const connection = this.configurarConeccion();
        try{

            connection.connect();
            return new Promise((resolve, reject) => {
                const sql = 'DELETE FROM conexionnodo WHERE id = ?;';
                const values = [id];
                connection.query(sql, values, (error, result) => {
                    if (error) {
                        console.error("error",error);
                        reject('Error al ejecutar la consulta:', error);
                        return;
                    }
                    resolve({Respuesta: 'Eliminacion exitosa'});
                });
            });
        }catch (error) {
            console.error("error",error);
        } finally {
            connection.end();
        }
    }

    async DeleteConnectionsNodo(id){
        const connection = this.configurarConeccion();
        try{

            connection.connect();
            return new Promise((resolve, reject) => {
                const sql = `delete from conexionnodo where nodoInicio = ${id} or nodoFin = ${id}`
                connection.query(sql, (error, result) => {
                    if (error) {
                        console.error("error",error);
                        reject('Error al ejecutar la consulta:', error);
                        return;
                    }
                    resolve({Respuesta: 'Eliminacion exitosa'});
                });
            });
        }catch (error) {
            console.error("error",error);
        } finally {
            connection.end();
        }
    }
    configurarConeccion(){
        return mysql.createConnection({
            host: DB_HOST,
            database: DB_NAME,
            user: DB_USER,
            port:  DB_PORT,
            password: DB_PASSWORD
        });
    }
}

module.exports = Connection;