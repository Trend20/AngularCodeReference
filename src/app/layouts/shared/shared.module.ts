import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { PropertyTrusteeAcnComponent } from './property-trustee-acn/property-trustee-acn.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbnComponent } from './abn/abn.component';
import { CurrencyComponent } from './currency/currency.component';
import {SignatureComponent} from './signature/signature.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';



import { ReuseableDragAndDropModule } from './reuseable-drag-and-drop/reuseable-drag-and-drop.module';
import { OwnershipDetailsReuseableComponent } from './ownership-details-reuseable/ownership-details-reuseable.component';
import {AddExpenseTypeDialogComponent} from "../debs/additional-assets-and-liabilities/add-expense-type-dialog/add-expense-type-dialog.component";
import {BaseComponent} from "./base.component";
import {ApplicationNamePipe} from "./pipes/application-name.pipe";


@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    PropertyTrusteeAcnComponent,
    AbnComponent,
    CurrencyComponent,
    OwnershipDetailsReuseableComponent,
    SignatureComponent, AddExpenseTypeDialogComponent, BaseComponent, ApplicationNamePipe
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule
  ],
  exports: [ConfirmationDialogComponent, PropertyTrusteeAcnComponent, ConfirmationDialogComponent, AbnComponent, CurrencyComponent, SignatureComponent, ReuseableDragAndDropModule,
    PdfViewerModule, OwnershipDetailsReuseableComponent, AddExpenseTypeDialogComponent, ApplicationNamePipe
  ]
})
export class SharedModule { }
