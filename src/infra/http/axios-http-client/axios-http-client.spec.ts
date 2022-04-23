import { AxiosHttpClient } from './axios-http-client'
import { mockAxios, mockHttpResponse } from '@/infra/test'
import { mockGetRequest, mockPostRequest } from '@/data/test'
import axios, { AxiosResponse } from 'axios'
import { HttpResponse } from '@/data/protocols/http'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpClient
  mockedAxios: jest.Mocked<typeof axios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpClient()
  const mockedAxios = mockAxios()
  return { sut, mockedAxios }
}

const makeHttpResponse = ({ status, data }: AxiosResponse): HttpResponse => ({
  statusCode: status,
  body: data
})

describe('AxiosHttpClient', () => {
  describe('POST', () => {
    test('Should call axios.post with correct values', async () => {
      const request = mockPostRequest()
      const { sut, mockedAxios } = makeSut()
      await sut.post(request)
      expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
    })

    test('Should return correct response on axios.post', async () => {
      const request = mockPostRequest()
      const { sut, mockedAxios } = makeSut()
      const httpResponse = await sut.post(request)
      const axiosResponse = await mockedAxios.post.mock.results[0].value
      expect(httpResponse).toEqual(makeHttpResponse(axiosResponse))
    })

    test('Should return correct error on axios.post', () => {
      const request = mockPostRequest()
      const { sut, mockedAxios } = makeSut()
      mockedAxios.post.mockRejectedValueOnce({ response: mockHttpResponse() })
      const promise = sut.post(request)
      expect(promise).toEqual(mockedAxios.post.mock.results[0].value)
    })
  })

  describe('GET', () => {
    test('Should call axios.get with correct values', async () => {
      const request = mockGetRequest()
      const { sut, mockedAxios } = makeSut()
      await sut.get(request)
      expect(mockedAxios.get).toHaveBeenCalledWith(request.url)
    })

    test('Should return correct response on axios.get', async () => {
      const request = mockGetRequest()
      const { sut, mockedAxios } = makeSut()
      const httpResponse = await sut.get(request)
      const axiosResponse = await mockedAxios.get.mock.results[0].value
      expect(httpResponse).toEqual(makeHttpResponse(axiosResponse))
    })
  })
})
