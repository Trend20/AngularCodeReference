import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebsComponent } from './debs.component';
import {AddressComponent} from "./address/address.component";
import {StampDutyComponent} from "./stamp-duty/stamp-duty.component";

const routes: Routes = [
  {path: 'add-edit', redirectTo: 'add-edit/', pathMatch: 'full'},
  //{path: '', redirectTo: 'add-edit/:id', pathMatch: 'full'},
  {path: 'add-edit/:id', component: DebsComponent},
  {path: 'address', component: AddressComponent},
  {path: 'stamp-duty', component: StampDutyComponent}
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class DebsRoutingModule { }
