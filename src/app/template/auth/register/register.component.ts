import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoginService } from 'src/app/core/service/login.service';
import { expense_categories } from 'src/app/shared/constants/expense-constants';

import { Firestore, addDoc, collection, doc, getDocs, query, setDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { L } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent
{
    registerForm: FormGroup;
    defaultExpenses: string[] = expense_categories;//a revoir

    constructor(
        public authService: AuthService,
        private formBuilder: FormBuilder,
        private loginService: LoginService,
        private router: Router,
        private snackBar: MatSnackBar,
        private firestore: AngularFirestore
    )
    {
        this.createForm();
    }

    createForm()
    {
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(1)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    signUp()
    {
        const { email, password } = this.registerForm.value;
        this.authService.doRegister(email, password).then((res: any) =>
        {
            this.loginService.setUser(res.user);
            this.loginService.setUserId(res.user.uid);
            this.setUserInformation(res.user.uid);
            this.openSnackBarSuccess();
            this.onSuccessfulSignUp();
        },
            (err) =>
            {
                this.openSnackBarError('Email already exists!');
            }
        );
    }

    openSnackBarSuccess()
    {
        this.snackBar.open('Successful Registration!', '', { duration: 2000 });
    }

    openSnackBarError(message: string)
    {
        this.snackBar.open(message, 'ok', { duration: 4000 });
    }

    onSuccessfulSignUp()
    {
        this.router.navigate(['/main/dashboard']).then();
    }

    checkForm()
    {
        if (this.registerForm.valid)
        {
            this.signUp();
        }
    }

    login()
    {
        this.router.navigate(['/auth/login']).then();
    }

    getField(control: any)
    {
        return this.registerForm.get(control);
    }

    async setUserInformation(userId: string)
    {
        let dict = {
            email: this.registerForm.value.email,
            firstName: this.registerForm.value.firstName,
            lastName: this.registerForm.value.lastName,         
        }

        const docRef = await setDoc(doc(collection(this.firestore.firestore, 'users'), userId), dict);
        console.log(docRef);

        this.defaultExpenses.forEach(async element =>
        {
            let dict = {
                name: element
            };

            let catRef = await addDoc(collection(this.firestore.firestore, `users/${userId}/categories`), dict);
        });

        
    }

    scrollTop()
    {
        const element = document.getElementById('content');
        element!.scrollIntoView();
    }
}
