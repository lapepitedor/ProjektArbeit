import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { RouterModule } from '@angular/router';
import { CardComponent } from './card/card.component';



@NgModule({
  declarations: [
    SidePanelComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports:[
    MaterialModule,

    //components
    SidePanelComponent,
    CardComponent
  ]
})
export class SharedModule { }
