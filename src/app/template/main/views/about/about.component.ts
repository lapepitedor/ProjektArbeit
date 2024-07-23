import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoginService } from 'src/app/core/service/login.service';
import { collection, getDocs, getDoc } from '@angular/fire/firestore';


@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit
{
    user: any = {};
    userId: string;
    isLoading: boolean;

    constructor(
        private loginService: LoginService,
        public afs: AngularFirestore)
    { }
    ngOnInit()
    {
        this.userId = this.loginService.getUserId();
        this.getExpenses();
        this.getUserDetails();
    }

    async getExpenses()
    {
        let expense = await this.getList(`users/${this.userId}/expenses`);
        this.user.expenseLength = expense.length;
    }

    async getUserDetails()
    {
        this.loginService.getCurrentUser().then(user =>
        {
            this.user.loginDetails = user; 
        })

        let users = await this.getList(`users`);

        let currentuser = users.find(user => (this.userId == user.id));

        this.user = { ...this.user, currentuser };
        console.log("this.user",this.user);
        
        this.isLoading = false;
    }

    async getList(url: any)
    {
        this.isLoading = true;
        let list = await getDocs(collection(this.afs.firestore, url));

        let result = []
        result = list.docs.map((d) => ({
            id: d.id,
            ...d.data()
        }))

        return result;
    }
}

