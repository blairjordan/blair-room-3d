import express from "express"
import http from "http"
import cors from "cors"
import dotenv from "dotenv"
import { convertTextToAudio } from "./util/textToSpeech.js"

dotenv.config()

import { Server } from "socket.io"
import { AssistantThread } from "./util/AssistantThread.js"

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.use(express.static("public"))

app.get("/healthz", (req, res) => {
  res.send({
    status: "ok",
  })
})

io.on("connection", async (socket) => {
  console.log("🔌 User connected")

  const assistantThread = new AssistantThread(
    process.env.OPEANAI_API_KEY,
    process.env.OPEANAI_ASSISTANT_ID
  )

  try {
    await assistantThread.initializeThread()
  } catch (error) {
    console.error("Error initializing thread:", error)
    socket.emit("receiveMessage", {
      id: Date.now(),
      error: "Failed to initialize assistant thread. Please try again later.",
      from: "server",
    })
    return
  }

  socket.on("disconnect", () => {
    console.log("🛑 User disconnected")
  })

  socket.on("sendMessage", async (message) => {
    console.info("🗨️ Message received: ", message)

    const text = message?.text

    if (!text || typeof text !== "string") {
      console.error(
        "Invalid message format. 'text' must be a non-empty string."
      )
      socket.emit("receiveMessage", {
        id: Date.now(),
        error: "Invalid message format. 'text' must be a non-empty string.",
        from: "server",
      })

      return
    }

    try {
      const response = await assistantThread.ask(text)
      console.info("⬅️ Assistant response: ", response)

      socket.emit("receiveMessage", {
        id: Date.now(),
        text: response,
        from: process.env.SENDER_FROM,
      })

      if (response) {
        const audioFile = await convertTextToAudio(response)

        console.info("🔊 Converted text to audio", audioFile)

        socket.emit("receiveMessage", {
          id: Date.now(),
          audioFile,
          from: process.env.SENDER_FROM,
        })
      }
    } catch (error) {
      console.error("Error handling message:", error)
      socket.emit("receiveMessage", {
        id: Date.now(),
        error: "An error occurred. Please try again later.",
        from: "server",
      })
    }
  })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
