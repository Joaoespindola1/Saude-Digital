import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import LogoutButton from "../components/LogoutButton";
import { Mail, MessageCircleMore } from "lucide-react";

import Chat from '../components/Chat';

function CorretorPerfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [corretor, setCorretor] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [novaAvaliacao, setNovaAvaliacao] = useState({
    avaliacao: '',
    comentario: ''
  });

  useEffect(() => {
    const fetchCorretor = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/busca_corretor_id/?id=${id}`);
        setCorretor(response.data.corretor);
      } catch (error) {
        console.error('Erro ao buscar corretor:', error);
      }
    };

    const fetchAvaliacoes = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:8000/ver_avaliacao_corretor/', { id });
        setAvaliacoes(response.data.avaliacoes);
        console.log(response.data.avaliacoes)
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
      }
    };

    fetchCorretor();
    fetchAvaliacoes();
  }, [id]);

  const handleGoToHome = () => {
    navigate('/cliente-dashboard');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNovaAvaliacao((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Recuperar o ID do cliente logado do localStorage
    const clienteId = localStorage.getItem("userId");
  
    // ID do corretor já está na URL
    const corretorId = id;
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/cadastra_avaliacao/', {
        cliente_id: clienteId,  // Passando o ID do cliente
        corretor_id: corretorId,  // Passando o ID do corretor
        avaliacao: novaAvaliacao.avaliacao,
        comentario: novaAvaliacao.comentario
      });
  
      // Adiciona a nova avaliação à lista existente
      setAvaliacoes((prevAvaliacoes) => [
        ...prevAvaliacoes, 
        {
          clienteNome: response.data.feedback.cliente,
          comentario: response.data.feedback.comentario,
          data_feedback: response.data.feedback.data_feedback,
          avaliacao: response.data.feedback.avaliacao
        }
      ]);
      setNovaAvaliacao({ avaliacao: '', comentario: '' });
    } catch (error) {
      console.error('Erro ao cadastrar avaliação:', error);
    }
  };

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

  if (!corretor) {
    return <div>Carregando...</div>;
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
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <img
                src={corretor.foto_perfil || 'https://via.placeholder.com/150'}
                alt={`Foto de ${corretor.nome}`}
                className="w-48 h-48 rounded-full object-cover mr-8"
              />
              <div>
                <h2 className="text-3xl font-bold mb-1">{corretor.nome}</h2>
                <p className="text-xl text-gray-700 mb-1">Corretor de Saúde</p>
                <p className="text-lg text-gray-500">{corretor.endereco}</p>
              </div>
            </div>
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

          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-2">Serviços e Planos Disponíveis</h3>
            {/* Adicionar aqui os planos se necessário */}
          </div>
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
                    <p className="text-sm text-gray-500">{avaliacao.data_feedback}</p>  {/* Exibindo a data formatada */}
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


      <div className="flex justify-center items-center py-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-2/3">
          <h3 className="text-2xl font-bold mb-4">Deixe sua Avaliação</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-lg" htmlFor="avaliacao">Avaliação (1 a 5)</label>
              <input
                type="number"
                id="avaliacao"
                name="avaliacao"
                value={novaAvaliacao.avaliacao}
                onChange={handleFormChange}
                min="1"
                max="5"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-lg" htmlFor="comentario">Comentário</label>
              <textarea
                id="comentario"
                name="comentario"
                value={novaAvaliacao.comentario}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <Button text="Enviar Avaliação" type="submit" />
          </form>
        </div>
      </div>
      <Chat/>
    </div>
  );
}

export default CorretorPerfil;
