import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

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


interface RegistroLibroProps {
    libro?: ILibro | null;
    cerrarFormulario: () => void;
}

const categoriasLibros = [
  'Terror', 'Ciencia Ficcion', 'Romance', 'Aventura', 'Fantasia', 'Historia', 
  'Biografia', 'Cuento', 'Poesia', 'Drama', 'Comedia', 'Infantil', 'Juvenil', 'Adulto'
];


const RegistroLibro: React.FC<RegistroLibroProps> = ({libro,cerrarFormulario}) => {

  const [titulo, setTitulo] = useState<string>(libro?.titulo ||'');
  const [autor, setAutor] = useState<string>(libro?.autor ||'');
  const [editorial, setEditorial] = useState<string>(libro?.editorial ||'');
  const [categoria, setCategoria] = useState<string>(libro?.categoria ||'');
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(libro?.img ||null);

  useEffect(() => {
    if (libro) {
      setTitulo(libro.titulo || "");
      setAutor(libro.autor || "");
      setEditorial(libro.editorial || "");
      setCategoria(libro.categoria || "Terror");
      setPreview(libro.img || null);
      setImagen(null);
    } else {
      // Limpiar el formulario si no hay libro seleccionado
      setTitulo("");
      setAutor("");
      setEditorial("");
      setCategoria("Terror");
      setPreview(null);
      setImagen(null);
    }
  }, [libro]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  
    e.preventDefault();
   
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('autor', autor);
    formData.append('editorial', editorial);
    formData.append('categoria', categoria);
    if (imagen) {
      formData.append('image', imagen);
    }

    try {
      const token = localStorage.getItem('token');
        if(libro){
          
           const response =  await axios.put(`https://sistemadebiblioteca.onrender.com/api/libros/${libro._id}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              });
              const {msg} = response.data;
              alert(msg);
        }
        else{
          
            const response = await axios.post('https://sistemadebiblioteca.onrender.com/api/libros', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${token}`,
                },
              });
            

              const {msg} = response.data;
            
              
               alert(msg);
             
        }
      
      cerrarFormulario();
      setTitulo('');
      setAutor('');
      setEditorial('');
      setCategoria('');
      setImagen(null);
      setPreview(null);
      
    } catch (error) {
      console.error('Error al guardar el libro:', error);
      alert("error al Guardar libro,se debe cargar una imagen")
     
    }
  };


  return (
    <div  className="flex min-h-full flex-1 flex-col justify-center px-6 py-11 lg:px-8">
    <div className="mt-9 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-3">
            <h2 className="text-base/7 font-semibold text-gray-900"> {libro ? "Editar Libro" : "Registrar Libro  (  !sube una imagen... )"}</h2>
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="titulo" className="block text-sm/6 font-medium text-gray-900">
                  Titulo
                </label>
                <div className="mt-1">
                    <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <input
                    id="titulo"
                    name="titulo"
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Escribe el titulo de libro"
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="autor" className="block text-sm/6 font-medium text-gray-900">
                  Autor
                </label>
                <div className="mt-1">
                <div className="flex items-center rounded-md bg-white pl-3 outline outline-1 -outline-offset-1 outline-gray-300 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600" >
                  <input
                    id="autor"
                    name="autor"
                    type="text"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    placeholder="Escribe el autor del libro"
                    className="block min-w-0 grow py-1.5 pl-1 pr-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline focus:outline-0 sm:text-sm/6"
                  />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="categoria" className="block text-sm/6 font-medium text-gray-900">
                  Categoria
                </label>
                <div className="mt-1 grid grid-cols-2">
                  <select
                    id="categoria"
                    name="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                  >
                    {categoriasLibros.map((categoria) => (
                      <option key={categoria}>{categoria}</option>
                    ))}
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="editorial" className="block text-sm/6 font-medium text-gray-900">
                  Editorial
                </label>
                <div className="mt-1">
                  <textarea
                    id="editorial"
                    name="editorial"
                    value={editorial}
                    onChange={(e) => setEditorial(e.target.value)}
                    rows={1}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="imagen" className="block text-sm/6 font-medium text-gray-900">
                  Imagen
                </label>
                <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    {preview ? (
                      <img src={preview} alt="Vista previa" className="mx-auto h-32 w-32 object-cover" />
                    ) : (
                      <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                    )}
                    <div className="mt-0 flex text-sm/6 text-gray-600">
                      <label
                        htmlFor="cargar-imagen"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Cargar imagen</span>
                        <input
                          id="cargar-imagen"
                          name="cargar-imagen"
                          type="file"
                          className="sr-only"
                          onChange={handleImageChange}
                        />
                      </label>
                      
                    </div>
                    <p className="text-xs/5 text-gray-600">PNG o JPG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-x-6">
          <button onClick={()=>cerrarFormulario()} className="text-sm/6 font-semibold text-gray-900">
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
     
    </div>
  );
};

export default RegistroLibro;
