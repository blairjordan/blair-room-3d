import OpenAI from "openai"

export class AssistantThread {
  constructor(apiKey, assistantId) {
    if (!apiKey || !assistantId) {
      throw new Error("API key and Assistant ID are required")
    }

    this.openAi = new OpenAI({
      apiKey,
    })

    this.assistantId = assistantId
    this.threadId = null
    this.conversationHistory = []
  }

  async initializeThread() {
    try {
      const thread = await this.openAi.beta.threads.create()
      this.threadId = thread.id
      console.log("Initialized thread with ID:", this.threadId)
    } catch (error) {
      console.error("Failed to initialize thread:", error.message)
      throw new Error("Could not initialize thread.")
    }
  }

  async ask(question) {
    if (!this.threadId) {
      throw new Error(
        "Thread is not initialized. Call initializeThread() first."
      )
    }

    try {
      await this.openAi.beta.threads.messages.create(this.threadId, {
        role: "user",
        content: question,
      })

      let response = ""

      const stream = this.openAi.beta.threads.runs.stream(this.threadId, {
        assistant_id: this.assistantId,
      })

      for await (const chunk of stream) {
        if (chunk.event === "thread.run.failed") {
          console.error("Thread run failed:", chunk.data)
          throw new Error(`Thread run failed: ${JSON.stringify(chunk.data)}`)
        }

        if (
          chunk.event === "thread.message.delta" &&
          chunk.data?.delta?.content
        ) {
          const textParts = chunk.data.delta.content
            .filter((c) => c.type === "text")
            .map((c) => c.text?.value)
            .join("")
          response += textParts
        }
      }

      this.conversationHistory.push({
        role: "assistant",
        content: response,
      })

      return response
    } catch (error) {
      console.error("Error in assistant response:", error)
      throw new Error(
        `Failed to get a response from the assistant. ${error.message}`
      )
    }
  }

  resetConversation() {
    this.threadId = null
    this.conversationHistory = []
  }
}
