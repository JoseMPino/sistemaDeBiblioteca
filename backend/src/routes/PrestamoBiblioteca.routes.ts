import { Router } from "express";
import { crearPrestamoBiblioteca, obtenerPrestamosBiblioteca, editarPrestamoBiblioteca, eliminarPrestamoBiblioteca } from "../controllers/ctrlPrestamoBiblioteca";
import { validarTipoUsuario } from "../middleware/ValidarTipoUser";
const router = Router();

router.post("/",validarTipoUsuario('Usuario'),crearPrestamoBiblioteca);
router.get("/",obtenerPrestamosBiblioteca);
router.put("/:id",editarPrestamoBiblioteca);
router.delete("/:id",eliminarPrestamoBiblioteca);

export default router;