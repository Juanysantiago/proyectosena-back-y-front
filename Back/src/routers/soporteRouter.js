const express = require("express");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const authorizeRoles = require("../middlewares/roles");

const {

crearSoporte,

obtenerMisSoportes,

obtenerTodos,

responderSoporte

}=require("../controllers/soporteController");


router.post(

"/soportes",

verifyToken,

authorizeRoles("aprendiz"),

crearSoporte

);

router.get(

"/soportes/mios",

verifyToken,

authorizeRoles("aprendiz"),

obtenerMisSoportes

);

router.get(

"/soportes",

verifyToken,

authorizeRoles("administrador"),

obtenerTodos

);

router.put(

"/soportes/:id",

verifyToken,

authorizeRoles("administrador"),

responderSoporte

);

module.exports=router;