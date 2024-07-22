import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router } from '@angular/router';
import { Observable, take, map, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root', // Makes it available throughout your app
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router , private auth:LoginService) {}

  async canActivate(): Promise<boolean> {
  
      if (await this.auth.getCurrentUser()) {
        console.log('logged in');
          return true;
      } else {
        console.log('not logged in');
        this.router.navigate(['/login']);
        return false;
      }
  
     }
  
}

