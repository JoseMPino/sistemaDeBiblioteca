import { Request, Response } from "express";
import PrestamoBiblioteca from "../models/mdPrestamoBiblioteca";
import { IUser } from "../models/mdUser";
import { ILibro } from "../models/mdLibro";
// crear Prestamo Biblioteca
export const crearPrestamoBiblioteca = async (req: Request, res: Response): Promise<void> => {
    try {
        const { libro, usuario, fechaPrestamo, fechaEntrega, estado } = req.body;
        const nuevoPrestamo = new PrestamoBiblioteca({ libro, usuario, fechaPrestamo, fechaEntrega, estado });
        await nuevoPrestamo.save();
        res.status(201).json({ msg: "Prestamo creado correctamente" });
        return;
    } catch (error) {
        res.status(500).json({ msg: "Error al crear prestamo" });
        return;
    }
}
// obtener Prestamos Biblioteca
export const obtenerPrestamosBiblioteca = async (req: Request, res: Response): Promise<void> => {
    try {
        const prestamos = await PrestamoBiblioteca.find()
            .populate<{ usuario: IUser }>('usuario', 'nombres apellidos email') 
            .populate<{ libro: ILibro }>('libro', 'titulo') 
            .exec();

        // Mapear los datos formateados
        const prestamosFormateados = prestamos.map(prestamo => ({
            _id: prestamo._id,
            libroId: prestamo.libro ? prestamo.libro._id : null, 
            usuarioId: prestamo.usuario ? prestamo.usuario._id : null,
            nombreUsuario: `${prestamo.usuario.nombres} ${prestamo.usuario.apellidos}`,
            emailUsuario: prestamo.usuario.email,
            tituloLibro: prestamo.libro.titulo,
            fechaPrestamo: prestamo.fechaPrestamo,
            fechaEntrega: prestamo.fechaEntrega,
            estado: prestamo.estado,
            
        }));

        res.status(200).json(prestamosFormateados);
    } catch (error) {
        console.error('Error al obtener préstamos:', error);
        res.status(500).json({ msg: "Error al obtener préstamos" });
    }
};
// editar Prestamo Biblioteca
export const editarPrestamoBiblioteca = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const prestamo = await PrestamoBiblioteca.findById(id);
        if (!prestamo) {
            res.status(404).json({ msg: "Prestamo no encontrado" });
            return;
        }
        await PrestamoBiblioteca.findByIdAndUpdate(id, req.body);
        res.status(200).json({ msg: "Prestamo actualizado correctamente" });
        return;
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar prestamo" });
        return;
    }
}

// eliminar Prestamo Biblioteca
export const eliminarPrestamoBiblioteca = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const prestamo = await PrestamoBiblioteca.findById(id);
        if (!prestamo) {
            res.status(404).json({ msg: "Prestamo no encontrado" });
            return;
        }
        await PrestamoBiblioteca.findByIdAndDelete(id);
        res.status(200).json({ msg: "Prestamo eliminado correctamente" });
        return;
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar prestamo" });
        return;
    }
}
