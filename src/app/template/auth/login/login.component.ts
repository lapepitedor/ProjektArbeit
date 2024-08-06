import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoginService } from 'src/app/core/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('300ms')),
      transition('0 => 1', animate('900ms')),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    public authService: AuthService,
    private router: Router,
    public userService: LoginService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    setTimeout(() => this.scrollTop());
  }

  scrollTop() {
    const element = document.getElementById('content');
    element?.scrollIntoView();
  }
    
  signUp() {
    this.router.navigate(['/auth/sign-up']).then();
  }

  tryLogin() {
    const { email, password } = this.loginForm.value;
    this.authService
      .doLogin(email, password)
      .then((res: any) => {
        this.userService.setUser(res.user);
        this.snackBar.open('Login Successful!', '', { duration: 2000 });
        this.router.navigate(['/main/dashboard']);
      })
      .catch((err) => console.log(err));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.tryLogin();
    }
  }

  getField(control: any) {
    return this.loginForm.get(control);
  }
}
