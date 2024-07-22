import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '@angular/fire/auth';
import firebase from 'firebase/compat/app';


@Injectable({
    providedIn: 'root'
})
export class AuthService
{

    constructor(
        public afAuth: AngularFireAuth
    ) { }

    doRegister(email: string, password: string): Promise<firebase.auth.UserCredential>
    {
        return this.afAuth.createUserWithEmailAndPassword(email, password);
    }

    doLogin(email: string, password: string): Promise<firebase.auth.UserCredential>
    {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    doLogout(): Promise<void>
    {
        return this.afAuth.signOut();
    }

    authLogin(provider: any)
    {
        return this.afAuth
            .signInWithPopup(provider)
            .then((result) =>
            {
                console.log('You have been successfully logged in!');
            })
            .catch((error) =>
            {
                console.log(error);
            });
    }

    checkLogin(): Promise<User>
    {
        return new Promise<any>((resolve, reject) =>
        {
            this.afAuth.onAuthStateChanged(function (user)
            {
                if (user)
                {
                    resolve(user);
                } else
                {
                    reject('No user logged in');
                }
            });
        });
    }

}
