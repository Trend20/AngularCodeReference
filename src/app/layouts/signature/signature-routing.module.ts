import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalSignatureComponent } from './digital-signature/digital-signature.component';

const routes: Routes = [
  {path: '', component: DigitalSignatureComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignatureRoutingModule { }
