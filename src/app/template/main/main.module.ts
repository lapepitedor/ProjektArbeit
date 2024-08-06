import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainComponent } from './main.component';
import { NotFoundComponent } from './views/not-found/not-found.component';


@NgModule({
    declarations: [MainComponent, ],
    imports: [
        CommonModule,
        MainRoutingModule,
        SharedModule,
        RouterModule
    ]
})
export class MainModule { }
