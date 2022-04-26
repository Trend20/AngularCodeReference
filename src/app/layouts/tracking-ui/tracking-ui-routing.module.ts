import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TrackingUiComponent } from './tracking-ui.component';
import { InProgressComponent } from './in-progress/in-progress.component';
import { SubmittedComponent } from './submitted/submitted.component';
import { RecycledComponent } from './recycled/recycled.component';


const routes: Routes = [
  {
    path: '',
    component: TrackingUiComponent,
    children: [
      // {path: 'tracking/:page', component: TrackingUiComponent},
      { path: 'submitted', component: SubmittedComponent},
      {path: 'inProgress', component: InProgressComponent},
      {path: 'recycled', component: RecycledComponent},
      { path: '', redirectTo: 'inProgress', pathMatch: 'full'}
    ]
  }
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class TrackingUiRoutingModule { }
