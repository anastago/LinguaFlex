import { useState } from "react"
import { OpenAI } from "openai"

function Practice() {
  const [inputText, setInputText] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleNewChat = () => {
    if (inputText.trim() !== "") {
      setChatHistory([...chatHistory, { text: inputText, user: "You" }])
      setInputText("")
    }
  }

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  })
  const practice = async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      prompt:
        "You are my personalized chatbot and you help me learn the language I am learning. You are my conversation partner and we should have a real conversation adapted to my language level. Detect my input language, it's the language I am learning.",
      messages: chatHistory.map((chat) => ({
        role: "system",
        content: chat.text,
      })),

      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
    })

    console.log(response)
  }

  return (
    <div className="practice-container">
      <section className="side-bar">
        <button onClick={handleNewChat}>New Practice Chat</button>
        <ul className="history">
          {chatHistory.map((chat, index) => (
            <li key={index}>{`${chat.user}: ${chat.text}`}</li>
          ))}
        </ul>
      </section>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type your message..."
      />
      <section className="main"></section>
    </div>
  )
}

export default Practice
