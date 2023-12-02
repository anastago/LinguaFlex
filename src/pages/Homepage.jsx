import React from "react"
import { Link } from "react-router-dom"

function Homepage(props) {
  return (
    <div>
      LinguaFlex
      <Link to="/practice">
        <h2>Practice</h2>
      </Link>
      <Link to="/translate">
        <h2>Translate</h2>
      </Link>
    </div>
  )
}

export default Homepage
