import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ServiceabilityComponent } from './serviceability/serviceability.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { AssetsAndLiabilitiesComponent } from './assets-and-liabilities/assets-and-liabilities.component';
import { MaterialModule } from 'src/app/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SummaryComponent } from './summary/summary.component';
import { DebsComponent } from './debs.component';
import { DebsRoutingModule } from './debs-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddressAutoComplete } from '../shared/address-auto-complete/address-auto-complete';
import { AddressComponent } from './address/address.component';
import {StampDutyComponent} from "./stamp-duty/stamp-duty.component";
import { ClientDeclarationComponent, ClientDeclarationDialogContent } from './client-declaration/client-declaration.component';
import { ValuationComponent } from './valuation/valuation.component';
import { BrokerDeclarationComponent } from './broker-declaration/broker-declaration.component';
import { BusinessPartnerDetailsDeclarationComponent } from './business-partner-details-declaration/business-partner-details-declaration.component';
import {AdditionalAssetsAndLiabilitiesComponent} from "./additional-assets-and-liabilities/additional-assets-and-liabilities.component";
import {AdditionalPersonalInformationComponent} from "./additional-personal-information/additional-personal-information.component";
import { DateAdapter} from '@angular/material/core';
import { CustomDateAdapter } from './custom-date-adapter';
import {MatStepperModule} from '@angular/material/stepper';
import {MatIconModule} from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CreditDecisionComponent } from './credit-decision/credit-decision.component';
import { ReusableTopContentComponent } from './reusable-top-content/reusable-top-content.component';
import { DocumentRequiredComponent } from './document-required/document-required.component';
import { ServicingPageComponent } from './servicing-page/servicing-page.component';
import { BrokerReviewComponent } from './broker-review/broker-review.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { CloudDocsService } from './services/cloud-docs.service';
import { ReferComponent } from './refer/refer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    ServiceabilityComponent,
    PersonalDetailsComponent,
    AssetsAndLiabilitiesComponent,
    DebsComponent,
    SummaryComponent,
    AddressAutoComplete,
    AddressComponent,
    StampDutyComponent,
    ClientDeclarationComponent,
    ValuationComponent,
    BrokerDeclarationComponent,
    AdditionalAssetsAndLiabilitiesComponent,
    AdditionalPersonalInformationComponent,
    ClientDeclarationDialogContent,
    BusinessPartnerDetailsDeclarationComponent,
    CreditDecisionComponent,
    ReusableTopContentComponent,
    DocumentRequiredComponent,
    ServicingPageComponent,
    BrokerReviewComponent,
    ServicingPageComponent,
    ReferComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    DebsRoutingModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    MatStepperModule,
    MatIconModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideStorage(() => getStorage()),
  ],
  providers: [
    CustomDateAdapter,
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
    CloudDocsService,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DebsModule { }
