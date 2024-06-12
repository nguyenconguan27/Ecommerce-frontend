import config from 'src/constants/config'
import http from 'src/utils/http'

export const chatbotApis = {
  chat: (prompt: string) => http.post(`${config.BASEURL}/bot/chat?prompt=${prompt}`)
}
