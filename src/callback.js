import { inject } from 'aurelia-framework'
import { AuthService } from './auth-service'

@inject (
  AuthService
)
export class Callback {     
  constructor(auth) {
    this.message = 'Loading ...'
    this.auth = auth
    this.auth.handleAuthentication()
  }
}
