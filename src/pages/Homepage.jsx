import React from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

function Homepage(props) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Navbar></Navbar>
      <h1 className="text-blue-500 text-6xl font-roboto">
        Your Personal Language Companion
      </h1>

      <h2 className="text-blue-500 m-6">
        Empower your communication skills with LinguaFlex. Tailored to your
        pace, LinguaFlex makes language learning enjoyable, offering an
        interactive and personalized experience.
      </h2>
      <Link to="/practice"> Start speaking </Link>
      {/* <Link to="/translate">
        <h2>Translate</h2>
      </Link> */}
    </div>
  )
}

export default Homepage
