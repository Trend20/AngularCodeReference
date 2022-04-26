import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingUiComponent } from './tracking-ui.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { MaterialModule } from 'src/app/material.module';
import { InProgressComponent } from './in-progress/in-progress.component';
import { TrackingUiRoutingModule } from './tracking-ui-routing.module';
import { SubmittedComponent } from './submitted/submitted.component';
import { RecycledComponent } from './recycled/recycled.component';
import { FormsModule } from '@angular/forms';
import {SharedModule} from "../shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";



@NgModule({
  declarations: [
    TrackingUiComponent,
    TopNavComponent,
    SideNavComponent,
    InProgressComponent,
    SubmittedComponent,
    RecycledComponent
  ],
    imports: [
        CommonModule,
        MaterialModule,
        TrackingUiRoutingModule,
        FormsModule,
        SharedModule,
        NgxSpinnerModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TrackingUiModule { }
