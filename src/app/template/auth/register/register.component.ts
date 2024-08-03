import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  getField(control: any) {
    return this.registerForm.get(control);
  }

  onSuccessfulSignUp() {
    this.router.navigate(['/main/dashboard']).then();
  }

  checkForm() {
    if (this.registerForm.valid) {
      this.signUp();
    }
  }

  login() {
    this.router.navigate(['/auth/login']).then();
  }

  signUp() {
    const { email, password, firstName, lastName } = this.registerForm.value;
    this.authService
      .addUsers(email, password, firstName, lastName)
      .then(() => {
        this.openSnackBar('Successful Registration!', '', 2000);
      })
      .catch((err) => {
        this.openSnackBar('Error registering user: ' + err.message, 'ok', 4000);
      });
  }

  openSnackBar(message: string, action: string = '', duration: number = 2000) {
    this.snackBar.open(message, action, { duration });
  }

}
