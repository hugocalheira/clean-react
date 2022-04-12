export class EmailInUseError extends Error {
  constructor () {
    super('E-mail já existe')
    this.name = 'EmailInUseError'
  }
}
