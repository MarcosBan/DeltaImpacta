
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Auth from "./Components/Auth"
import DadosUsuario from "./Components/DadosUsuario"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/DadosUsuario" element={<DadosUsuario user="Cainã Tavares"/>} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
