import express from 'express';
import cors from "cors";
import dotenv from "dotenv";

const app  = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4002;
//importando rutas
import conectarDB from './config/dB_Mongo';
import LibroRoutes from './routes/Libro.routes';
import UserRoutes from './routes/User.routes';
import PrestamoBibliotecaRoutes from './routes/PrestamoBiblioteca.routes';

app.listen(port,()=>{
    console.log(`servidor corriendo en el puerto ${port}`)
})
conectarDB();

// global routes
app.use("/api/libros",LibroRoutes);
app.use("/api/users",UserRoutes);
app.use("/api/prestamos",PrestamoBibliotecaRoutes);





