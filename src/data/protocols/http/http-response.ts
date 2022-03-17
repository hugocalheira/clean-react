export enum HttpStatusCode {
  noContent = 204,
  unauthorized = 401,
  ok = 200
}

export type HttpResponse = {
  statusCode: HttpStatusCode
  body?: any
}
