import { useEffect, useState } from "react"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

function Translate() {
  const [inputText, setInputText] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [chatResponse, setChatResponse] = useState("")
  const [previousChats, setPreviousChats] = useState([])
  const [inputLanguage, setInputLanguage] = useState("russian")
  const [outputLanguage, setOutputLanguage] = useState("french")

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleLanguageChange = (e, type) => {
    const language = e.target.id
    type === "input" ? setInputLanguage(language) : setOutputLanguage(language)
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
        {
          role: "system",
          content: `Only translate from ${inputLanguage} into ${outputLanguage}.`,
        },
        ...previousChats,
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
    <div className="flex-col items-center">
      <section className="side-bar">
        <button onClick={handleNewChat}>New Translation</button>
        <ul className="history">
          {chatHistory.map((message, index) => (
            <li key={index}>{`${message.role}: ${message.text}`}</li>
          ))}
        </ul>
      </section>
      <section className="flex justify-between">
        <div className="flex gap-1" id="group1">
          <input
            type="radio"
            id="russian"
            name="language-input"
            onChange={(e) => handleLanguageChange(e, "input")}
            defaultChecked
          />{" "}
          <label htmlFor="russian">Russian</label>
          <input
            type="radio"
            id="english"
            name="language-input"
            onChange={(e) => handleLanguageChange(e, "input")}
          />{" "}
          <label htmlFor="english">English</label>
          <input
            type="radio"
            id="french"
            name="language-input"
            onChange={(e) => handleLanguageChange(e, "input")}
          />{" "}
          <label htmlFor="french">French</label>
        </div>
        <div className="flex gap-1" id="group2">
          <input
            type="radio"
            id="russian1"
            name="language-output"
            onChange={(e) => handleLanguageChange(e, "output")}
          />
          <label htmlFor="russian">Russian</label>
          <input
            type="radio"
            id="english1"
            name="language-output"
            onChange={(e) => handleLanguageChange(e, "output")}
          />{" "}
          <label htmlFor="english">English</label>
          <input
            type="radio"
            id="french1"
            name="language-output"
            onChange={(e) => handleLanguageChange(e, "output")}
            defaultChecked
          />{" "}
          <label htmlFor="french">French</label>
        </div>
      </section>

      <form onSubmit={handleFormSubmit}>
        <textarea
          name="chat"
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your text..."
        />
        <button type="submit">Translate</button>
      </form>

      <div className="translation">{chatResponse}</div>
      {/* <div>Copied to clipboard</div> */}
    </div>
  )
}

export default Translate
