import {} from "react"
import { Routes, Route } from "react-router-dom"
import "./App.css"
import Homepage from "./pages/Homepage"
import Practice from "./pages/Practice"
import Translate from "./pages/Translate"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/translate" element={<Translate />} />
      </Routes>
    </>
  )
}

export default App
