import { Router } from "express";
import  {crearUser,autenticarUser,buscarUser,obtenerUser} from "../controllers/ctrlUser";

const router = Router();

router.post("/",crearUser);
router.get("/",obtenerUser);
router.post("/login",autenticarUser);
router.get("/:id",buscarUser);


export default router;