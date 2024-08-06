import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router
  ) {}

 doRegister(email: string,password: string,firstName: string,lastName: string): Promise<void> {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const additionalUserData = {
          firstName: firstName,
          lastName: lastName,
          email: email,
        };
        if (result.user) {
          return this.db
            .collection('users')
            .doc(result.user.uid)
            .set(additionalUserData);
        } else {
          throw new Error('User registration failed');
        }
      })
      .then(() => {
        this.router.navigate(['/main/dashboard']);
      })
      .catch((error) => {
        console.error('Error registering user:', error);
      });
  }

  doLogin(email: string,password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  doLogout(): Promise<void> {
    return this.afAuth.signOut();
  }


  // checkLogin(): Promise<User> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.afAuth.onAuthStateChanged(function (user) {
  //       if (user) {
  //         resolve(user);
  //       } else {
  //         reject('No user logged in');
  //       }
  //     });
  //   });
  // }

  
}
