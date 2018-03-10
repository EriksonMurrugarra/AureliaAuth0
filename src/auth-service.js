import auth0 from 'auth0-js'
import { inject } from 'aurelia-framework'
import { Router } from 'aurelia-router'
import { EventAggregator } from 'aurelia-event-aggregator'
import { AuthEvent  } from './auth-event'

@inject (
  Router,
  EventAggregator
)
export class AuthService {

  auth0 = new auth0.WebAuth({
    domain: 'eriksonmurrugarra.auth0.com',
    clientID: 'LBmldq5O0XHPYz4SAyMr03ThgfMOiHs7',
    redirectUri: 'http://localhost:9000/callback',
    audience: 'https://eriksonmurrugarra.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  })

  constructor (router, ea) {
    this.router = router
    this.ea = ea
  }

  login () {
    this.auth0.authorize()
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.router.navigate('home');
        this.ea.publish(new AuthEvent(true))
        // this.authNotifier.emit('authChange', { authenticated: true });

      } else if (err) {
        console.log(err);
      }
    });
  }

  setSession(authResult) {
    // Set the time that the Access Token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.ea.publish(new AuthEvent(false))
    this.router.navigate('home')
    
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
