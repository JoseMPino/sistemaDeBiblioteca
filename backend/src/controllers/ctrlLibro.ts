import { Request,Response } from "express";
import Libro from "../models/mdLibro";
import multer from "multer";
import bucket from "../config/dB_Firebase";


// Configurar Multer para subir archivos a Firebase Storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



// crear libro
export const crearLibro = async (req: Request, res: Response): Promise<void> => {
    try {
      const { titulo, autor, editorial, categoria } = req.body;
      
      // Subir imagen a Firebase
      const file = req.file; // Esto debe venir desde el frontend (como un 'file' en el cuerpo de la solicitud)
      if (!file) {
        res.status(400).json({ msg: 'No se ha proporcionado ninguna imagen' });
        return;
      }
  
      const fileUpload = bucket.file(`libros/${file.originalname}`);
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
  
      stream.on('error', (err) => {
        res.status(500).json({ msg: 'Error al subir la imagen', error: err });
      });
  
      stream.on('finish', async () => {
        // Obtener la URL pública de la imagen después de cargarla
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/adpowereat.appspot.com/o/libros%2F${encodeURIComponent(file.originalname)}?alt=media`;
  
        // Guardar el libro en MongoDB con la URL de la imagen
        const libroExistente = await Libro.findOne({ titulo });
        if (libroExistente) {
          res.status(400).json({ msg: 'El libro ya existe' });
          return;
        }
  
        const nuevoLibro = new Libro({ 
          titulo, 
          autor, 
          editorial, 
          categoria, 
          img: imageUrl 
        });
  
        await nuevoLibro.save();
        res.status(201).json({ msg: 'Libro creado correctamente', libro: nuevoLibro });
      });
  
      stream.end(file.buffer);
  
    } catch (error) {
      res.status(500).json({ msg: 'Error al crear libro', error });
    }
  };
// obtener Libros
export const obtenerLibros = async(req:Request,res:Response):Promise<void>=>{
    try {
        const libros = await Libro.find();
        res.status(200).json(libros);
        return;
    } catch (error) {
       res.status(500).json({msg:"Error al obtener libros"});
       return;
    }
}
// buscar libro por id
export const buscarLibro = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {id} = req.params;
        const libro = await Libro.findById(id);
        if(!libro){
            res.status(404).json({msg:"Libro no encontrado"});
            return;
        }
       res.status(200).json(libro);
       return;
    } catch (error) {
        res.status(500).json({msg:"Error al buscar libro"});
        return;
    }
}
// actualizar libro

const subirImagenAFirebase = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileUpload = bucket.file(`libros/${file.originalname}`);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("finish", () => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/libros%2F${encodeURIComponent(file.originalname)}?alt=media`;
      resolve(imageUrl);
    });

    stream.end(file.buffer);
  });
};

export const actualizarLibro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { titulo, autor, editorial, categoria, estado} = req.body;
    const file = req.file;

    const libro = await Libro.findById(id);
    if (!libro) {
      res.status(404).json({ msg: "Libro no encontrado" });
      return;
    }

    let imageUrl = libro.img;

    // Si hay un archivo, eliminar la imagen anterior y subir la nueva
    if (file) {
      const filePath = libro.img.split("/o/")[1].split("?alt=media")[0];
      await bucket.file(decodeURIComponent(filePath)).delete();

      // Subir nueva imagen y obtener su URL
      imageUrl = await subirImagenAFirebase(file);
    }

    // Actualizar el libro con la nueva información
    const libroActualizado = await Libro.findByIdAndUpdate(
      id,
      { titulo, autor, editorial, categoria, img: imageUrl , estado },
      { new: true }
    );

    res.status(200).json({ msg: "Libro actualizado correctamente", libro: libroActualizado });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar libro", error });
  }
};

// eliminar libro
export const eliminarLibro = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const libro = await Libro.findById(id);
      if (!libro) {
        res.status(404).json({ msg: "Libro no encontrado" });
        return;
      }
  
      // Eliminar la imagen de Firebase Storage
      const filePath = libro.img.split("/o/")[1].split("?alt=media")[0];
      await bucket.file(decodeURIComponent(filePath)).delete();
  
      // Eliminar el libro de MongoDB
      await Libro.findByIdAndDelete(id);
  
      res.status(200).json({ msg: "Libro eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ msg: "Error al eliminar libro", error });
    }
  };

// Middleware para manejar la subida de la imagen
export const uploadImage = upload.single('image');