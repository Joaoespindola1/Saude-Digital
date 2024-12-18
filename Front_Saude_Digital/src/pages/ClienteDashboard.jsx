import { useEffect, useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import LogoutButton from "../components/LogoutButton";
import Chat from '../components/Chat';

function ClienteDashboard() {
  const navigate = useNavigate();
  const [corretores, setCorretores] = useState([]);
  const [filteredCorretores, setFilteredCorretores] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [selectedRegiao, setSelectedRegiao] = useState('');
  const [planos, setPlanos] = useState([]);
  const [selectedPlano, setSelectedPlano] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // Ordenação padrão: decrescente

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCorretores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/corretores/');
        const corretoresData = response.data.corretores;
  
        const corretoresComAvaliacao = await Promise.all(
          corretoresData.map(async (corretor) => {
            try {
              const avaliacaoResponse = await axios.post(
                'http://127.0.0.1:8000/ver_avaliacao_corretor/',
                { id: corretor.id }
              );
              return {
                ...corretor,
                media_avaliacao: avaliacaoResponse.data.media_avaliacao || 0,
              };
            } catch (error) {
              console.error(`Erro ao buscar avaliação para corretor ${corretor.id}:`, error);
              return {
                ...corretor,
                media_avaliacao: 0,
              };
            }
          })
        );
  
        // Ordena os corretores por avaliação em ordem decrescente ao carregar
        corretoresComAvaliacao.sort((a, b) => b.media_avaliacao - a.media_avaliacao);
  
        const uniqueRegioes = [
          ...new Set(corretoresComAvaliacao.map((corretor) => corretor.endereco)),
        ];
  
        setCorretores(corretoresComAvaliacao);
        setFilteredCorretores(corretoresComAvaliacao);
        setRegioes(uniqueRegioes);
      } catch (error) {
        console.error('Erro ao buscar corretores:', error);
      }
    };
  
    const fetchPlanos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/listar_planos/');
        setPlanos(response.data.planos);
      } catch (error) {
        console.error('Erro ao buscar planos de saúde:', error);
      }
    };
  
    fetchCorretores();
    fetchPlanos();
  }, []);
  

  const handleRegiaoChange = (event) => {
    const regiao = event.target.value;
    setSelectedRegiao(regiao);

    filterCorretores(regiao, selectedPlano, sortOrder);
  };

  const handlePlanoChange = (event) => {
    const planoId = parseInt(event.target.value);
    const updatedSelectedPlano = selectedPlano.includes(planoId)
      ? selectedPlano.filter((id) => id !== planoId)
      : [...selectedPlano, planoId];

    setSelectedPlano(updatedSelectedPlano);

    filterCorretores(selectedRegiao, updatedSelectedPlano, sortOrder);
  };

  const handleSortOrderChange = (event) => {
    const order = event.target.value;
    setSortOrder(order);

    filterCorretores(selectedRegiao, selectedPlano, order);
  };

  const filterCorretores = (regiao, planosSelecionados, order) => {
    let filtered = corretores;

    if (regiao) {
      filtered = filtered.filter((corretor) => corretor.endereco === regiao);
    }

    if (planosSelecionados && planosSelecionados.length > 0) {
      filtered = filtered.filter((corretor) =>
        Array.isArray(corretor.planos) &&
        corretor.planos.some((plano) => planosSelecionados.includes(plano.id))
      );
    }

    // Ordena com base na avaliação
    if (order === 'asc') {
      filtered.sort((a, b) => a.media_avaliacao - b.media_avaliacao);
    } else {
      filtered.sort((a, b) => b.media_avaliacao - a.media_avaliacao);
    }

    setFilteredCorretores(filtered);
  };

  const handleVerPerfil = (id) => {
    navigate(`/corretor-perfil/${id}`);
  };

  return (
    <div className="min-h-screen bg-bg_bege">
      <header className="bg-white border-b-2 border-black flex justify-between items-center p-4">
        <h1 className="text-bg_azul_escuro text-3xl font-bold">Saúde Digital</h1>
        <div className="flex space-x-4">
          <LogoutButton />
        </div>
      </header>
      <div className="flex">
        <aside className="w-1/4 bg-white p-4 min-h-screen">
          <h2 className="text-xl font-bold mb-4">Filtros</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Ordenar por Avaliação</label>
            <select
              className="border rounded-md p-2 w-full"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="desc">Decrescente</option>
              <option value="asc">Crescente</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Região</label>
            <select
              className="border rounded-md p-2 w-full"
              value={selectedRegiao}
              onChange={handleRegiaoChange}
            >
              <option value="">Selecione uma região</option>
              {regioes.map((regiao, index) => (
                <option key={index} value={regiao}>
                  {regiao}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Planos de Saúde</label>
            <div>
              {planos.map((plano) => (
                <div key={plano.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={plano.id}
                    checked={selectedPlano.includes(plano.id)}
                    onChange={handlePlanoChange}
                    className="mr-2"
                  />
                  <label>{plano.nome}</label>
                </div>
              ))}
            </div>
          </div>
        </aside>
        <main className="w-3/4 bg-bg_bege p-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredCorretores.map((corretor) => (
              <div
                key={corretor.id}
                className="bg-white p-4 rounded shadow-md relative"
              >
                <div className="absolute top-2 left-2 bg-yellow-300 text-black font-bold px-2 py-1 rounded">
                  {corretor.media_avaliacao ? corretor.media_avaliacao.toFixed(1) : "N/A"}
                </div>
                <img
                  src={corretor.foto_perfil || 'https://via.placeholder.com/150'}
                  alt={`Foto de ${corretor.nome}`}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-2 text-center">{corretor.nome}</h3>
                <div className="flex justify-center">
                  <Button text="Ver Perfil" onClick={() => handleVerPerfil(corretor.id)} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Chat />
    </div>
  );
}

export default ClienteDashboard;
