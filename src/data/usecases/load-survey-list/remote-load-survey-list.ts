import { HttpGetClient } from '@/data/protocols/http'

export class RemoteLoadSurveyList {
  constructor (
    private readonly url: string,
    private readonly httpGetClient: HttpGetClient
  ) {}

  loadAll = async (): Promise<void> => {
    await this.httpGetClient.get({ url: this.url })
  };
}
