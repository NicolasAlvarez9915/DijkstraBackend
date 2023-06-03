const express = require('express');
const router = express.Router();
const NodoControllers = require('../controllers/NodoController');

router.get("/GetNodos",NodoControllers.GetNodos);
router.post("/AddNodo",NodoControllers.AddNodo);
router.post("/AddConnectionNodo",NodoControllers.AddConnectionNodo);
router.delete("/DeleteNodo/:id",NodoControllers.DeleteNodo);
router.delete("/DeleteConnectionNodo/:id",NodoControllers.DeleteConnectionNodo);
router.get("/CalculateRutas/:nodoInicio/:nodoFin",NodoControllers.CalculateRutas);

module.exports = router;