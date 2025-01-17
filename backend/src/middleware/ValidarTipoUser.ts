import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtSecreto = process.env.JWT_SECRETO as string;

export const validarTipoUsuario = (tipo: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            res.status(401).json({ msg: "No se proporcionó un token" });
            return;
        }

        try {
            const decoded = jwt.verify(token, jwtSecreto) as { tipo: string };
            if (decoded.tipo !== tipo) {
                
                res.status(403).json({ msg: "Acceso denegado para este tipo de usuario" });
                return;
            }
            next(); 
        } catch (error) {
            res.status(401).json({ msg: "Token inválido" });
            return ;
        }
    };
};
