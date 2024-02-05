import util from "util"
import { v4 as uuidv4 } from "uuid"
import textToSpeech from "@google-cloud/text-to-speech"
import fs from "fs"

const client = new textToSpeech.TextToSpeechClient()

export const convertTextToAudio = async (text) => {
  const fileName = `${uuidv4()}.mp3`
  const dirPath = "./public"
  const filePath = `${dirPath}/${fileName}`

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  const request = {
    input: { text },
    voice: {
      languageCode: "en-AU",
      ssmlGender: "MALE",
      name: "en-AU-Neural2-B",
    },
    audioConfig: { audioEncoding: "MP3" },
  }

  const [response] = await client.synthesizeSpeech(request)

  const writeFile = util.promisify(fs.writeFile)
  await writeFile(filePath, response.audioContent, "binary")

  return fileName
}
