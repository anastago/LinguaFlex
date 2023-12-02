import React, { useState } from "react"
import { OpenAI } from "openai"

function Translate() {
  const [inputText, setInputText] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }
}

export default Translate
