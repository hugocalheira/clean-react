import { HttpPostClient } from '@/data/protocols/http/http-post-client'

export default class RemoteAuthentication {
  constructor (private readonly url: string, private readonly httpPostClient: HttpPostClient) {
    this.url = url
    this.httpPostClient = httpPostClient
  }

  async auth (): Promise<void> {
    await this.httpPostClient.post(this.url)
  }
}
