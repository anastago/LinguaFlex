import React from "react"
import { Link } from "react-router-dom"

function Homepage(props) {
  return (
    <div className="flex flex-col">
      <h1 className="text-gray-300">LinguaFlex</h1>
      <Link to="/practice">
        <h2 className="text-gray-300">Practice</h2>
      </Link>
      <Link to="/translate">
        <h2>Translate</h2>
      </Link>
    </div>
  )
}

export default Homepage
