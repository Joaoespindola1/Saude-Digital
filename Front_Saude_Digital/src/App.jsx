import React, { useState } from "react"
import Input from "./components/Input"
import { useNavigate } from "react-router-dom"

function App({ isLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [cpf, setCpf] = useState("")
  const [codigo_corretor, setcodigo_corretor] = useState("")
  const [nome, setNome] = useState("")
  const [endereco, setEndereco] = useState("")
  const [telefone, setTelefone] = useState("")
  const [data_nascimento, setdata_nascimento] = useState("")
  const navigate = useNavigate();

  const registerCliente = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/cadastro_cliente/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf,
          endereco,
          telefone,
          email,
          password,
          data_nascimento,
        }),
      });

      if (response.ok) {
        console.log("Cliente cadastrado com sucesso");
        navigate("/login");
      } else {
        console.error("Erro ao cadastrar cliente");
        alert("Erro ao cadastrar cliente.");
      }
    } catch (error) {
      console.error("Erro no envio dos dados", error);
    }
  };

  const registerCorretor = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/cadastro_corretor/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          cpf,
          endereco,
          telefone,
          email,
          codigo_corretor,
          password,
        }),
      })

      if (response.ok) {
        console.log("Corretor cadastrado com sucesso");
        navigate("/login");
      } else {
        console.error("Erro ao cadastrar corretor");
        alert("Erro ao cadastrar corretor.");
      }
    } catch (error) {
      console.error("Erro no envio dos dados", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          tipo: userType === "cliente" ? 1 : 2,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const userId = data.id; 
        localStorage.setItem("userId", userId);
        console.log("Login efetuado com sucesso:", userId);
  
        navigate(userType === "cliente" ? "/cliente-dashboard" : "/corretor-dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no envio dos dados");
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isLogin) {
      if (email === "" || password === "") {
        alert("Por favor, preencha todos os campos.");
      } else if (userType === "") {
        alert("Por favor, selecione o tipo de usuário.");
      } else {
        handleLogin();
      }
    } else {
      if (userType === "cliente") {
        registerCliente();
      } else if (userType === "corretor") {
        registerCorretor();
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg_bege">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-lg border-2 border-bg_azul_escuro">
        <h1 className="text-3xl font-bold text-center mb-6">{isLogin ? "Saúde Digital" : "Cadastrar-se"}</h1>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <Input
                label="Nome"
                type="text"
                id="nome"
                placeholder="Digite seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <Input
                label="Cidade"
                type="text"
                id="endereco"
                placeholder="Digite seu endereço"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
              <Input
                label="Telefone"
                type="text"
                id="telefone"
                placeholder="Digite seu telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              {/* Campo de data de nascimento apenas para cliente */}
              {userType === "cliente" && (
                <Input
                  label="Data de Nascimento"
                  type="date"
                  id="nascimento"
                  value={data_nascimento}
                  onChange={(e) => setdata_nascimento(e.target.value)}
                />
              )}
            </>
          )}

          <Input
            label="Email"
            type="email"
            id="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            id="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="mb-4 text-center w-full">
            <label className="block text-gray-700 mb-2 text-center">Tipo de Usuário</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="border rounded-md p-2 w-full text-center"
            >
              <option value="">Selecione um tipo</option>
              <option value="cliente">Cliente</option>
              <option value="corretor">Corretor</option>
            </select>
          </div>

          {!isLogin && (
            <Input
              label="CPF"
              type="text"
              id="cpf"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          )}
          {!isLogin && userType === "corretor" && (
            <Input
              label="Código do Corretor"
              type="text"
              id="corretor-code"
              placeholder="Digite o Código do Corretor"
              value={codigo_corretor}
              onChange={(e) => setcodigo_corretor(e.target.value)}
            />
          )}
          <button
            type="submit"
            className="w-full bg-bg_azul_escuro hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
          <button
            type="button"
            className="w-full text-bg_azul_escuro font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => window.location.href = isLogin ? "/register" : "/login"}
          >
            {isLogin ? "Cadastre-se" : "Voltar ao Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
