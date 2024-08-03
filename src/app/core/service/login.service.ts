import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private currentUser!: User ;
  private userId!: string;
  private categories!: string[];
  private userIdSet = new Subject<string>();

  userIdSetAnnounced$ = this.userIdSet.asObservable();

  constructor(public afAuth: AngularFireAuth) {}

  getCurrentUser(): Promise<User> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  updateCurrentUser(userUpdatedInfos: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const user = this.afAuth.currentUser.then((user) => {
        user
          ?.updateProfile({
            displayName: userUpdatedInfos.name,
            photoURL: userUpdatedInfos.photoURL,
          })
          .then(
            (res) => {
              console.log(res);
              return resolve(res);
            },
            (err) => reject(err)
          );
      });
    });
  }

  announceUserIdCreated(message: string) {
    this.userIdSet.next(message);
  }

  setUser(data: User) {
    this.currentUser = data;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  setUserId(key: string) {
    this.userId = key;
  }

  getUserId(): string {
    return this.userId;
  }

  // setCategories(originalCategories: string[]) {
  //   this.categories = originalCategories;
  // }

  // getCurrentCategories(): string[] {
  //   return this.categories;
  // }
}
