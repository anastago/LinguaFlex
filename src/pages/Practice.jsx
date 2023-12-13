import { useEffect, useRef, useState } from "react"
import { OpenAI } from "openai"
import micro from "../assets/microphone-2-svgrepo-com.svg"
import send from "../assets/send-alt-1-svgrepo-com.svg"

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

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const userMessage = inputText || speechInput

    if (!isRecognitionOn && userMessage.trim() !== "") {
      getResponse(userMessage)
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

    setChatResponse(response.choices[0].message.content)

    setPreviousChats((prevChats) => [
      ...prevChats,
      { role: "user", content: userMessage },
      { role: "assistant", content: response.choices[0].message.content },
    ])
    setInputText("")
    setSpeechInput("")
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
    <div className="flex flex-col min-h-screen intems-center">
      <button onClick={handleNewChat} className="text-sky-950 mr-auto">
        New Practice Chat
      </button>
      <div>
        <label htmlFor="languages" className="text-sky-950 ml-auto">
          {/* Choose a language */}
        </label>
        <select
          id="languages"
          onChange={updateLanguage}
          value={selectedLanguage}
        >
          <option value="" className="text-sky-950 bg-transparent">
            Select Language
          </option>
          {langs.map(([lang, id], index) => (
            <option key={index} value={id}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="p-2 w-3/5 border m-auto rounded bg-transparent text-sky-950 font-roboto">
        <div className="flex-col-reverse min-h-full">
          {previousChats.map((chat, index) => (
            <div
              key={index}
              className={chat.role === "assistant" ? "assistant" : "user"}
            >
              {chat.content}
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={handleFormSubmit}>
            <textarea
              className="resize-y w-full border-0 h-32 p-5 bottom-1.5 rounded bg-transparent text-sky-950 font-roboto hover:bg-blue-100"
              name="chat"
              type="text"
              value={inputText || speechInput}
              onChange={handleInputChange}
              placeholder="Type your message..."
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
