import { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import LogoutButton from "../components/LogoutButton"


function CorretorDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  const handleGoToProfile = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/corretor-perfil-edit/${userId}`)
    } else {
      alert("Erro ao encontrar o usuário. Faça login novamente.")
      navigate("/login")
    }
  };

  return (
    <div className="min-h-screen bg-bg_bege">
      <header className="bg-white border-b-2 border-black flex justify-between items-center p-4">
        <h1 className="text-bg_azul_escuro text-3xl font-bold">Saúde Digital</h1>
        <div className="flex space-x-4">
          <LogoutButton />
        </div>
      </header>
      <div className="flex flex-col items-center mt-8 space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-3xl border-2 border-bg_azul_escuro">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full text-center">
              <h2 className="text-2xl font-semibold mb-4">Acesse seu Perfil</h2>
              <p className="mb-6 text-gray-700">Clique abaixo para ver e editar seu perfil.</p>
              <button
                onClick={handleGoToProfile}
                className="w-full bg-bg_azul_escuro hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ir para Perfil
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-3xl border-2 border-bg_azul_escuro">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full text-center">
              <h2 className="text-2xl font-semibold mb-4">Simulador de Cotação</h2>
              <p className="mb-6 text-gray-700">Simule uma cotação.</p>
              <button
                className="w-full bg-bg_azul_escuro hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Abrir Simulação
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-3/4 max-w-3xl border-2 border-bg_azul_escuro">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full text-center">
              <h2 className="text-2xl font-semibold mb-4">Designs para Divulgação</h2>
              <p className="mb-6 text-gray-700">Acesse designs prontos para divulgar os seus serviços.</p>
              <button
                className="w-full bg-bg_azul_escuro hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Ver Designs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CorretorDashboard;
