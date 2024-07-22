import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './template/main/main.component';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { AuthGuard } from './core/service/auth.guard';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./template/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'main',
    component: MainComponent,
    loadChildren: () =>
      import('./template/main/main.module').then((m) => m.MainModule),
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
