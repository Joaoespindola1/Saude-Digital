import { useState } from 'react';

function Chat() {
  const [isOpen, setIsOpen] = useState(false); // Estado para abrir/fechar o popup
  const [selectedConversation, setSelectedConversation] = useState(null); // Estado para a conversa selecionada
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Em produção'}
  ]);

  const [messages, setMessages] = useState();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setSelectedConversation(null); // Fecha a conversa aberta se o chat for fechado
  };

  const openConversation = (id) => {
    setSelectedConversation(id);
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Botão de Abrir Chat */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-bg_azul_escuro text-white rounded-full p-4 shadow-md"
        >
          Chat
        </button>
      )}

      {/* Popup de Chat */}
      {isOpen && (
        <div className="bg-white border rounded-lg shadow-lg w-80 h-96 p-4 relative">
          {/* Botão de Fechar */}
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 bg-gray-200 text-gray-600 rounded-full p-2 hover:bg-gray-300"
          >
            X
          </button>

          {/* Lista de Conversas */}
          {!selectedConversation && (
            <div>
              <h2 className="text-lg font-bold mb-4">Conversas</h2>
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="p-2 border-b cursor-pointer hover:bg-gray-100"
                  
                >
                  <p className="font-bold">{conversation.name}</p>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tela de Mensagens */}
          {selectedConversation && (
            <div>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-sm text-blue-500 mb-2"
              >
                ← Voltar
              </button>
              <div className="h-64 overflow-y-auto mb-4">
                {messages[selectedConversation]?.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      message.from === 'Você' ? 'text-right' : 'text-left'
                    }`}
                  >
                    <p className="text-sm font-bold">{message.from}</p>
                    <p className="text-sm bg-gray-200 inline-block rounded p-2">
                      {message.text}
                    </p>
                    <p className="text-xs text-gray-500">{message.timestamp}</p>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Digite uma mensagem..."
                className="border rounded w-full p-2"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Chat
