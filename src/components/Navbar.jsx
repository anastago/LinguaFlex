import React from "react"
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <div className="sticky top-0 p-1 m-1 h-12 bg-transparent flex items-center justify-between font-roboto">
      <Link to="/" className="">
        LinguaFlex
      </Link>
      <div className="flex justify-around w-1/6">
        <Link to="/practice">Practice</Link>
        {/* <Link to="/translate">Translate</Link> */}
      </div>
    </div>
  )
}

export default Navbar
