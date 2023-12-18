import {} from "react"
import { Routes, Route } from "react-router-dom"
import "./App.css"
import Homepage from "./pages/Homepage"
import Practice from "./pages/Practice"
import Translate from "./pages/Translate"
import { useEffect, useRef, useState } from "react"
import Navbar from "./components/Navbar"

function App() {
  useEffect(() => {
    document.body.classList.add("bg-blue-50")
    document.body.classList.add("box-border")

    // document.body.classList.add("from-cyan-500")
    // document.body.classList.add("to-blue-500")
  }, [])
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/translate" element={<Translate />} />
      </Routes>
    </div>
  )
}

export default App
