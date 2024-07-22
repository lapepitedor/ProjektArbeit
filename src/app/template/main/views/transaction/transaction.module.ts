import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { AddComponent } from './add/add.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TransactionComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class TransactionModule { }
