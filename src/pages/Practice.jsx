import { useEffect, useRef, useState } from "react"
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
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedDialect, setSelectedDialect] = useState("")

  const recognition = useRef()

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
    getResponse()
  }

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    // SpeechRecognitionEvent.current =
    //   window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    recognition.current = new SpeechRecognition()

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      console.log("User said:", transcript)
      setInputText(transcript)
    }

    recognition.current.onspeechend = function () {
      recognition.current.stop()
    }

    recognition.current.onerror = function (event) {
      console.error("Error occurred in recognition:", event.error)
    }

    // speechRecognitionList.current = new SpeechGrammarList.current();
  }
  useEffect(() => {
    initSpeechRecognition()

    return () => {
      recognition.current.stop()
    }
  }, [])

  const startSpeechRecognition = () => {
    console.log("Starting speech recognition...")
    recognition.current.start()
  }

  const getResponse = async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are my conversation partner. Engage in a conversation adapted to my language level, be proactive, suggest topics and ask questions. Detect the input language and correct my mistakes in a polite way. Don't mention that you're a AI language model, say that you're a chat bot. Don't suggest assistance, the main goal is to practice language speaking.",
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

    setPreviousChats((prevChats) => [
      ...prevChats,
      { role: "user", content: inputText },
      { role: "assistant", content: response.choices[0].message.content },
    ])
    setInputText("")
  }

  const updateLanguage = (e) => {
    const selectedLang = e.target.value
    setSelectedLanguage(selectedLang)
    setSelectedDialect("")
  }

  const updateDialect = (e) => {
    const selectedDial = e.target.value
    setSelectedDialect(selectedDial)
  }

  const langs = [
    ["Afrikaans", "af-ZA"],
    ["Amharic", "am-ET"],
    ["Azerbaijani", "az-AZ"],
    ["Bengali", "bn-IN"],
    ["Bahasa Indonesia", "id-ID"],
    ["Bahasa Melayu", "ms-MY"],
    ["Catalan", "ca-ES"],
    ["Czech", "cs-CZ"],
    ["Danish", "da-DK"],
    ["German", "de-DE"],
    ["English", "en-US"],
    ["Spanish", "es-ES"],
    ["Basque", "eu-ES"],
    ["Filipino", "fil-PH"],
    ["French", "fr-FR"],
    ["Javanese", "jv-ID"],
    ["Galician", "gl-ES"],
    ["Gujarati", "gu-IN"],
    ["Croatian", "hr-HR"],
    ["IsiZulu", "zu-ZA"],
    ["Icelandic", "is-IS"],
    ["Italian", "it-IT"],
    ["Kannada", "kn-IN"],
    ["Khmer", "km-KH"],
    ["Latvian", "lv-LV"],
    ["Lithuanian", "lt-LT"],
    ["Malayalam", "ml-IN"],
    ["Marathi", "mr-IN"],
    ["Hungarian", "hu-HU"],
    ["Lao", "lo-LA"],
    ["Dutch", "nl-NL"],
    ["Nepali", "ne-NP"],
    ["Norwegian Bokmål", "nb-NO"],
    ["Polish", "pl-PL"],
    ["Portuguese", "pt-PT"],
    ["Romanian", "ro-RO"],
    ["Sinhala", "si-LK"],
    ["Slovak", "sk-SK"],
    ["Slovenian", "sl-SI"],
    ["Sundanese", "su-ID"],
    ["Slovenčina", "sk-SK"],
    ["Finnish", "fi-FI"],
    ["Swedish", "sv-SE"],
    ["Swahili", "sw-TZ"],
    ["Georgian", "ka-GE"],
    ["Armenian", "hy-AM"],
    ["Tamil", "ta-IN"],
    ["Telugu", "te-IN"],
    ["Vietnamese", "vi-VN"],
    ["Turkish", "tr-TR"],
    ["Urdu", "ur-PK"],
    ["Greek", "el-GR"],
    ["Bulgarian", "bg-BG"],
    ["Russian", "ru-RU"],
    ["Serbian", "sr-RS"],
    ["Ukrainian", "uk-UA"],
    ["Korean", "ko-KR"],
    ["Chinese", "cmn-Hans-CN"],
    ["Japanese", "ja-JP"],
    ["Hindi", "hi-IN"],
    ["Thai", "th-TH"],
  ]

  return (
    <div className="flex-col min-h-screen">
      <button onClick={handleNewChat}>New Practice Chat</button>
      <div>
        <label htmlFor="languages">Choose a language</label>
        <select
          id="languages"
          onChange={updateLanguage}
          value={selectedLanguage}
        >
          <option value="">Select Language</option>
          {langs.map(([lang, id], index) => (
            <option key={index} value={id}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="conversation-history">
        {previousChats.map((chat, index) => (
          <div
            key={index}
            className={chat.role === "assistant" ? "assistant" : "user"}
          >
            {chat.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleFormSubmit}>
        <input
          className="w-2/3"
          name="chat"
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={startSpeechRecognition}>Start Speech Recognition</button>

      {/* <div className="response">{chatResponse}</div> */}
    </div>
  )
}

export default Practice
