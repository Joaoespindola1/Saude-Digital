import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import Button from '../components/Button';

import { Mail, MessageCircleMore } from "lucide-react";

import Chat from '../components/Chat';

function PerfilCorretorEdit() {
  const navigate = useNavigate();
  const [corretor, setCorretor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); 
  const [editForm, setEditForm] = useState({}); 
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [planos, setPlanos] = useState([]); 
  const [selectedPlanos, setSelectedPlanos] = useState([]);


  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
    } else {
      const fetchCorretor = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/busca_corretor_id/?id=${userId}`
            );
            setCorretor(response.data.corretor);
            setEditForm(response.data.corretor);
            // Atualize os planos selecionados com base nos dados do corretor
            const planosAssociados = response.data.corretor.planos || [];
            setSelectedPlanos(planosAssociados.map((plano) => String(plano.id))); // Garantir que IDs sejam strings
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao buscar os dados do corretor:", error);
            setIsLoading(false);
        }
    };
    

      const fetchAvaliacoes = async () => {
        try {
          const response = await axios.post('http://127.0.0.1:8000/ver_avaliacao_corretor/', { id: userId });
          setAvaliacoes(response.data.avaliacoes);
        } catch (error) {
          console.error('Erro ao buscar avaliações:', error);
        }
      }

      const fetchPlanos = async () => {  
        try {
          const response = await axios.get('http://127.0.0.1:8000/listar_planos/');
          setPlanos(response.data.planos)
        } catch (error) {
          console.error('Erro ao buscar planos:', error);
        }
      };

      fetchPlanos()
      fetchCorretor();
      fetchAvaliacoes();
    }
  }, [navigate])

  const renderStars = (avaliacao) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < avaliacao ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };
  

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handlePlanoChange = (e) => {
    const selectedValue = String(e.target.value); // Força o valor a ser string.
    setSelectedPlanos((prevSelectedPlanos) => {
      if (prevSelectedPlanos.includes(selectedValue)) {
        return prevSelectedPlanos.filter((planoId) => planoId !== selectedValue);
      } else {
        return [...prevSelectedPlanos, selectedValue];
      }
    });
  };
  
  

  const handleUpdate = async () => {
    console.log("Planos selecionados:", selectedPlanos); // Debug
    try {
        const response = await axios.post(
            "http://127.0.0.1:8000/atualiza_corretor/",
            {
                id: corretor.id,
                ...editForm,
                planos: selectedPlanos, 
            }
        );
        alert(response.data.message);
        setCorretor(response.data.corretor);
        setIsEditing(false);
    } catch (error) {
        console.error("Erro ao atualizar os dados do corretor:", error);
        alert("Erro ao atualizar os dados.");
    }
};

  const handleGoToHome = () => {
    navigate('/corretor-dashboard');
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!corretor) {
    return <div>Erro ao carregar os dados do corretor.</div>;
  }

  return (
    <div className="min-h-screen bg-bg_bege">
      <header className="bg-white border-b-2 border-black flex justify-between items-center p-4">
        <h1 className="text-bg_azul_escuro text-3xl font-bold">Saúde Digital</h1>
        <div className="flex space-x-4">
          <Button text="Página Principal" onClick={handleGoToHome} />
          <LogoutButton />
        </div>
      </header>

      <div className="flex justify-center items-center py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-2/3">
          {isEditing ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="nome"
                  value={editForm.nome || ""}
                  onChange={handleEditChange}
                  placeholder="Nome"
                  className="w-full border border-gray-300 rounded p-2"
                />
                <input
                  type="text"
                  name="endereco"
                  value={editForm.endereco || ""}
                  onChange={handleEditChange}
                  placeholder="Cidade"
                  className="w-full border border-gray-300 rounded p-2"
                />
                <input
                  type="text"
                  name="telefone"
                  value={editForm.telefone || ""}
                  onChange={handleEditChange}
                  placeholder="Número"
                  className="w-full border border-gray-300 rounded p-2"
                />
                <input
                  type="email"
                  name="email"
                  value={editForm.email || ""}
                  onChange={handleEditChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded p-2"
                />
                <textarea
                  name="descricao"
                  value={editForm.descricao || ""}
                  onChange={handleEditChange}
                  placeholder="Sobre mim"
                  className="w-full border border-gray-300 rounded p-2"
                  rows="4"
                />
              </div>
              <div className="space-y-4">
                <label className="block font-bold">Planos de Saúde:</label>
                <div className="space-y-2">
                  {planos.map((plano) => (
                    <div key={plano.id} className="flex items-center">
                      <input
                        type="checkbox"
                        name="planos"
                        value={String(plano.id)}  // Garantir que o valor seja string
                        checked={selectedPlanos.includes(String(plano.id))}// Garantir que a comparação de tipo seja correta
                        onChange={handlePlanoChange}
                        className="mr-2"
                      />
                      <label>{plano.nome}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-bg_azul_escuro text-white py-2 px-4 rounded"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <img
                    src={corretor.foto_perfil || "https://via.placeholder.com/150"}
                    className="w-48 h-48 rounded-full object-cover mr-8"
                  />
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{corretor.nome}</h2>
                    <p className="text-xl text-gray-700 mb-1">Corretor de Saúde</p>
                    <p className="text-lg text-gray-500">{corretor.endereco}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-bg_azul_escuro text-white py-2 px-4 rounded"
                >
                  Editar Perfil
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold mb-2">Formas de Contato</h3>
                <p className="text-xl text-gray-700 mb-1 flex items-center">
                  <Mail className="mr-2" /> {corretor.email}
                </p>
                <p className="text-xl text-gray-700 mb-1 flex items-center">
                  <MessageCircleMore className="mr-2" /> {corretor.telefone}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold mb-2">Sobre mim</h3>
                <p className="text-lg text-gray-700">{corretor.descricao}</p>
              </div>
            </div> 
          )}
        </div>
      </div>
      <div className="flex justify-center items-center py-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-2/3">
          <h3 className="text-2xl font-bold mb-4">Avaliações</h3>
          <div className="space-y-4">
            {avaliacoes.map((avaliacao, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <img
                    src={avaliacao.clienteFotoUrl || 'https://via.placeholder.com/150'}
                    alt={`Foto de ${avaliacao.clienteNome}`}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-bold">{avaliacao.clienteNome}</h4>
                    <p className="text-sm text-gray-500">{avaliacao.data_feedback}</p> 
                  </div>
                </div>
                <p className="text-gray-700">{avaliacao.comentario}</p>
                <div className="mt-2">
                  {renderStars(avaliacao.avaliacao)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Chat/>
    </div>
  );
}

export default PerfilCorretorEdit;
