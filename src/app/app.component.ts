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
    // user: Observable<User>;
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
                // this.router.navigate(['main/dashboard']).then();
            } else
            {
                this.router.navigate(['/auth/login']).then();
            }
        });
    }

    ngOnInit()
    {
        // this.createRobot('sohaib', 'red', '12')
    }

    async createRobot(name: string, color: string, age: string)
    {
        // const docRef = await addDoc(collection(this.firestore.firestore, 'users/5dSBqBF21sUpvCZir46QjcdGv2H2/expenses'), {
        //     email: "abc@gmail.com",
        //     firstName: "Sohaib",
        //     lastName: "Riaz",
        //     password: "123123"
        // });
        // console.log("Document written with ID: ", docRef.id);

        let list = await getDocs(collection(this.firestore.firestore, 'users'));
        console.log(list.docs);

        // this.parseData(list.docs);

        const result = list.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }))
        console.log('>>> Documents', result)


    }

    parseData(snapsShots: any)
    {
        const data: any = [];
        snapsShots.forEach((snapshot: any) =>
        {
            const expense = snapshot.payload.exportVal();
            expense.id = snapshot.key;
            data.push(expense);
        });
        console.log(data);
    }

    ngOnDestroy()
    {
        this.loggedInSubscription.unsubscribe();
    }
}
