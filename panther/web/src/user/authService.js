import Auth0Lock from 'auth0-lock';
import { EventEmitter } from 'events';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import $ from 'jquery';

export default class AuthService extends EventEmitter {
  constructor(orgDetails) {
    super();
    // Configure Auth0
    this.lock = new Auth0Lock(orgDetails.clientId, orgDetails.domain, {
      theme: {
        title: orgDetails.title,
        logo: orgDetails.logo
      },
      auth: {
        redirectUrl: window.location.origin,
        responseType: 'token'
      }
    });
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this));
    // binds login functions to keep this context
    this.login = this.login.bind(this);
  }

  _doAuthentication(authResult) {
    // Saves the user token
    this.emit('fetching_user', true);
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error);
        this.emit('fetching_user', false);
      } else {
        $.ajax({
         type: "POST",
         url: '/api/auth0/verifyuser',
         dataType: "json",
         data:{"userProfile":JSON.stringify(profile), "org_id" : cookie.load('org_details').org_id},
         success: (response) => {
           this.setToken(response.result);
           if(response.result.first_time){
            browserHistory.replace('/user/updatedetails');
            }else{
              browserHistory.replace('/user/dashboard');
            }
           this.emit('fetching_user', false);
         }
       });
      }
    });
    // navigate to the home route
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  }

  loggedIn() {
    // Checks if there is a saved token and it's still valid
    return !!this.getToken();
  }

  setToken(idToken) {
    // Saves user token to local storage
    // localStorage.setItem('id_token', idToken)
    cookie.save('user_obj', idToken, { path: '/' });
  }

  getToken() {
    // Retrieves the user token from local storage
    return cookie.load('user_obj');
  }

  logout() {
    // Clear user token and profile data from local storage
    cookie.remove('user_obj', { path: '/'});
  }
}
