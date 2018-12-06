import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppSettingsService } from '../services/app-settings.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidLogin: boolean;

  form = this.fb.group({
    Account: [''],
    Password: ['']
  });

  private apiUrlRoot: string;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient
    , appSettingsService: AppSettingsService) {
    this.apiUrlRoot = appSettingsService.AppSettings.ApiUrlRoot;
  }

  ngOnInit() {
  }

  login() {
    this.http.post(this.apiUrlRoot.concat('auth/login'), this.form.value, httpOptions)
      .subscribe(response => {
        const token = (<any>response).Token;
        localStorage.setItem('sun_token', token);
        this.invalidLogin = false;
        this.router.navigate(['/']);
      }, err => {
        this.invalidLogin = true;
      });
  }
  defultAction(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.login();
    }
  }

}
