import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ClienteDashboard() {
  const navigate = useNavigate();
  const [corretores, setCorretores] = useState([]);
  const [filteredCorretores, setFilteredCorretores] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [selectedRegiao, setSelectedRegiao] = useState('');

  useEffect(() => {
    const fetchCorretores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/corretores/');
        const corretoresData = response.data.corretores;

        const uniqueRegioes = [...new Set(corretoresData.map((corretor) => corretor.endereco))];

        setCorretores(corretoresData);
        setFilteredCorretores(corretoresData); 
        setRegioes(uniqueRegioes);
      } catch (error) {
        console.error('Erro ao buscar corretores:', error);
      }
    };

    fetchCorretores();
  }, []);

  const handleRegiaoChange = (event) => {
    const regiao = event.target.value;
    setSelectedRegiao(regiao);

    if (regiao === '') {
      setFilteredCorretores(corretores);
    } else {
      const corretoresFiltrados = corretores.filter((corretor) => corretor.endereco === regiao);
      setFilteredCorretores(corretoresFiltrados);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleMessages = () => {
    navigate('/messages');
  };

  const handleVerPerfil = (id) => {
    navigate(`/corretor-perfil/${id}`);
  };

  return (
    <div className="min-h-screen bg-bg_bege">
      <header className="bg-white border-b-2 border-black flex justify-between items-center p-4">
        <h1 className="text-bg_azul_escuro text-3xl font-bold">Saúde Digital</h1>
        <div className="flex space-x-4">
          <Button text="Mensagens" onClick={handleMessages} />
          <Button text="Desconectar" onClick={handleLogout} />
        </div>
      </header>
      <div className="flex">
        <aside className="w-1/4 bg-white p-4 min-h-screen">
          <h2 className="text-xl font-bold mb-4">Filtros</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Região</label>
            <select className="border rounded-md p-2 w-full" value={selectedRegiao} onChange={handleRegiaoChange}>
              <option value="">Selecione uma região</option>
              {regioes.map((regiao, index) => (
                <option key={index} value={regiao}>
                  {regiao}
                </option>
              ))}
            </select>
          </div>
        </aside>
        <main className="w-3/4 bg-bg_bege p-4">
          <div className="grid grid-cols-3 gap-4">
            {filteredCorretores.map((corretor) => (
              <div key={corretor.id} className="bg-white p-4 rounded shadow-md">
                <img
                  src={corretor.fotoUrl || 'https://via.placeholder.com/150'}
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
    </div>
  );
}

export default ClienteDashboard;
