import { useState, useEffect } from "react";
import axios from "axios";

import "react-datepicker/dist/react-datepicker.css";

interface IPrestamo {
    _id: string;
    nombreUsuario: string;
    emailUsuario: string;
    tituloLibro: string;
    libroId: string;
    fechaPrestamo: Date;
    fechaEntrega: Date;
    estado: boolean;
}

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState<IPrestamo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const obtenerPrestamos = async () => {
    try {
      const response = await axios.get("https://sistemadebiblioteca.onrender.com/api/prestamos/");
      setPrestamos(response.data);
    } catch (error) {
      console.error("Error al cargar los préstamos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 

    obtenerPrestamos();
  }, []);

  if (loading) {
    return <div>Cargando préstamos...</div>;
  }

  const devolucionPrestamo = async (prestamoId: string, libroId: string,estado:boolean) => {
    try {

      await axios.delete(`https://sistemadebiblioteca.onrender.com/api/prestamos/${prestamoId}`);
      await axios.put(`https://sistemadebiblioteca.onrender.com/api/libros/${libroId}`, { estado: true}); 
      obtenerPrestamos();
      if(estado){
        alert("Préstamo Rechazado");
      }
      else{
        alert("La persona devolvio el libro");
      }
      
    } catch (error) {
      console.error("Error al rechazar el préstamo:", error);
      alert("No se pudo rechazar el préstamo.");
    }
  };

  return (
    <div className="bg-white">
        <hr></hr>
         <h2 className="mt-1 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Prestamos
          </h2>
          
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-6xl lg:px-7">
        <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {prestamos.map((prestamo, index) => (
            <div key={index} className="group relative">
              <div className="mt-2 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-800">
                    <b>Nombre:</b> {prestamo.nombreUsuario}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>Libro:</b> {prestamo.tituloLibro}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>Email:</b> {prestamo.emailUsuario}
                  </h3>
                  <h3 className="text-sm text-gray-800">
                    <b>Fecha préstamo:</b> {new Date(prestamo.fechaPrestamo).toLocaleDateString()}
                  </h3>
                  {prestamo.fechaEntrega && (
                    <h3 className="text-sm text-gray-800">
                    <b>Fecha entrega:</b> {new Date(prestamo.fechaEntrega).toLocaleDateString()}
                  </h3>
                  )}
                  <h3 className="text-sm text-gray-800">
                    <b>Estado:</b> {prestamo.estado ? "Pendiente" : "Confirmado"}
                  </h3>
                </div>
              </div>
              <div>
                <button
                onClick={()=> devolucionPrestamo(prestamo._id,prestamo.libroId,prestamo.estado)}
                  className="rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                 { "Devolucion"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
