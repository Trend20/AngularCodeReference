import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DebsDataService } from '../services/debs-data.service';
import { Country } from '../models/country';
import { states, countries } from '../../../../environments/environment';
import * as fastLevenshtein from 'fast-levenshtein';
import { PlaceAddress } from '../models/PlaceAddress';
import { AcnSearchDetails } from '../../shared/property-trustee-acn/property-trustee-acn.component';
import { AbnComponent, AbnSearchDetails } from '../../shared/abn/abn.component';
import { MemberFirstNameDetail } from '../models/member-first-name-detail';
import { LoanApplication } from '../models/loan-application.model';
import { ServiceAbilityService } from '../services/service-ability.service';
import { PersonalDetailsService } from '../services/personal-details.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControlOpsService } from '../services/form-control-ops.service';
import { Route, Router, Routes } from '@angular/router';
import { LoanDetailService, LoanPage } from '../services/loan-detail.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PersonalDetailPage } from '../models/personal-detail-model-revised';
import { ReusableErrorService } from 'src/app/services/reusable-error.service';
import { AddressService } from '../services/address.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css'],
})
export class PersonalDetailsComponent implements OnInit, AfterViewInit {
  private addMemberSubscription: Subscription | undefined;
  // currentLoanApplication: LoanApplication | undefined;
  currentLoanApplicationId: string | undefined;
  currentPersonalDetailPage: PersonalDetailPage | undefined;
  states: Country[] = states;
  countries: Country[] = countries;
  titleList = ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
  genderList: string[] = ['Male', 'Female', 'Other - not disclosed'];
  dateText: string = '';
  minDateOfBirth = new Date(
    new Date().getFullYear() - 18,
    new Date().getMonth(),
    new Date().getDate()
  );
  abnSearchErrorMessage : string = '';
  acnTrusteeErrorMessage : string = '';
  acnPropertyErrorMessage : string = '';

 checkboxList = {
  ABNRegisteredAddressCheck: false,
  ACNSMSFRegisteredAddressCheck: false,
  ACNPropertyRegisteredAddressCheck: false
 }

 showProgress:boolean = false;
 progress: number = 0;

  @Output()
  onUpdatePersonalDetalsMemberFirstname: EventEmitter<MemberFirstNameDetail> = new EventEmitter();

  @Output()
  private moveToNextPage = new EventEmitter();


  @ViewChild(AbnComponent) abnComponent!: AbnComponent;

  @ViewChildren('birthDates') birthDates !: QueryList<ElementRef>

  get abnSearchDetails(): AbnSearchDetails {
    return this.abnComponent?.abnserchDetails;
  }

  private _serviceabilityFormGroup!: FormGroup;
  get serviceabilityFormGroup(): FormGroup {
    return this._serviceabilityFormGroup;
  }

  @Input()
  set serviceabilityFormGroup(value: FormGroup | undefined) {
    if (value) {
      this._serviceabilityFormGroup = value;
      this.showServiceabilitySuccess();
      this.updateLogic();
    }
  }

  updateLogic() {
    let membersInfoList = this.serviceabilityFormGroup?.get(
      'members'
    ) as FormArray;
    let personalDetailInfoList = this.personalDetailFormGroup?.get(
      'memberDetailList'
    ) as FormArray;
    for (let i = 0; i < membersInfoList?.length; i++) {
      let memberFormGroup = membersInfoList.at(i) as FormGroup;
      let memberDetailFormGroup = personalDetailInfoList.at(i) as FormGroup;
      memberFormGroup?.get('id')?.valueChanges.subscribe((newValue) => {
        memberDetailFormGroup.get('applicantId')?.setValue(newValue);
      });
      memberFormGroup?.get('firstName')?.valueChanges.subscribe((newValue) => {
        memberDetailFormGroup.get('firstName')?.setValue(newValue);
      });
    }
    this.personalDetailFormGroup.setControl(
      'memberDetailList',
      this.memberDetailList
    );
  }

  private _personalDetailFormGroup!: FormGroup;
  memberDetailList!: FormArray; //memberDetailList
  dragAreaClass!: string;
  draggedFiles!: any;
  error!: string;
  areaCodeList = ['02', '03', '04', '07', '08'];
  isLicenceFrontImageSet = false;
  isLicenceBackImageSet = false;
  isPassportImageSet = false;
  licenceBackImage!: any;
  licenceFrontImage!: any;
  loading = false;

  get personalDetailFormGroup(): FormGroup {
    return this._personalDetailFormGroup;
  }

  get abnValue(): string {
    return JSON.stringify(this.personalDetailFormGroup.get('smsfAbn')?.value);
  }

  @Input()
  set personalDetailFormGroup(value: FormGroup) {
    if(value) {
      this._personalDetailFormGroup = value;
      this.memberDetailList = value.get('memberDetailList') as FormArray;
    }
  }
  updateApplicantAddressValues(
    memberDetail: AbstractControl,
    address: PlaceAddress
  ) {
    (memberDetail as FormGroup).get('address')?.setValue(address);
  }

  /**
   * TODO: Discuss the importance of the back image with Kathleen
   * @param event
   * @param index
   * @param formControl
   */

  onFileChange(event: any, index: number, formControl: string) {
    const reader = new FileReader();
    let formGroup: FormGroup = <FormGroup>this.memberDetailList.at(index);
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      const formData = new FormData();
      switch (formControl) {
        case 'passportImage':
          this.isPassportImageSet = true;
          formData.append('files', event.target.files[0]);
          this.getOCR(formData, index, formControl);
          break;
        case 'licenceFrontImage':
          this.licenceFrontImage = event.target.files[0];
          this.isLicenceFrontImageSet = true;
          formData.append('files', event.target.files[0]);
          this.getOCR(formData, index, formControl);
          break;
        case 'licenceBackImage':
          this.licenceBackImage = event.target.files[0];
          this.isLicenceBackImageSet = true;
          if (this.isLicenceBackImageSet && this.isLicenceFrontImageSet) {
            formData.append('files', event.target.files[0]);
            formData.append('files', this.licenceFrontImage);
            this.getOCR(formData, index, formControl);
          }
          break;
      }
      reader.readAsBinaryString(file);

      reader.onload = () => {
        formGroup.get(formControl)?.setValue(reader.result);
        this.cd.markForCheck();
      };
    }
  }

  constructor(
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private dataService: DebsDataService,
    private serviceAbilityService: ServiceAbilityService,
    private personalDetailService: PersonalDetailsService,
    private toastr: ToastrService,
    private formControlOps: FormControlOpsService,
    private router: Router,
    private loanDetailService: LoanDetailService,
    private reusableErrorService: ReusableErrorService,
    private spinner: NgxSpinnerService,
    private addressService: AddressService
  ) {}


  // check for validity
  checkPersonalDetailsFormValidity(){
    this.reusableErrorService.openValidationModal(this.personalDetailFormGroup);
  }

  ngOnInit(): void {
    this.spinner.show();
    // this.serviceAbilityService.currentLoanApplication.subscribe((response) => {
    //   this.currentLoanApplication = response;
    //   this.updateValues();
    // });

    let id = this.router.url.split('/').pop()?.split('?')[0];

    if (id !== undefined && id !=="") {

      this.loanDetailService.loanDetailJourneyfetch(LoanPage.PERSONAL_DETAIL, id ).subscribe(response => {
        console.log(response.data);

        this.serviceAbilityService.setCurrentPersonalDetailPageData(response.data);
        this.spinner.hide();
      })
    }


    this.serviceAbilityService.currentLoanApplicationId.subscribe(
      (response) => {
        console.log('PersonalDetailsPage ID = ', response);
        this.currentLoanApplicationId = response;
      }
    );
    this.addMemberSubscription =
      this.serviceAbilityService.addedMember.subscribe(() => {
        this.updateLogic();
      });

    // this.serviceabilityFormGroup?.get('refinanceCheckPass')?.valueChanges?.subscribe((newValue) => {

    //   console.log(newValue);
    //     if (newValue) {
    //       this.showServiceabilitySuccess()
    //     }
    // })
  }

  ngAfterViewInit(): void {
    this.serviceAbilityService.getCurrentPersonalDetailPageData().subscribe((response: PersonalDetailPage) => {
      this.currentPersonalDetailPage = response
      this.updateValues();
      this.cd.detectChanges();
    })


  }

   // toggle readonly
   toggleSMSFAddressReadonly(checkbox: string){
    if(checkbox === 'ABNRegisteredAddressCheck'){
      this.checkboxList.ABNRegisteredAddressCheck = !this.checkboxList.ABNRegisteredAddressCheck;
    }
  }

  toggleSMSFTrusteeAddressReadonly(checkbox: string){
    if(checkbox === 'ACNSMSFRegisteredAddressCheck'){
      this.checkboxList.ACNSMSFRegisteredAddressCheck = !this.checkboxList.ACNSMSFRegisteredAddressCheck;
    }
  }

  togglePropertyTrusteeAddressReadonly(checkbox: string){
    if(checkbox === 'ACNPropertyRegisteredAddressCheck'){
      this.checkboxList.ACNPropertyRegisteredAddressCheck = !this.checkboxList.ACNPropertyRegisteredAddressCheck;
    }
  }



  getOCR(formData: FormData, index: number, control: string): void {
    let formGroup: FormGroup = this.memberDetailList.at(index) as FormGroup;
    // this.spinner.show();
    this.showProgress = true;
    this.dataService.searchOCR(formData).subscribe({
      next: (response) => {
        // Populate ocr data, make use of reusable method
        try {
          if (response.Data) {

              formGroup.get('firstName')?.setValue(response.Data?.FirstName);
              formGroup.get('middleName')?.setValue(response.Data?.MiddleName);
              formGroup.get('lastName')?.setValue(response.Data?.Surname);

            let date: Date = new Date(response.Data?.DateOfBirth);
            let dob: string =
              date.getFullYear() +
              '-' +
              (date.getMonth() > 8
                ? date.getMonth() + 1
                : '0' + (date.getMonth() + 1)) +
              '-' +
              (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()); //((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
            formGroup.get('dateOfBirth')?.patchValue(dob);
            if (
              control === 'licenceFrontImage' ||
              control === 'licenceBackImage'
            ) {
              let state: Country | null = this.getLocation(
                response.Data?.TerritoryName
                  ? response.Data?.TerritoryName.replace(/ Territory/g, '')
                  : null,
                this.states
              );
              formGroup.get('stateOfIssue')?.setValue(state?.code);
              formGroup
                .get('licenseNumber')
                ?.patchValue(response.Data?.LicenseNumber);
              formGroup
                .get('address')
                ?.setValue(this.addressService.formartUploadedLicenceAddress(response.Data?.Address!));
            } else {
              let country: Country | null = this.getLocation(
                response.Data.Nationality.replace(' CITIZEN', ''),
                this.countries
              );
              formGroup.get('countryOfIssue')?.setValue(country?.name);
              formGroup
                .get('passportNumber')
                ?.patchValue(response.Data?.DocumentNo);
            }
          } else {
            this.showDocumentUploadError(
              'Error uploading document(s)',
              response.Msg
            );
          }
        } catch (error) {
          if (response.StatusCode == 500) {
            this.showDocumentUploadError('Error uploading document', error);
          } else {
            this.showDocumentUploadError(
              response.Data?.Error
                ? response.Data?.Error
                : 'Image not Identified',
              error
            );
          }
        }

        // this.spinner.hide();
        this.showProgress = false;

        this.onFocusOutMemberFirstNameEvent(index);
      },
      error: (err) => {
        // this.spinner.hide();
        this.showProgress = false;
        this.showDocumentUploadError(
          'An error occurred while loading kyc',
          err
        );
      },
    });
  }
  showDocumentUploadError(message: string, error: any) {
    console.error(JSON.stringify(error));
    this.openSnackbar(message);
  }
  openSnackbar(message: string) {
    this._snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
  getLocation(search: string | null, locations: Country[]): Country | null {
    // Suggestions welcomed for alternative to the loop. Disadvantage is the first match is returned however,
    // no countries have the same name even North Korea and South Korea, unless S.Korea and N.Korea then we need Philippines list of countries and states
    if (search) {
      for (let item of locations) {
        let difference: number = fastLevenshtein.get(
          search.toLowerCase(),
          item.name.toLowerCase()
        );
        let match: number =
          ((item.name.length - difference) / item.name.length) * 100;
        // debug
        // item match must be greater than 80 % else null is returned. This will take care of Australia and Australian = 80% match
        if (match > 80) {
          return item;
        }
      }
    }

    return null;
  }

  setPropertyTrusteeDetails(acnDetails: AcnSearchDetails): void {
    this.personalDetailFormGroup
      ?.get('propertyTrusteeAddress')
      ?.setValue(acnDetails?.MainBusinessLocation);
    this.personalDetailFormGroup
      ?.get('propertyTrustName')
      ?.setValue(acnDetails?.EntityName);
    this.personalDetailFormGroup
      ?.get('propertyTrusteeRegistrationDate')
      ?.setValue(acnDetails?.GST);
  }
  setAbnSearchDetails(abnSearchDetails: AbnSearchDetails): void {
    this.personalDetailFormGroup
      ?.get('address')
      ?.setValue(abnSearchDetails?.MainBusinessLocation);
    this.personalDetailFormGroup
      ?.get('smsfName')
      ?.setValue(abnSearchDetails?.EntityName);
    this.personalDetailFormGroup
      ?.get('smsfRegistrationDate')
      ?.setValue(abnSearchDetails?.GST?.trim());
  }
  setSMSFTrusteeDetails(acnDetails: AcnSearchDetails): void {
    this.personalDetailFormGroup
      ?.get('smsfTrusteeAddress')
      ?.setValue(acnDetails?.MainBusinessLocation);
    this.personalDetailFormGroup
      ?.get('smsfTrusteeName')
      ?.setValue(acnDetails?.EntityName);
    this.personalDetailFormGroup
      ?.get('smsfTrusteeRegistrationDate')
      ?.setValue(acnDetails?.GST);
  }

  onFocusOutMemberFirstNameEvent(i: number): void {
    let firstName: string = (
      (this.personalDetailFormGroup.get('memberDetailList') as FormArray).get(
        `${i}`
      ) as FormGroup
    ).get('firstName')?.value;
    if (firstName.length > 0) {
      this.onUpdatePersonalDetalsMemberFirstname.emit(
        new MemberFirstNameDetail(firstName, i)
      );
    }
  }
  saveData() {
    this.personalDetailFormGroup = this.formControlOps.addOptionalValidators(this.personalDetailFormGroup);

    console.log(this.personalDetailFormGroup)
    if (this.personalDetailFormGroup.valid) {
      this.moveToNextPage.emit(true)
      let personalDetails = this.personalDetailService.formatData(
        this.personalDetailFormGroup.value
      );
      personalDetails.loanApplicationId = this.currentLoanApplicationId;
      console.log(personalDetails.loanApplicationId);
      this.personalDetailService
        .updatedDetail(personalDetails)
        .subscribe(() => {});
    }
    this.checkPersonalDetailsFormValidity()
  }

  saveDataOnBack() {
    this.personalDetailFormGroup = this.formControlOps.addOptionalValidators(this.personalDetailFormGroup);

    console.log(this.personalDetailFormGroup)
    if (this.personalDetailFormGroup.valid) {
      this.moveToNextPage.emit(false)
      let personalDetails = this.personalDetailService.formatData(
        this.personalDetailFormGroup.value
      );
      personalDetails.loanApplicationId = this.currentLoanApplicationId;
      console.log(personalDetails.loanApplicationId);
      this.personalDetailService
        .updatedDetail(personalDetails)
        .subscribe(() => {});
    }else {
      this.moveToNextPage.emit(false)
    }
  }
  updateValues() {
    if (!this.currentPersonalDetailPage) {
      return;
    }

    console.log(this.personalDetailFormGroup)
    if (this.currentPersonalDetailPage?.smsfAbn) {
      this.personalDetailFormGroup
        ?.get('smsfAbn')
        ?.setValue(this.currentPersonalDetailPage?.smsfAbn?.abn);
      this.personalDetailFormGroup
        ?.get('smsfName')
        ?.setValue(this.currentPersonalDetailPage?.smsfAbn?.name);
      this.personalDetailFormGroup
        ?.get('address')
        ?.setValue(this.currentPersonalDetailPage?.smsfAbn?.address);
    }
    if (this.currentPersonalDetailPage?.propertyTrusteeAcn) {
      this.personalDetailFormGroup
        ?.get('propertyTrusteeACN')
        ?.setValue(this.currentPersonalDetailPage?.propertyTrusteeAcn?.acn);
      this.personalDetailFormGroup
        ?.get('propertyTrustName')
        ?.setValue(this.currentPersonalDetailPage?.propertyTrusteeAcn?.name);
      this.personalDetailFormGroup
        ?.get('propertyTrusteeAddress')
        ?.setValue(this.currentPersonalDetailPage?.propertyTrusteeAcn?.address);
      this.personalDetailFormGroup
        ?.get('propertyTrusteeName')
        ?.setValue(this.currentPersonalDetailPage?.propertyTrusteeAcn?.otherName);
    }
    if (this.currentPersonalDetailPage?.smsfTrusteeAcn) {
      this.personalDetailFormGroup
        ?.get('smsfTrusteeAcn')
        ?.setValue(this.currentPersonalDetailPage?.smsfTrusteeAcn?.acn);
      this.personalDetailFormGroup
        ?.get('smsfTrusteeName')
        ?.setValue(this.currentPersonalDetailPage?.smsfTrusteeAcn?.name);
      this.personalDetailFormGroup
        ?.get('smsfTrusteeAddress')
        ?.setValue(this.currentPersonalDetailPage?.smsfTrusteeAcn?.address);
    }

    if(this.currentPersonalDetailPage?.ABNRegisteredAddressCheck){
      this.personalDetailFormGroup?.get('ABNRegisteredAddressCheck')?.setValue(this.currentPersonalDetailPage.ABNRegisteredAddressCheck)
    }

    if(this.currentPersonalDetailPage?.ACNSMSFRegisteredAddressCheck){
      this.personalDetailFormGroup?.get('ACNSMSFRegisteredAddressCheck')?.setValue(this.currentPersonalDetailPage.ACNSMSFRegisteredAddressCheck)
    }

    if(this.currentPersonalDetailPage?.ACNPropertyRegisteredAddressCheck){
      this.personalDetailFormGroup?.get('ACNPropertyRegisteredAddressCheck')?.setValue(this.currentPersonalDetailPage.ACNPropertyRegisteredAddressCheck)
    }

    let membersArray = this.personalDetailFormGroup?.get('memberDetailList') as FormArray;

    for (let i = 0; i < membersArray.length; i++) {
      let memberDetailFormGroup = membersArray.at(i) as FormGroup;
      let applicant = this.currentPersonalDetailPage?.applicantList?.find(
        (app) => app.id == memberDetailFormGroup.get('applicantId')?.value
      );

      console.log(memberDetailFormGroup)
      if (applicant) {

        const lastName =  memberDetailFormGroup?.get('lastName')

        if (lastName) {
          lastName ?.setValue(applicant?.lastName);
        }else {
          memberDetailFormGroup.addControl('lastName', new FormControl(applicant?.lastName))
        }


        memberDetailFormGroup
          ?.get('firstName')
          ?.setValue(applicant?.firstName);
        memberDetailFormGroup
          ?.get('middleName')
          ?.setValue(applicant?.middleName);
        memberDetailFormGroup
          ?.get('dateOfBirth')
          ?.setValue(applicant?.dateOfBirth);
        memberDetailFormGroup
          ?.get('countryOfIssue')
          ?.setValue(
            applicant?.passportCountryOfIssue
          );
        memberDetailFormGroup
          ?.get('stateOfIssue')
          ?.setValue(
            applicant?.licenseStateOfIssue
          );
        memberDetailFormGroup
          ?.get('licenseNumber')
          ?.setValue(applicant?.licenseNumber);
        memberDetailFormGroup
          ?.get('homePhoneNumber')
          ?.setValue(
            applicant?.homePhoneNumber || ''
          );
        memberDetailFormGroup
          ?.get('mobilePhoneNumber')
          ?.setValue(
            applicant?.mobilePhoneNumber || ''
          );
        memberDetailFormGroup
          ?.get('emailAddress')
          ?.setValue(applicant?.emailAddress);
        memberDetailFormGroup
          ?.get('title')
          ?.setValue(applicant?.title);
        memberDetailFormGroup
          ?.get('gender')
          ?.setValue(applicant?.gender);
        memberDetailFormGroup
          ?.get('citizenOrResident')
          ?.setValue(applicant?.citizenOrResident);
        memberDetailFormGroup
          ?.get('areaCode')
          ?.setValue(applicant?.areaCode);
        memberDetailFormGroup
          ?.get('dataEntryOption')
          ?.setValue(
            applicant?.dataEntryOption?.toString()
          );
        memberDetailFormGroup
          ?.get('passportNumber')
          ?.setValue(applicant?.passportNumber);
        memberDetailFormGroup
          ?.get('address')
          ?.setValue(
            applicant?.addressList.find(
              (d) => d.isCurrent
            )
          );
        memberDetailFormGroup
          ?.get('country')
          ?.setValue(
            applicant?.countryOfResidence
          );
      }
    }
  }

  isPreApprovalYes() {
    if (this.serviceabilityFormGroup?.get('preApproval')?.value == 'Yes') {
      return true;
    } else {
      return false;
    }
  }

  showServiceabilitySuccess() {
    this.serviceabilityFormGroup
      ?.get('refinanceCheckPass')
      ?.valueChanges?.subscribe((newValue) => {
        if (
          newValue
        ) {
          this.toastr.success(
            "Your Loan has qualified for Ezy Express Solution. Please fill out the rest of the details so we that we can proceed!", "CONGRATULATIONS", {timeOut: 900000,
              }
          );
        }
      });
  }

  /**
   * Date listener: TODO: Add more ignore validation
   * @param event
   * @param index
   * @returns
   */

  dateListener(event: any, index: number): void {

    let membersGroup = (this.personalDetailFormGroup?.get('memberDetailList') as FormArray).at(index) as FormGroup;

    let lengthOfText = this.dateText.length + 1;
    let domRef: ElementRef = this.birthDates.get(index)!;

      if (event.data.includes('null')) {
        domRef.nativeElement.value = '';
        return;
      }

      if (isNaN(event.data) && lengthOfText < 10) {
        membersGroup.get('dateOfBirth')?.setValue('99/99/9999')
        domRef.nativeElement.value = this.dateText;

        return;
      }

      if (!isNaN(event.data) && lengthOfText == 2 || !isNaN(event.data) && lengthOfText== 5 ) {
        this.dateText += event.data;
        this.dateText += '/';
        membersGroup.get('dateOfBirth')?.setValue('99/99/9999')
        domRef.nativeElement.value = this.dateText;

        return;

      }

      if (!isNaN(event.data) && lengthOfText < 10) {
        this.dateText += event.data;
        membersGroup.get('dateOfBirth')?.setValue('99/99/9999')
        domRef.nativeElement.value = this.dateText;

        return;
      }

      if (lengthOfText == 10) {
          this.dateText += event.data;
          membersGroup.get('dateOfBirth')?.setValue(this.dateText)
          domRef.nativeElement.value = this.dateText;
          this.dateText = "";
        return
      }

  }

  /**
   * ABN Error Message
   * @param errorMessage
   */
  setAbnSearchErrorMessage(errorMessage: string): void {
    this.abnSearchErrorMessage = errorMessage;
  }

  /**
   * ACN Error Meesages
   * @param errorMessage
   */
  setAcnSearchErrorMessage(errorMessage: {acnType: string, errorMessage: string}): void {

    console.log(errorMessage)
      if (errorMessage.acnType === 'trustee') {
        this.acnTrusteeErrorMessage = errorMessage.errorMessage
      }else {
        this.acnPropertyErrorMessage = errorMessage.errorMessage
      }
  }



}
