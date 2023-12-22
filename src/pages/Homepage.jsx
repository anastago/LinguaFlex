import React from "react"
import { Link } from "react-router-dom"
import Navbar from "../components/Navbar"

function Homepage(props) {
  return (
    <div className="flex flex-col h-screen box-border">
      <Navbar></Navbar>
      <div className="flex flex-col h-screen items-center justify-around content-center">
        <div className="flex flex-col items-center justify-center w-4/5 text-blue-800 font-roboto text-center">
          <h1 className="text-6xl font-roboto py-3">
            Empower Your Language Fluency
          </h1>

          <h2 className="text-sky-950 my-8 text-lg">
            Ligaflex is your personal language companion. Tailored to your pace,
            it makes language learning enjoyable, offering an interactive and
            personalized experience.
          </h2>
          <Link
            className="w-46s h-12 bg-blue-100 rounded-full p-7 text-center drop-shadow-lg flex items-center justify-center"
            to="/practice"
          >
            {" "}
            Start speaking{" "}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Homepage
