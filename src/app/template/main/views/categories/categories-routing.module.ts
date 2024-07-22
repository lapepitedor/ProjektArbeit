import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { CategoriesComponent } from './categories.component';
import { AddComponent } from './add/add.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/auth/login']);
const routes: Routes = [
    {
        path: '',
        component: CategoriesComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CategoriesRoutingModule { }
