const express = require("express")
const http = require("http")
const cors = require("cors")
const socketIo = require("socket.io")

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

app.get("/healthz", (req, res) => {
  res.send({
    status: "ok",
  })
})

io.on("connection", (socket) => {
  console.log("A user connected")

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })

  socket.on("sendMessage", (msg) => {
    console.log(msg)
    io.emit("sendMessage", msg)
  })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
