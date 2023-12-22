import { useEffect, useRef, useState } from "react"
import { OpenAI } from "openai"

import Navbar from "../components/Navbar"
import TextareaAutosize from "react-textarea-autosize"
import { Link } from "react-router-dom"
import { MicrophoneIcon } from "@heroicons/react/24/outline"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

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
          content: `You are my conversation partner in learning of ${selectedLanguage}, adapted to my language level. Be proactive, suggest topics and ask questions. Detect the input language and always correct my mistakes, tell me how the phrases should've been structured, do it in a polite way. If in my texts there are mistakes or typos, always correct it. Say that you're a chat bot, do not mention that you're a AI language model. Don't suggest assistance, the main goal is to practice language speaking.`,
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
    <div className="flex flex-col h-screen box-border">
      <div className="sticky p-2 h-14 flex font-roboto justify-between text-sky-950">
        <button
          onClick={handleNewChat}
          className="w-36 h-12 hover:bg-blue-100 rounded-full p-3 text-center drop-shadow-lg"
        >
          New Chat
        </button>
        <div className="m-auto relative">
          <select
            className="w-52 h-12 bg-blue-50 hover:bg-blue-100 rounded-full p-3 text-center appearance-none hover:drop-shadow-lg"
            id="languages"
            onChange={updateLanguage}
            value={selectedLanguage}
          >
            <option value="" className="text-sky-950 bg-transparent">
              Detect Language{" "}
            </option>
            {langs.map(([lang, id], index) => (
              <option key={index} value={id}>
                {lang}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-6 " />
        </div>
        <Link
          to="/about"
          className="w-36 h-12 hover:bg-blue-100 rounded-full p-3 text-center drop-shadow-lg"
        >
          About
        </Link>
      </div>
      {/* <div className="flex flex-col flex-1"></div> */}
      <div className="flex flex-col overflow-hidden flex-1 w-3/5 m-auto rounded text-sky-950 font-roboto">
        <div className="flex flex-col overflow-y-auto flex-1 text-left gap-6 pb-8">
          {previousChats.map((chat, index) => (
            <div key={index} className="">
              {chat.role === "user" && (
                <div className="p-0-1">{chat.content}</div>
              )}
              {chat.role === "assistant" && (
                <div className="p-0-1">{chat.content}</div>
              )}
            </div>
          ))}
          {userMessage && <div>{userMessage}</div>}
          {isLoading && <div className="text-slate-500">Thinking...</div>}
        </div>
        <div className="w-full sticky">
          <form
            onSubmit={handleFormSubmit}
            className="flex w-full justify-end items-center sticky border rounded-full mb-6 -mt-3 shadow-lg bg-white p-1 overflow-hidden"
          >
            <TextareaAutosize
              autoFocus
              className="flex-1 px-6 h-16 resize-none outline-none border-0 rounded bg-transparent text-sky-950 font-roboto"
              name="chat"
              type="text"
              value={inputText || speechInput}
              onChange={handleInputChange}
              placeholder="Write your message..."
            />

            {inputText || speechInput ? (
              <button
                type="submit"
                className="h-16 w-16 hover:bg-blue-100 rounded-full flex items-center justify-center "
              >
                {" "}
                <PaperAirplaneIcon className="h-7 w-7 text-blue-800" />
              </button>
            ) : (
              <button
                onClick={startSpeechRecognition}
                className={`h-16 w-16 hover:bg-blue-100 rounded-full flex items-center justify-center ${
                  isRecognitionOn ? "bg-blue-300" : "bg-transperent"
                }`}
              >
                {" "}
                <MicrophoneIcon className="h-7 w-7 text-blue-800"></MicrophoneIcon>
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Practice
