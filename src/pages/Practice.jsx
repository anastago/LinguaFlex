import { useEffect, useRef, useState } from "react"
import { OpenAI } from "openai"
import micro from "../assets/microphone-2-svgrepo-com.svg"
import send from "../assets/send-alt-1-svgrepo-com.svg"
import Navbar from "../components/Navbar"
import TextareaAutosize from "react-textarea-autosize"
import { Link } from "react-router-dom"

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

function Practice() {
  const [inputText, setInputText] = useState("")
  const [chatResponse, setChatResponse] = useState("")
  const [previousChats, setPreviousChats] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [speechInput, setSpeechInput] = useState("")
  const [isRecognitionOn, setRecognitionOn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userMessage, setUserMessage] = useState("")

  const recognition = useRef()

  const handleInputChange = (e) => {
    setInputText(e.target.value)
  }

  const handleNewChat = (e) => {
    e.preventDefault()
    setInputText("")
    setChatResponse("")
    setPreviousChats([])
    setSelectedLanguage("")
  }

  useEffect(() => {
    if (!isRecognitionOn && userMessage) {
      getResponse(userMessage)
    }
  }, [isRecognitionOn, userMessage])

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const message =
      (inputText && inputText.trim()) || (speechInput && speechInput.trim())

    if (!isRecognitionOn && message) {
      setUserMessage(message)
    }
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
      setSpeechInput(transcript)
    }

    recognition.current.onspeechend = function () {
      setRecognitionOn(false)
      recognition.current.stop()
    }

    recognition.current.onerror = function (event) {
      console.error("Error occurred in recognition:", event.error)
      setRecognitionOn(false)
      setSpeechInput("")
    }

    // speechRecognitionList.current = new SpeechGrammarList.current();
  }
  useEffect(() => {
    initSpeechRecognition()
    recognition.current.lang = selectedLanguage

    return () => {
      recognition.current.stop()
    }
  }, [selectedLanguage])

  const startSpeechRecognition = () => {
    console.log("Starting speech recognition...")
    setRecognitionOn(true)
    recognition.current.start()
  }

  const getResponse = async (userMessage) => {
    console.log("Waiting for API response...")
    setIsLoading(true)

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are my conversation partner in learning of ${selectedLanguage}, adapted to my language level. Be proactive, suggest topics and ask questions. Detect the input language and correct my mistakes in a polite way. Don't mention that you're a AI language model, say that you're a chat bot. Don't suggest assistance, the main goal is to practice language speaking.`,
        },
        ...previousChats,
        { role: "user", content: userMessage },
      ],
      temperature: 1,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 2,
      presence_penalty: 1,
    })
    console.log("API responce received")
    setIsLoading(false)

    setChatResponse(response.choices[0].message.content)

    setPreviousChats((prevChats) => [
      ...prevChats,
      { role: "user", content: userMessage },
      { role: "assistant", content: response.choices[0].message.content },
    ])
    setInputText("")
    setSpeechInput("")
    setUserMessage("")
    console.log(previousChats)
  }

  const updateLanguage = (e) => {
    const selectedLang = e.target.value
    setSelectedLanguage(selectedLang)
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
    <div className="flex flex-col h-screen">
      <div className="sticky top-2 p-2 m-2 h-12 flex font-roboto justify-between text-sky-950">
        {" "}
        <button
          onClick={handleNewChat}
          className="w-36 h-12 hover:bg-blue-100 rounded-full p-3 text-center"
        >
          New Chat
        </button>
        <Link className="w-36 h-12 hover:bg-blue-100 rounded-full p-3 text-center">
          About
        </Link>
      </div>
      {/* <div className="flex flex-col flex-1"></div> */}
      <div className="flex flex-col overflow-hidden flex-1 w-3/5 s m-auto border rounded bg-transparent text-sky-950 font-roboto relative bottom-10">
        <div className="m-auto">
          <label htmlFor="languages" className="">
            {/* Choose a language */}
          </label>
          <select
            className="w-52 h-12 bg-blue-50 hover:bg-blue-100 rounded-full p-3 text-center appearance-none"
            id="languages"
            onChange={updateLanguage}
            value={selectedLanguage}
          >
            <option value="" className="text-sky-950 bg-transparent">
              Detect Language
            </option>
            {langs.map(([lang, id], index) => (
              <option key={index} value={id}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-col-reverse overflow-y-auto flex-1 text-left relative">
          {previousChats.map((chat, index) => (
            <div key={index} className="">
              {chat.role === "user" && (
                <span className="p-0-1">{chat.content}</span>
              )}
              {chat.role === "assistant" && (
                <span className="p-0-1">{chat.content}</span>
              )}
            </div>
          ))}
          {userMessage && <div>{userMessage}</div>}
          {isLoading && <div>Thinking...</div>}
        </div>
        <div className="w-full sticky overflow-y-hidden">
          <form
            onSubmit={handleFormSubmit}
            className="flex w-full justify-end items-center sticky border rounded-full"
          >
            <TextareaAutosize
              autoFocus
              className="flex-1 p-1 resize-none outline-none overflow-y-hidden border-0 rounded bg-transparent text-sky-950 font-roboto"
              name="chat"
              type="text"
              value={inputText || speechInput}
              onChange={handleInputChange}
              placeholder="Write your message..."
            />

            {inputText || speechInput ? (
              <button type="submit">
                {" "}
                <img
                  src={send}
                  className="h-16 w-16 p-3 hover:bg-white rounded-full"
                ></img>{" "}
              </button>
            ) : (
              <button
                onClick={startSpeechRecognition}
                className={`h-16 w-16 p-3 hover:bg-blue-300 rounded-full ${
                  isRecognitionOn ? "bg-blue-300" : "bg-transperent"
                }`}
              >
                <img src={micro}></img>{" "}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Practice
