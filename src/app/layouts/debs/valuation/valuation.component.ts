import { trigger, state, style, transition, animate } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Amount } from '../../shared/currency/currency.component';
import {SecurityDocument, SecurityType, ValuationService} from "../services/valuation.service";
import {LoanApplication} from "../models/loan-application.model";
import {ServiceAbilityService} from "../services/service-ability.service";
import {AddressService} from "../services/address.service";
import {PlaceAddress} from "../models/PlaceAddress";
import {VALUATION} from "../../../../environments/environment";

@Component({
  selector: 'app-valuation',
  templateUrl: './valuation.component.html',
  styleUrls: ['./valuation.component.css'],
  animations: [
    trigger('changeState', [
      state('rest', style({
        transform: 'scale(1)'
      })),
      state('hover', style({
        transform: 'scale(1.1)'
      })),
      state('press', style({
        transform: 'scale(1.1)',
        color: '#47748f'
      })),
      transition('rest => hover', animate('400ms ease-in')),
      transition('hover => rest', animate('200ms ease-out')),
      transition('hover => press', animate('400ms ease-in')),
      transition('press => rest', animate('200ms ease-out'))
    ])
  ]
})
export class ValuationComponent implements OnInit, AfterViewInit, OnChanges {

  currentLoanApplication: LoanApplication | undefined;
  currentLoanApplicationId: string | undefined;

  @Input()
  propertyAddress!: string;
  @Input()
  propertyValue!: Amount;
  @Input()
  loanPurpose?:string;
  currentState = ''
  @ViewChildren('dateOfValuation') dateOfValuation !: QueryList<ElementRef>
  valuationDateStr: string = ''

  securityTypeList: SecurityType[] = [];
  securityDocumentList: SecurityDocument[] = [];
  valuationTypeList: any[] = [{
    code: 'EXISTING',
    description: 'Use existing valuation less than 3 months old'
  }, {code: 'REQUESTED', description: 'Enter details for valuation'}];
  currDate = new Date();
  uploadDocumentState = "reset";

  valuationFormGroup!: FormGroup;

  constructor(private fb: FormBuilder, private valuationService: ValuationService, private cdr: ChangeDetectorRef,
    private serviceAbilityService: ServiceAbilityService, private addressService: AddressService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.valuationFormGroup != undefined){
      // this.valuationFormGroup.get('securityAddress')?.setValue(this.currentLoanApplication?.loanDetail?.loanDetailAddress);
      // this.valuationFormGroup.get('propertyValue')?.setValue(this.currentLoanApplication?.loanDetail?.purchasePrice);
    }
  }
  ngAfterViewInit(): void {

  }
  get values():string {
    return JSON.stringify(this.valuationFormGroup?.value);
  }

  ngOnInit(): void {
    this.valuationFormGroup = this.fb.group({
      pageName: VALUATION,
      securityAddress: ['', Validators.required],
      propertyValue: [this.propertyValue, Validators.required],
      valuationType: ['', Validators.required],
      valexReferenceNumber: ['', Validators.required],
      valexSecurityAddress: ['', Validators.required],
      existingValexInsertMethod: ['', Validators.required],
      valuationFirm: ['', Validators.required],
      dateOfValuation: ['', Validators.required],
      valuationValidatedAmount: ['', Validators.required],
      variance: ['', Validators.required],
      securityType: ['', Validators.required],
      securityDocument: ['', Validators.required],
      supportingDocument: ['', Validators.required],
      contactPersonForValuation: ['', Validators.required],
      contactNumber: ['', Validators.required],
      valexDocument: ['', Validators.required]
    });
    this.valuationFormGroup.get('supportingDocument')?.valueChanges.subscribe(newValue => {
    });
    this.valuationFormGroup.get('valuationType')?.valueChanges.subscribe(newValue => {
      this.updateFormControlOnValuationReportChange(newValue);
    });
    this.valuationFormGroup.get('existingValexInsertMethod')?.valueChanges.subscribe(newValue => {
      this.updateExistingValexInputMethodControls(newValue);
    });
    // this.serviceAbilityService.currentLoanApplication.subscribe(response => {
    //   this.currentLoanApplication = response;
    //   this.updateValues();
    //   this.valuationFormGroup.get('propertyValue')?.setValue(this.propertyValue);
    // });
    this.serviceAbilityService.currentLoanApplicationId.subscribe(response => {
      this.currentLoanApplicationId = response;
    });
    this.valuationService.securityDocumentList.subscribe(response => {
      this.securityDocumentList = response;
    });
    this.valuationService.securityTypeList.subscribe(response => {
      this.securityTypeList = response;
    });
    /**
     * Add security address
     */
     this.serviceAbilityService.currentSecurityAddress.subscribe(securityAddress => {
      if (securityAddress) {
        console.log(securityAddress);
       this.valuationFormGroup.get('securityAddress')?.setValue(securityAddress);
       this.cdr.detectChanges();
      }
    })
    /**
     * Add security Value
     */
     this.serviceAbilityService.currentSecurityValue.subscribe(securityValue => {
      if (securityValue) {
       this.valuationFormGroup.get('propertyValue')?.setValue(securityValue);
      }
    })
  }

  uploadDocument(state:any){
    this.uploadDocumentState = state;
  }

  updateFormControlOnValuationReportChange(reportType: string) {
    this.updateFormControl(reportType === 'EXISTING', 'valexReferenceNumber');
    this.updateFormControl(reportType === 'EXISTING', 'valexSecurityAddress');
    this.updateFormControl(reportType === 'EXISTING', 'valuationFirm');
    this.updateFormControl(reportType === 'EXISTING', 'dateOfValuation');
    this.updateFormControl(reportType === 'EXISTING', 'valuationValidatedAmount');
    this.updateFormControl(reportType === 'EXISTING', 'variance');
    this.updateFormControl(reportType === 'EXISTING', 'existingValexInsertMethod');
    this.updateFormControl(reportType === 'EXISTING', 'valexDocument');
    this.updateFormControl(reportType === 'REQUESTED', 'securityType');
    this.updateFormControl(reportType === 'REQUESTED', 'securityDocument');
    this.updateFormControl(reportType === 'REQUESTED', 'supportingDocument');
    this.updateFormControl(reportType === 'REQUESTED', 'contactPersonForValuation');
    this.updateFormControl(reportType === 'REQUESTED', 'contactNumber');
  }

  updateExistingValexInputMethodControls(insertType: string) {
    this.updateFormControl(insertType === 'insertValexNumber', 'valexReferenceNumber');
    this.updateFormControl(insertType === 'uploadValexDocument', 'valexDocument');
  }

  updateFormControl(activateRequired: Boolean = true, controlName: string) {
    if (activateRequired) {
      this.valuationFormGroup.get(controlName)?.setValidators(Validators.required);
    } else {
      this.valuationFormGroup.get(controlName)?.setValidators([]);
    }
    this.valuationFormGroup.setControl(controlName, <AbstractControl>this.valuationFormGroup.get(controlName));
  }
  saveData() {
    if (this.valuationFormGroup.valid) {
      let propertyValuation = this.valuationService.formatData(this.valuationFormGroup.value);
      propertyValuation.loanApplicationId = this.currentLoanApplicationId || '';
      this.valuationService.save(propertyValuation).subscribe(() => {
      });
    }
  }
  getFormValidationErrors() {
    console.log('valuationFormGroup valid?',this.valuationFormGroup.valid)
    Object.keys(this.valuationFormGroup.controls).forEach(key => {
      const controlErrors = this.valuationFormGroup.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          if (controlErrors) {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          }
        });
      }
    });

  }
  updateValues() {
   let propertyValuation = this.currentLoanApplication?.propertyValuation;
    if (propertyValuation) {
      this.valuationFormGroup.get('id')?.setValue(propertyValuation.id);
      this.valuationFormGroup.get('valuationType')?.setValue(this.valuationTypeList.find(d => d.code == propertyValuation?.valuationType));
      this.valuationFormGroup.get('valuationFirm')?.setValue(propertyValuation.valuationFirm);
      this.valuationFormGroup.get('dateOfValuation')?.setValue(propertyValuation.dateOfValuation);
      this.valuationFormGroup.get('contactPersonForValuation')?.setValue(propertyValuation.contactPersonForValuation);
      this.valuationFormGroup.get('valexReferenceNumber')?.setValue(propertyValuation.valexReferenceNumber);
      this.valuationFormGroup.get('existingValexInsertMethod')?.setValue(propertyValuation.existingValexInsertMethod);
      this.valuationFormGroup.get('valexSecurityAddress')?.setValue(propertyValuation.valexSecurityAddress);
      this.valuationFormGroup.get('valuationValidatedAmount')?.setValue(new Amount(propertyValuation.valuationValidatedAmount));
      this.valuationFormGroup.get('variance')?.setValue(propertyValuation.variance);
      this.valuationFormGroup.get('securityDocument')?.setValue(this.securityDocumentList.find(d => d.id == propertyValuation?.securityDocumentId));
      this.valuationFormGroup.get('securityType')?.setValue(this.securityTypeList.find(d => d.id == propertyValuation?.securityTypeId));
      this.valuationFormGroup.get('contactNumber')?.setValue(propertyValuation.contactNumber);
    }
    this.valuationFormGroup.get('securityAddress')?.setValue(this.addressService.getSearchAddress(this.currentLoanApplication?.loanDetail?.loanDetailAddress as PlaceAddress));
    this.valuationFormGroup.get('propertyValue')?.setValue(new Amount(propertyValuation?.propertyValue));
  }


     // VALUATION DATE FORMATTER
     valuationDateFormatter(event: any, value: number): void {

      let valuationFormGroup = this.valuationFormGroup;

      let lengthOfText = this.valuationDateStr.length + 1;
      let domRef: ElementRef = this.dateOfValuation.get(value)!;

        if (event.data.includes('null')) {
          domRef.nativeElement.value = '';
          return;
        }

        if (isNaN(event.data) && lengthOfText < 10) {
          valuationFormGroup.get('dateOfValuation')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.valuationDateStr;

          return;
        }

        if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
          this.valuationDateStr += event.data;
          this.valuationDateStr += '/';
          valuationFormGroup.get('dateOfValuation')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.valuationDateStr;

          return;

        }

        if (!isNaN(event.data) && lengthOfText < 10) {
          this.valuationDateStr += event.data;
          valuationFormGroup.get('dateOfValuation')?.setValue('99/99/9999')
          domRef.nativeElement.value = this.valuationDateStr;

          return;
        }

        if (lengthOfText == 10) {
            this.valuationDateStr += event.data;
            valuationFormGroup.get('dateOfValuation')?.setValue(this.valuationDateStr)
            domRef.nativeElement.value = this.valuationDateStr;
            this.valuationDateStr = "";
          return
        }

    }
}
