import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  get userName() {
    const token = localStorage.getItem('sun_token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const claims = this.jwtHelper.decodeToken(token);
      return claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }
    return '';
  }
  constructor(private jwtHelper: JwtHelperService, private router: Router) { }
  isUserAuthenticated() {
    const token: string = localStorage.getItem('sun_token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      return false;
    }
  }
  logout() {
    localStorage.removeItem('sun_token');
    this.router.navigate(['/']);
  }
}
