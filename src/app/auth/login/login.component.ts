import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from "../../layouts/shared/base.component";
import { User } from "../user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {

  loginForm: FormGroup;
  color = 'primary';
  value = 50;
  isLoggingIn = false;
  usernameError = '';
  passwordErr = '';
  showLoader = false;
  showPassword = false;

  constructor(public toastrService: ToastrService, private authService: AuthService, formBuilder: FormBuilder, private router: Router) {
    super(toastrService);
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  TogleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  clearError(){
    setTimeout(() => {
      this.usernameError = '';
      this.passwordErr = '';
      this.showLoader = false;
      this.isLoggingIn = false;
    }, 2000)
  }

  login() {
    this.showLoader = true;
    this.isLoggingIn = true;
    if (this.loginForm.invalid) {
      const { username, password } = this.loginForm.value;
      if (username === '') this.usernameError = 'username is required'
      if (password === '') this.passwordErr = "password is required"

      this.clearError();
      return;
    }
    this.isLoggingIn = true;
    this.authService.login(this.loginForm.controls.username.value, 
      this.loginForm.controls.password.value).subscribe(response => {
      this.isLoggingIn = false;
      let user = new User()
      user.id = response.user_uniqueid;
      user.username = response.user_name;
      user.name = response.name;
      this.authService.setCurrentUser(user);
      
      this.authService.saveToken(response).subscribe(_ => {
        
        this.router.navigate(['/']);
      }, error => {
        
        this.error(error);
      });
    }, error => {
      if(error.status == 400){
      this.isLoggingIn = false;
      this.showLoader=false;
      this.usernameError='wrong username or password';
      this.clearError();
    
      }
    });
  }

}
