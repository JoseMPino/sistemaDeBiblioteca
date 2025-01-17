import { Router } from "express";
import {crearLibro,obtenerLibros,buscarLibro,actualizarLibro,eliminarLibro, uploadImage} from "../controllers/ctrlLibro";
import { validarTipoUsuario } from "../middleware/ValidarTipoUser";
const router = Router();

router.post ("/",validarTipoUsuario('Administrador'),uploadImage,crearLibro)
router.get("/",obtenerLibros);
router.get("/:id",buscarLibro);
router.put("/:id",uploadImage,actualizarLibro);
router.delete("/:id",validarTipoUsuario('Administrador'),eliminarLibro);

export default router;