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

io.on("connection", (socket) => {
  console.log("🔌 User connected")
  const assistantThread = new AssistantThread(
    process.env.OPEANAI_API_KEY,
    process.env.OPEANAI_ASSISTANT_ID
  )

  socket.on("disconnect", () => {
    console.log("🛑 User disconnected")
  })

  socket.on("sendMessage", async (message) => {
    console.info("🗨️ Message received: ", message)

    socket.emit("receiveMessage", message)

    try {
      await assistantThread.ask(message.text)
      const response = await assistantThread.poll()

      console.info("⬅️ Response: ", response)
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
      socket.emit("receiveMessage", {
        id: Date.now(),
        error: "An error occured. Please try again later.",
        from: "server",
      })
      console.error(error)
    }
  })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
