import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";

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

interface IPrestamo {
  _id: string;
  usuarioId:string;
  libroId: string; 
}




export default function VerLibros() {
  const [libros, setLibros] = useState<ILibro[]>([]);
  const [prestamos, setPrestamos] = useState<IPrestamo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fechaEntrega, setFechaEntrega] = useState<Date | null>(null);
  const [libroSeleccionado, setLibroSeleccionado] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
  const obtenerPrestamos = async () => {
    try {
      const response = await axios.get<IPrestamo[]>("https://sistemadebiblioteca.onrender.com/api/prestamos");
      setPrestamos(response.data);
    } catch (error) {
      console.error("Error al obtener los préstamos", error);
    }
  };
  const devolverLibro = async (prestamoId: string, libroId: string) => {
    try {
      await axios.delete(`https://sistemadebiblioteca.onrender.com/api/prestamos/${prestamoId}`);
      await axios.put(`https://sistemadebiblioteca.onrender.com/api/libros/${libroId}`, { estado: true });
      alert("Libro devuelto con éxito.");
      obtenerLibros();
      obtenerPrestamos();
    } catch (error) {
      console.error("Error al devolver el libro", error);
      alert("Hubo un error al devolver el libro.");
    }
  };

  const solicitarPrestamo = async (libroId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Debes iniciar sesión para solicitar un préstamo.");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      const { id: userId } = decoded;

      const dataPrestamo = {
        libro: libroId,
        usuario: userId,
        fechaPrestamo: new Date(),
        fechaEntrega: fechaEntrega || undefined,
        estado:false
      };

      await axios.post("https://sistemadebiblioteca.onrender.com/api/prestamos", dataPrestamo,{
        headers:{
          Authorization: `Bearer ${token}`,
        }
      });
      await axios.put(`https://sistemadebiblioteca.onrender.com/api/libros/${libroId}`, { estado: false }); 
      alert("Préstamo solicitado con éxito.");
      setFechaEntrega(null);
      setLibroSeleccionado(null);
      obtenerLibros();
      obtenerPrestamos();
    } catch (error) {
      console.error("Error al solicitar el préstamo", error);
      alert("Hubo un error al solicitar el préstamo. Inténtalo nuevamente.");
    }
  };

  const cancelarSeleccion = () => {
    setLibroSeleccionado(null);
    setFechaEntrega(null);
  };

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.id);
     
    }

    obtenerLibros();
    obtenerPrestamos();
    

  }, []);

  if (loading) {
    return <div>Cargando libros...</div>;
  }
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-6xl lg:px-7">
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {libros.map((libro) => {
           const prestamoUsuario = prestamos.find(
            (prestamo) =>
              prestamo.libroId === libro._id && 
              prestamo.usuarioId === userId 
          );
         

            return (
              <div key={libro._id} className="group relative">
                <img
                  alt={libro.titulo}
                  src={libro.img}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <div className="mt-2 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-800">
                      <b>Título:</b> {libro.titulo}
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
                      <b>{libro.estado ? "Disponible" : "Ocupado"}</b>
                    </h3>
                  </div>
                </div>
                {libro.estado ? (
                  <div>
                    <button
                      onClick={() => setLibroSeleccionado(libro._id)}
                      className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Solicitar Préstamo
                    </button>
                    {libroSeleccionado === libro._id && (
                      <div className="mt-2">
                        <DatePicker
                          selected={fechaEntrega}
                          onChange={(date: Date | null) => setFechaEntrega(date)}
                          isClearable
                          placeholderText="Seleccionar fecha de entrega (opcional)"
                          className="border rounded px-2 py-1 w-full"
                        />
                        <button
                          onClick={() => solicitarPrestamo(libro._id)}
                          className="mt-2 rounded-md bg-green-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                        >
                          Confirmar Préstamo
                        </button>
                        <button
                          onClick={cancelarSeleccion}
                          className="mt-2 rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  prestamoUsuario && (
                    <button
                      onClick={() => devolverLibro(prestamoUsuario._id, libro._id)}
                      className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      Devolver Libro
                    </button>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
