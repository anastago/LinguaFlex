import { useEffect, useState } from "react"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

function Practice() {
  const [inputText, setInputText] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [chatResponse, setChatResponse] = useState("")
  const [previousChats, setPreviousChats] = useState([])

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleNewChat = (e) => {
    e.preventDefault()

    if (inputText.trim() !== "") {
      setChatHistory([...chatHistory, { role: "user", text: inputText }])
      setInputText("")
      setChatResponse("")
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    practice()
  }

  const practice = async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...previousChats,
        {
          role: "system",
          content:
            "You are my conversation partner. Let's engage in a conversation adapted to my language level. Detect the input language and assist in correcting any mistakes.",
        },
        { role: "user", content: inputText },
      ],
      temperature: 1,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 2,
      presence_penalty: 1,
    })

    setChatResponse(response.choices[0].message.content)

    setPreviousChats([
      ...previousChats,
      { role: "user", content: inputText },
      { role: "assistant", content: response.choices[0].message.content },
    ])
    console.log(previousChats)
  }

  return (
    <div className="practice-container">
      <section className="side-bar">
        <button onClick={handleNewChat}>New Practice Chat</button>
        <ul className="history">
          {chatHistory.map((message, index) => (
            <li key={index}>{`${message.role}: ${message.text}`}</li>
          ))}
        </ul>
      </section>

      <form onSubmit={handleFormSubmit}>
        <input
          name="chat"
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Submit</button>
      </form>

      <div className="response">{chatResponse}</div>
    </div>
  )
}

export default Practice
