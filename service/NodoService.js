const Connection  = require('../database');
const Nodo = require('../Models/Nodo');

class NodoService{
    database;
    constructor(){
        this.database = new Connection;
    }

    async GetNodos(){
        return await this.database.GetModosAndConnections(0);
    }

    async AddNodo(nodo){
        return await this.database.AddNodo(nodo);
    }

    async AddConnectionNodo(connectionNodo){
        return await this.database.AddConnectionNodo(connectionNodo);
    }

    async DeleteNodo(id){
        await this.database.DeleteNodo(id)
        return await this.database.DeleteConnectionsNodo(id);;
    }

    async DeleteConnectionsNodo(id){
        return await this.database.DeleteConnectionNodoById(id);
    }

    async CalculateRutas(idNodoInicio, idNodoFin){
        let nodos = await this.database.GetNodos(0);
        let conexiones = await this.database.GetConexiones(0);
        return {ByPeso: this.encontrarRutaMasCorta(nodos, conexiones, idNodoInicio, idNodoFin), 
            byValor: this.encontrarRutaMasCorta(nodos, conexiones, idNodoInicio, idNodoFin, false)} ;
    }

    encontrarRutaMasCorta(nodos, conexiones, nodoInicioId, nodoFinId, byPeso =  true) {
        const nodosVisitados = new Set();
        const distancias = {};
        const antecesores = {};

        // Inicializar las distancias con valor infinito
        nodos.forEach(nodo => {
            distancias[nodo.id] = Infinity;
        });

        // La distancia al nodo inicial es 0
        distancias[nodoInicioId] = 0;

        // Bucle principal del algoritmo de Dijkstra
        while (nodosVisitados.size !== nodos.length) {
            let nodoActual = null;
            let distanciaMinima = Infinity;
        
            // Encontrar el nodo no visitado con la distancia mínima
            nodos.forEach(nodo => {
            if (!nodosVisitados.has(nodo.id) && distancias[nodo.id] < distanciaMinima) {
                nodoActual = nodo;
                distanciaMinima = distancias[nodo.id];
            }
            });
            if(nodoActual == null) break;
            // Marcar el nodo actual como visitado
            nodosVisitados.add(nodoActual.id);

            // Actualizar las distancias de los nodos vecinos no visitados
            conexiones.forEach(conexion => {
                if (conexion.nodoInicio === nodoActual.id) {
                  const nodoVecino = nodos.find(nodo => nodo.id === conexion.nodoFin);
                  const distanciaNodoActual = distancias[nodoActual.id];
                  const distanciaNodoVecino = byPeso ? conexion.peso : conexion.valor;
                  const distanciaAcumulada = distanciaNodoActual + distanciaNodoVecino;
                  if (distanciaAcumulada < distancias[nodoVecino.id]) {
                    distancias[nodoVecino.id] = distanciaAcumulada;
                    antecesores[nodoVecino.id] = nodoActual;
                  }
                }
                
                if (conexion.nodoFin === nodoActual.id) {
                  const nodoVecino = nodos.find(nodo => nodo.id === conexion.nodoInicio);
                  const distanciaNodoActual = distancias[nodoActual.id];
                  const distanciaNodoVecino = byPeso ? conexion.peso : conexion.valor;
                  const distanciaAcumulada = distanciaNodoActual + distanciaNodoVecino;
                  if (distanciaAcumulada < distancias[nodoVecino.id]) {
                    distancias[nodoVecino.id] = distanciaAcumulada;
                    antecesores[nodoVecino.id] = nodoActual;
                  }
                }
              });
              
        }

        // Construir la ruta más corta desde el nodo de inicio al nodo de fin
        let nodoActualId = Number.parseInt(nodoFinId);
        const rutaMasCorta = [nodos.find(nodo => nodo.id == nodoActualId)];
        while (nodoActualId != nodoInicioId) {
            const antecesorId = antecesores[nodoActualId].id;
            rutaMasCorta.unshift(nodos.find(nodo => nodo.id == antecesorId));
            nodoActualId = antecesorId;
        }

        return rutaMasCorta;
    }



    

    dijkstra(nodoInicial, nodos) {
        // Paso 1: Inicializar estructuras de datos
        const distancias = {};
        const antecesores = {};
        const visitados = new Set();
      
        nodos.forEach(nodo => {
          distancias[nodo.id] = nodo === nodoInicial ? 0 : Infinity;
          antecesores[nodo.id] = null;
        });
      
        // Paso 2: Iterar hasta que queden nodos no visitados
        while (nodos.some(nodo => !visitados.has(nodo))) {
            let nodoActual = null;
            let distanciaMinima = Infinity;
        
            // Encontrar el nodo no visitado con la distancia mínima
            nodos.forEach(nodo => {
            if (!visitados.has(nodo) && distancias[nodo.id] < distanciaMinima) {
                nodoActual = nodo;
                distanciaMinima = distancias[nodo.id];
            }
            });

            if (nodoActual === null) {
                break; // No hay más nodos no visitados, salir del bucle
            }
            // Paso 4: Marcar el nodo actual como visitado
            visitados.add(nodoActual);
        
            // Paso 5: Actualizar las distancias de los nodos vecinos no visitados
            nodoActual.nodosConectados.forEach(conexion => {
                const nodoVecino = nodos.find(nodo => nodo.id === conexion.nodoFin);
                const distanciaNodoActual = distancias[nodoActual.id];
                const distanciaNodoVecino = conexion.valor;
                const distanciaAcumulada = distanciaNodoActual + distanciaNodoVecino;
                if (distanciaAcumulada < distancias[nodoVecino.id]) {
                    distancias[nodoVecino.id] = distanciaAcumulada;
                    antecesores[nodoVecino.id] = nodoActual;
                }
            });
        }
  
  
      
        return { distancias, antecesores };
    }

    dijkstraPeso(nodoInicial, nodos) {
        // Paso 1: Inicializar estructuras de datos
        const distancias = {};
        const antecesoresPeso = {};
        const visitados = new Set();
      
        nodos.forEach(nodo => {
          distancias[nodo.id] = nodo === nodoInicial ? 0 : Infinity;
          antecesoresPeso[nodo.id] = null;
        });
      
        // Paso 2: Iterar hasta que queden nodos no visitados
        while (nodos.some(nodo => !visitados.has(nodo))) {
            let nodoActual = null;
            let distanciaMinima = Infinity;
        
            // Encontrar el nodo no visitado con la distancia mínima
            nodos.forEach(nodo => {
            if (!visitados.has(nodo) && distancias[nodo.id] < distanciaMinima) {
                nodoActual = nodo;
                distanciaMinima = distancias[nodo.id];
            }
            });
            if (nodoActual === null) {
                break; // No hay más nodos no visitados, salir del bucle
            }
        
            // Paso 4: Marcar el nodo actual como visitado
            visitados.add(nodoActual);
        
            // Paso 5: Actualizar las distancias de los nodos vecinos no visitados
            nodoActual.nodosConectados.forEach(conexion => {
            const nodoVecino = nodos.find(nodo => nodo.id === conexion.nodoFin);
            const distanciaNodoActual = distancias[nodoActual.id];
            const distanciaNodoVecino = conexion.peso;
            const distanciaAcumulada = distanciaNodoActual + distanciaNodoVecino;
            if (distanciaAcumulada < distancias[nodoVecino.id]) {
                distancias[nodoVecino.id] = distanciaAcumulada;
                antecesoresPeso[nodoVecino.id] = nodoActual;
            }
            });
        }
  
  
      
        return { distancias, antecesoresPeso };
    }
     
    reconstruirRuta(nodoInicial, nodoFinal, antecesores) {
        const ruta = [];
        let nodoActual = nodoFinal;
      
        while (nodoActual !== nodoInicial) {
          ruta.unshift(nodoActual);
          nodoActual = antecesores[nodoActual.id];
        }
      
        ruta.unshift(nodoInicial);
        return ruta;
      }
}

module.exports = NodoService;