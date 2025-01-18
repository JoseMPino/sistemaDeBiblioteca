import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RegistroLibro from "../components/RegistroLibro";
import  {jwtDecode}  from  'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Prestamos from "../components/Prestamos";

interface ILibro {
  _id: string;
  img: string;
  titulo: string;
  autor: string;
  editorial: string;
  categoria: string;
  isbn?: string;
  estado: boolean;
  creadoAct: Date;
}
interface DecodedToken {
  id: string;
  email: string;
  tipo: string;
  exp: number;
} 
export default function PanelAdmin() {


  //estados 
  const [libros, setLibros] = useState<ILibro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // libro para edicion
  const [libroActual, setLibroActual] = useState<ILibro | null>(null); 

  const navigate = useNavigate();


  //funcion para obtener libros
  const obtenerLibros = async () => {
    try {
      const response = await axios.get<ILibro[]>("https://sistemadebiblioteca.onrender.com/api/libros");
      setLibros(response.data);
    } catch (error) {
      console.error("Error al obtener los libros", error);
    } finally {
      setLoading(false);
    }
  };

  // funcion para verificar el tipo usuario
  const verificarUsurio = useCallback((token:string | null)=>{
    if(!token){
      navigate('/libros');
    }else{
      const decoded: DecodedToken = jwtDecode(token);
      const {tipo} = decoded
      if(tipo === "Usuario" || !tipo){
        navigate('/libros');
      }
    }
 
  },[navigate])

  //funcion para eliminar libro
  const eliminarLibro = async (id: string) => {
    try {
      const token = localStorage.getItem('token')
      const response =await axios.delete(`https://sistemadebiblioteca.onrender.com/api/libros/${id}`,
        {
          headers:{
          Authorization: `Bearer ${token}`,
        }}
      );
      const {msg} = response.data
      alert(msg)
      setLibros(libros.filter((libro) => libro._id !== id));
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      alert("error al eliminar libro")
    }
  };
//funcion para abrir formulario
  const abrirFormulario = (libro: ILibro | null = null) => {
    setLibroActual(libro);
    setMostrarFormulario(true);
  };
//funcion para cerrar formulario
  const cerrarFormulario = () => {
    setLibroActual(null);
    setMostrarFormulario(false);
    
    obtenerLibros();
    
  };

  useEffect(() => {
    // Obtiene el token almacenado localmente
    const token = localStorage.getItem('token');
    
      verificarUsurio(token);
    
    obtenerLibros();
  }, [verificarUsurio]);

  if (loading) {
    return <div>Cargando Libros...</div>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-6xl lg:px-7">
        <button
          onClick={() => abrirFormulario()}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Añadir Libro
        </button>
        {mostrarFormulario && (
        <RegistroLibro libro={libroActual} cerrarFormulario={cerrarFormulario} />
      )}

        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {libros.map((libro) => (
            <div key={libro._id} className="group relative">
              <img
                alt={libro.titulo}
                src={libro.img}
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <div className="mt-2 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-800">
                    <b>Titulo:</b> {libro.titulo}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>Autor:</b> {libro.autor}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>Editorial:</b> {libro.editorial}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>Categoria:</b> {libro.categoria}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>Creado:</b> {new Date(libro.creadoAct).toLocaleDateString()}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>{libro.estado ? "Disponible" : "Ocupado"}</b>
                  </h3>
                </div>
               
              </div>
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  onClick={() => eliminarLibro(libro._id)}
                  className="text-sm font-semibold text-gray-900"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => abrirFormulario(libro)}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      


      <Prestamos></Prestamos>
    </div>
  );
}