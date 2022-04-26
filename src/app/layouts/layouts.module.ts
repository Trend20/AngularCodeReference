import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsComponent } from './layouts.component';
import { DebsModule } from './debs/debs.module';
import { MaterialModule } from '../material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutsRoutingModule } from './layouts-routing.module';



@NgModule({
  declarations: [
    LayoutsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    LayoutsRoutingModule
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ]
})
export class LayoutsModule { }
