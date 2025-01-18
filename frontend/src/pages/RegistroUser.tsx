import React, { useState } from "react";
import axios from "axios";

export default function AtenticacionUser() {


  const [dataForm, setDataForm] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    email: "",
    password: "",
  });
  const [mensaje,setMensaje]= useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.post("https://sistemadebiblioteca.onrender.com/api/users/",dataForm);
        const mensaje = response.data.smg;
        setMensaje(mensaje)
        setDataForm({
            nombres: "",
            apellidos: "",
            documento: "",
            email: "",
            password: "",
        })
    }  catch (error:unknown) {
        if(axios.isAxiosError(error)){
          console.error(error.response?.data?.msg || "error al registrar")
          setMensaje(error.response?.data?.msg)
        }else{
          console.error("error desconocido")
        }

      }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-5 lg:px-8">
      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="border-b border-gray-900/10 pb-8">
              <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Registro
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Nombres
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      value={dataForm.nombres}
                      onChange={handleChange}
                      id="nombres"
                      name="nombres"
                      type="text"
                      autoComplete="given-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Apellidos
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      value={dataForm.apellidos}
                      onChange={handleChange}
                      id="apellidos"
                      name="apellidos"
                      type="text"
                      autoComplete="family-name"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="street-address"
                    className="block text-sm/4 font-medium text-gray-900"
                  >
                    Documento
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      value={dataForm.documento}
                      onChange={handleChange}
                      id="documento"
                      name="documento"
                      type="text"
                      autoComplete="off"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  <label
                    htmlFor="street-address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      value={dataForm.email}
                      onChange={handleChange}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  <label
                    htmlFor="street-address"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      value={dataForm.password}
                      onChange={handleChange}
                      required
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                  <p className="mt-10 text-center text-sm/6 text-gray-500">
               <b>{mensaje}</b> 
              
              </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
  
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrar
            </button>
            
          </div>
        </form>
      </div>
    </div>
  );
}
