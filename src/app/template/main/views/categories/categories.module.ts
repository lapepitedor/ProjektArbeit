import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import { AddComponent } from './add/add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        CategoriesComponent,
        AddComponent
    ],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        SharedModule,
        FormsModule, ReactiveFormsModule
    ]
})
export class CategoriesModule { }
