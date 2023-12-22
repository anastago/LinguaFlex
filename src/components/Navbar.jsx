import React from "react"
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className="sticky p-2 h-14 flex font-roboto justify-between text-sky-950">
      <Link
        to="/"
        className="w-36 h-12 rounded-full p-3 text-center drop-shadow-l"
      >
        LinguaFlex
      </Link>

      <Link
        to="/about"
        className="w-36 h-12 rounded-full p-3 text-center drop-shadow-lg hover:bg-blue-100 "
      >
        About
      </Link>
    </div>
  )
}

export default Navbar
