import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignatureRoutingModule } from './signature-routing.module';
import { ClientDeclarationDialogContent, DigitalSignatureComponent } from './digital-signature/digital-signature.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { NgOtpInputModule } from  'ng-otp-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { CloudDocsService } from '../debs/services/cloud-docs.service'


@NgModule({
  declarations: [
    DigitalSignatureComponent,
    ClientDeclarationDialogContent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SignatureRoutingModule,
    MaterialModule,
    NgOtpInputModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
  providers: [
    CloudDocsService
  ]
})
export class SignatureModule { }
