import { HttpGetClient, HttpGetParams, HttpPostClient, HttpPostParams, HttpResponse, HttpStatusCode } from '../protocols/http'
import faker from '@faker-js/faker'

export const mockPostRequest = (): HttpPostParams => ({
  url: faker.internet.url(),
  body: faker.random.words()
})

export class HttpPostClientSpy<R> implements HttpPostClient<R> {
  url?: string
  body?: any
  response: HttpResponse<R> = {
    statusCode: HttpStatusCode.ok
  }

  async post ({ url, body }: HttpPostParams): Promise<HttpResponse<R>> {
    this.url = url
    this.body = body
    return await Promise.resolve(this.response)
  }
}

export class HttpGetClientSpy implements HttpGetClient {
  url: string
  get = async (params: HttpGetParams): Promise<void> => {
    this.url = params.url
  }
}
