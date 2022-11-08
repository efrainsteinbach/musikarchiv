import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private authService: AuthService) { }

  @Output()
  loggedIn: EventEmitter<void> = new EventEmitter<void>();

  username: string = "";
  password: string = "";
  working: boolean = false;
  invalidPassword: boolean = false;
  technicalError: boolean = false;

  submit() {
    this.authService.tryLogIn(this.username, this.password)
      .subscribe(res => {
        if (res.success) {
          console.log("Login successful!")
          this.loggedIn.next();
        } else {
          this.invalidPassword = res.invalidCredentials;
          this.technicalError = !res.invalidCredentials;
        }
        this.working = false;
      });
    this.working = true;
  }
}