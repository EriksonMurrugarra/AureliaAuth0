import { PLATFORM } from 'aurelia-pal'
import { AuthService } from './auth-service'
import { inject } from 'aurelia-dependency-injection'
import { EventAggregator } from 'aurelia-event-aggregator'
import { AuthEvent  } from './auth-event'

@inject (
  AuthService,
  EventAggregator
)
export class App {
  constructor (auth, ea) {
    this.message = 'Hello World!'
    this.auth = auth
    this.authenticated = this.auth.isAuthenticated()
    // this.auth.authNotifier.on('authChange', authState => {
    //   this.authenticated = authState.authenticated
    // })
    this.ea = ea
    this.ea.subscribe(AuthEvent, auth => {
      this.authenticated = auth
    })
  }

  configureRouter(config, router) {
    config.options.pushState = true;
    config.map([
      {
        route: ['', 'home'],
        name: 'home',
        moduleId: 'home',
        nav: true,
        title: 'Home'
      },
      {
        route: 'callback',
        name: 'callback',
        moduleId: 'callback',
        nav: false,
        title: 'Callback'
      }
    ])
  }

}
