import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import RemoteAuthentication from './remote-authentication'

/**
 * sut = system under test
 */

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct url', async () => {
    class HttpPostClientSpy implements HttpPostClient {
        url?: string
        async post (url: string): Promise<void> {
          this.url = url
        }
    }
    const url = 'any_url'
    const httpPostClientSpy = new HttpPostClientSpy()
    const sut = new RemoteAuthentication(url, httpPostClientSpy)
    await sut.auth()
    expect(httpPostClientSpy.url).toBe(url)
  })
})
