import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const mockCorretores = [
  {
    id: 1,
    nome: 'João Silva',
    ocupacao: 'Corretor de Saúde',
    cidade: 'São Paulo, SP',
    fotoUrl: 'https://via.placeholder.com/150',
    sobreMim: 'Tenho 10 anos de experiência no mercado de planos de saúde...',
    servicosPlanos: ['Plano de Saúde A', 'Plano de Saúde B', 'Plano Dental'],
    avaliacoes: [
      {
        id: 1,
        clienteNome: 'Maria Souza',
        clienteFotoUrl: 'https://via.placeholder.com/150',
        descricao: 'Ótimo atendimento! Super recomendo.',
      },
    ],
  },
  // Adicione mais corretores conforme necessário
];

function PerfilCorretorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [corretor, setCorretor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const corretorData = mockCorretores.find((cor) => cor.id === parseInt(id));
    setCorretor(corretorData);
    setUpdatedData(corretorData); // Inicializa os dados atualizados com os dados do corretor
  }, [id]);

  const handleMessages = () => {
    navigate('/messages');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSaveChanges = () => {
    // Aqui você pode implementar a lógica para salvar os dados no backend
    alert('Alterações salvas com sucesso!');
    setIsEditing(false);
  };

  if (!corretor) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-bg_bege">
      <header className="bg-white border-b-2 border-black flex justify-between items-center p-4">
        <h1 className="text-bg_azul_escuro text-3xl font-bold">Saúde Digital</h1>
        <div className="flex space-x-4">
          <Button text="Mensagens" onClick={handleMessages} />
          <Button text="Desconectar" onClick={handleLogout} />
        </div>
      </header>

      <div className="flex justify-center items-center py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg w-2/3">
          <div className="flex justify-between items-start">
            <div className="flex items-start">
              <img
                src={updatedData.fotoUrl}
                alt={`Foto de ${updatedData.nome}`}
                className="w-48 h-48 rounded-full object-cover mr-8"
              />
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="nome"
                    value={updatedData.nome}
                    onChange={handleEditChange}
                    className="text-3xl font-bold mb-1 border-b-2 border-gray-300 outline-none"
                  />
                ) : (
                  <h2 className="text-3xl font-bold mb-1">{corretor.nome}</h2>
                )}
                <p className="text-xl text-gray-700 mb-1">{corretor.ocupacao}</p>
                <p className="text-lg text-gray-500">{corretor.cidade}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-2">Sobre mim</h3>
            {isEditing ? (
              <textarea
                name="sobreMim"
                value={updatedData.sobreMim}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            ) : (
              <p className="text-lg text-gray-700">{corretor.sobreMim}</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="text-2xl font-bold mb-2">Serviços e Planos Disponíveis</h3>
            {isEditing ? (
              <textarea
                name="servicosPlanos"
                value={updatedData.servicosPlanos.join(', ')}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="Liste os planos, separados por vírgula"
              />
            ) : (
              <ul className="list-disc list-inside text-lg text-gray-700">
                {corretor.servicosPlanos.map((servico, index) => (
                  <li key={index}>{servico}</li>
                ))}
              </ul>
            )}
          </div>

          {isEditing && (
            <div className="mt-4">
              <h3 className="text-2xl font-bold mb-2">Foto de Perfil</h3>
              <input
                type="text"
                name="fotoUrl"
                value={updatedData.fotoUrl}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="URL da foto de perfil"
              />
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {isEditing ? (
              <>
                <Button text="Salvar" onClick={handleSaveChanges} className="bg-green-600 text-white" />
                <Button text="Cancelar" onClick={() => setIsEditing(false)} className="bg-red-600 text-white" />
              </>
            ) : (
              <Button text="Editar" onClick={() => setIsEditing(true)} />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center py-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-2/3">
          <h3 className="text-2xl font-bold mb-4">Avaliações</h3>
          <div className="space-y-4">
            {corretor.avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <img
                    src={avaliacao.clienteFotoUrl}
                    alt={`Foto de ${avaliacao.clienteNome}`}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <h4 className="text-xl font-bold">{avaliacao.clienteNome}</h4>
                </div>
                <p className="text-gray-700">{avaliacao.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerfilCorretorEdit;
