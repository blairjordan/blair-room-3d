import { OpenAI } from "openai"

export class AssistantThread {
  thread = undefined
  currentRunId = undefined
  openAi = undefined
  assistantId = undefined

  constructor(apiKey, assistantId) {
    this.openAi = new OpenAI({
      apiKey,
    })
    this.assistantId = assistantId
  }

  ask = async (question) => {
    if (this.currentRunId) {
      throw new Error(`Current run incomplete:`, this.currentRunId)
    }

    if (!this.thread) {
      this.thread = await this.openAi.beta.threads.create()
      console.info(`Initialising thread:`, this.thread.id)
    }

    try {
      await this.openAi.beta.threads.messages.create(this.thread.id, {
        role: "user",
        content: question,
      })

      const run = await this.openAi.beta.threads.runs.create(this.thread.id, {
        assistant_id: this.assistantId,
      })

      this.currentRunId = run.id

      return this.currentRunId
    } catch (error) {
      console.error("Error calling the OpenAI API:", error)
      return undefined
    }
  }

  poll = async () => {
    if (!this.thread) {
      throw new Error("Thread not initialized")
    }

    if (!this.currentRunId) {
      throw new Error("Run not started")
    }

    return new Promise((resolve, reject) => {
      let attempts = 0

      const intervalId = setInterval(async () => {
        console.info("🔄 Polling attempt ", ++attempts)

        try {
          const currentRun = await this.openAi.beta.threads.runs.retrieve(
            this.thread.id,
            this.currentRunId
          )

          const { status } = currentRun

          switch (status) {
            case "queued":
            case "in_progress":
              console.log("Run in progress")
              break
            case "requires_action":
            case "expired":
            case "cancelling":
            case "cancelled":
            case "failed":
              this.currentRunId = undefined
              clearInterval(intervalId)
              reject(`Run unsuccessful. (status: ${status})`)
              break
            case "completed":
              this.currentRunId = undefined
              const messages = await this.openAi.beta.threads.messages.list(
                this.thread.id
              )
              clearInterval(intervalId)
              const response = messages?.data?.find(
                (msg) => msg.role === "assistant"
              )?.content?.[0]?.text?.value
              resolve(response)
              break
            default:
              clearInterval(intervalId)
              reject("Unknown run status")
              break
          }
        } catch (error) {
          clearInterval(intervalId)
          reject(error)
        }
      }, 5000)
    })
  }
}
