require("dotenv").config()
const OpenAI = require("openai")

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
})

const ask = async (question) => {
  try {
    // const thread = await openai.beta.threads.create()

    // const message = await openai.beta.threads.messages.create(thread.id, {
    //   role: "user",
    //   content: question,
    // })

    // const run = await openai.beta.threads.runs.create(thread.id, {
    //   assistant_id: process.env.ASSISTANT_ID,
    // })

    // const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)

    // console.log(runStatus)

    // Once complete:
    const messages = await openai.beta.threads.messages.list(
      "thread_T8GJLkh0FHNvf3IbPtmPkbpJ"
    )
    console.log(JSON.stringify(messages))
  } catch (error) {
    console.error("Error calling the OpenAI API:", error)
  }
}

ask("Tell me about yourself")
