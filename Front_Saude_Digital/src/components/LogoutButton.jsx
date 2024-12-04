import { LogOut } from 'lucide-react'
import { useNavigate } from "react-router-dom"


const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white hover:bg-red-700 text-black border-2 border-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
    >
      <LogOut />
    </button>
  )
}

export default LogoutButton
