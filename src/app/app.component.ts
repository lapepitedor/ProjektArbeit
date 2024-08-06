import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginService } from './core/service/login.service';

import { Firestore, addDoc, collection, getDocs, query, deleteDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent
{
    title = 'expense-tracking';

    loggedInSubscription: Subscription;

    constructor(private router: Router,
        private afAuth: AngularFireAuth,
        public firestore: AngularFirestore,
        private loginService: LoginService)
    {

        this.loggedInSubscription = this.afAuth.authState.subscribe((authData: any) =>
        {
            if (authData && authData.email)
            {
                this.loginService.setUserId(authData.uid);
                this.loginService.setUser(authData);
                this.loginService.announceUserIdCreated('user created!');
               
            } else
            {
                this.router.navigate(['/auth/login']).then();
            }
        });
    }

    ngOnInit()
    {
       
    }

    // async createRobot(name: string, color: string, age: string)
    // {
     
    //     let list = await getDocs(collection(this.firestore.firestore, 'users'));
    //     console.log(list.docs);
    //     const result = list.docs.map((d) => ({
    //         id: d.id,
    //         ...d.data()
    //     }))
    //     console.log('>>> Documents', result)


    // }

    // parseData(snapsShots: any)
    // {
    //     const data: any = [];
    //     snapsShots.forEach((snapshot: any) =>
    //     {
    //         const expense = snapshot.payload.exportVal();
    //         expense.id = snapshot.key;
    //         data.push(expense);
    //     });
    //     console.log(data);
    // }

    ngOnDestroy()
    {
        this.loggedInSubscription.unsubscribe();
    }
}
