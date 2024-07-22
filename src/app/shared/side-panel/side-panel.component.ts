import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, getDoc, getDocs } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { LoginService } from 'src/app/core/service/login.service';

@Component({
    selector: 'app-side-panel',
    templateUrl: './side-panel.component.html',
    styleUrls: ['./side-panel.component.scss']
})
export class SidePanelComponent implements OnInit
{
    menus: any = [];
    userMenus: any[] = [];
    submenus: any[] = [];
    firstName: any;
    lastName: any;
    email: any;
    constructor(
        private auth: AuthService,
        private loginService: LoginService,
        private router: Router,
        private firestore: AngularFirestore,
        private snackBar: MatSnackBar)
    {
        this.menus = [
            {
                route: 'dashboard',
                label: 'Dashboard',
                icon: 'dashboard',
                visibility: true,
                hasIcon: false,
            },

            {
                route: 'categories',
                label: 'Categories',
                icon: 'categories',
                visibility: true,
                hasIcon: false,
            },
            {
                route: 'transaction',
                label: 'Transactions',
                icon: 'transaction',
                visibility: true,
                hasIcon: false,
            },
            {
                route: 'about',
                label: 'About',
                icon: 'about',
                visibility: true,
                hasIcon: false,
            },
        ];
    }

    ngOnInit(): void
    {
        this.getAllUserDetails();
    }
    async getAllUserDetails()
    {
        if (this.loginService.getUser())
        {
            const userEmail: any = this.loginService.getUser()?.email;
            const userId: any = this.loginService.getUserId();

            console.log('list.docslist.docslist.docslist.docslist.docs');

            this.firestore.collection('users').doc(userId).get().subscribe(res =>
            {
                let obj: any = res.data();
                this.firstName = obj.firstName;
                this.lastName = obj.lastName;
                this.email = obj.email;
            })
        }
    }

    onClickSubMenu(item: string)
    {
        this.menus.filter((menu: any) =>
        {
            if (menu.label == item)
            {
                menu.childMenu = !menu.childMenu;
            } else
            {
                menu.childMenu = false;
            }
        });
    }

    onLogout()
    {
        this.auth.doLogout().then((data) =>
        {
            this.snackBar.open('Logged out!', '', { duration: 2000 });
            this.router.navigateByUrl('/auth/login');
        }).catch(e =>
        {
            this.snackBar.open(e.message, '', { duration: 2000 });
        })
    }

}
