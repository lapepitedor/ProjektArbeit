import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/service/auth.guard';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./views/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./views/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
  },
  {
    path: 'transaction',
    loadChildren: () =>
      import('./views/transaction/transaction.module').then(
        (m) => m.TransactionModule
      ),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./views/about/about.module').then((m) => m.AboutModule),
  },
  { path: '**', redirectTo: 'not-found' },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule { }
