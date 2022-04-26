import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ClientDeclaration } from '../../debs/models/client-declaration';
import { ClientDeclarationService } from '../../debs/services/client-declaration.service';
import signatureFontsJson from '../../../../assets/configs/signature-fonts.json';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DigitalSignatureComponent implements OnInit {
  questions: any[] = [
    {
      question:
        'Had any unsatisfied judgement entered in any courts or had a property foreclosed upon or given title or deed in lieu thereof?',
      type: 'checkbox',
      formControlName: 'unsatisfiedJudgement',
    },

    {
      question:
        'Ever had legal action instituted against you for default under any credit contract?',
      type: 'checkbox',
      formControlName: 'legalAction',
    },

    {
      question:
        'Ever been declared bankrupt or insolvent, or has either estate been assigned for the benefit of creditors?',
      type: 'checkbox',
      formControlName: 'declaredBankrupt',
    },

    {
      question:
        'Ever been shareholders or officers of any company of which a manager or receiver and/or liquidator has been appointed?',
      type: 'checkbox',
      formControlName: 'shareHolderOrOfficer',
    },

    {
      question:
        'Obtained from borrowings any part of the deposit or the balance required to complete this transaction? If so provide details below.',
      type: 'checkbox',
      formControlName: 'borrowingDeposit',
    },

    {
      question:
        'Submitted any application in respect of this loan to any other person or to any other lender? If so provide details below including the decision',
      type: 'checkbox',
      formControlName: 'anotherLender',
    },

    {
      question: 'Guaranteed a loan?',
      type: 'checkbox',
      formControlName: 'guaranteedLoan',
    },

    {
      question:
        'Do you expect any significant change to your financial situation over the foreseable future that would ADVERSELY impact your ability to meet loan repayments or reduce your income as stated in this application',
      type: 'checkbox',
      formControlName: 'adverseChange',
    },
  ];

  userTokenValue!: string;
  activeApplicantDetails!: FormGroup;
  isResendVisible: boolean = false;
  timer: any;
  isOtpValid: boolean = false;
  otpValue!: number;
  applicantId: string | null = '';

  fonts: any = signatureFontsJson;
  signatureFontFamilyKey: string = this.fonts[0].key;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private clientDeclarationService: ClientDeclarationService
  ) {}

  ngOnInit(): void {
  
    this.applicantId =  this.activatedRoute.snapshot.queryParamMap.get('id');

    this.activeApplicantDetails = this.createClientDeclarationFormGroup(this.applicantId!!)    

    this.timer = setTimeout(this.toggleResendText.bind(this), 30000);
  }

  saveData() {

    if (this.activeApplicantDetails.valid) {
      this.clientDeclarationService.sendDataByApplicantId(this.applicantId!!, this.activeApplicantDetails)
    }
  }

  updateValues(data: any) {

    Object.entries(data).forEach((k) => {
      
      if (k[0] == 'applicantSignature' && k[1] == '' ) {
        this.activeApplicantDetails?.get(k[0])?.setValue(this.signatureFontFamilyKey) 
      }else {
        this.activeApplicantDetails?.get(k[0])?.setValue(k[1]) 
      }
      
    })

    console.log(this.activeApplicantDetails.value)
     
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  @ViewChild('ngOtpInput', { static: false }) ngOtpInput: any;

  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    },
  };

  onValidate = () => {
    if (this.otpValue == 789101) {
      this.isOtpValid = true;
      this.isResendVisible = false;
      this.clientDeclarationService.fetchDataByApplicantId(this.applicantId!!).subscribe(res => {
        this.updateValues(res.data)
    })
      clearTimeout(this.timer);
    } else {
      this.timer = setTimeout(this.toggleResendText.bind(this), 30000);
      this.isOtpValid = false;
    }
  };

  onOtpChange(otp: any) {
    this.otpValue = otp;
  }

  toggleResendText() {
    this.isResendVisible = !this.isResendVisible;
  }

  onResendClick() {
    this.isResendVisible = false;
    this.timer = setTimeout(this.toggleResendText.bind(this), 30000);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ClientDeclarationDialogContent, {
      width: '60vw',
      height: '95vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  createClientDeclarationFormGroup(applicantId: String): FormGroup {
    let clientDeclarationFormGroup = this.formBuilder.group({
      unsatisfiedJudgement: [null, Validators.required],
      unsatisfiedJudgementIfYes: [''],
      legalAction: [null, Validators.required],
      legalActionIfYes: [''],
      declaredBankrupt: [null, Validators.required],
      declaredBankruptIfYes: [''],
      bankruptDischargeDate: [''],
      shareHolderOrOfficer: [null, Validators.required],
      shareHolderOrOfficerIfYes: [''],
      borrowingDeposit: [null, Validators.required],
      borrowingDepositIfYes: [''],
      anotherLender: [null, Validators.required],
      anotherLenderIfYes: [''],
      guaranteedLoan: [null, Validators.required],
      guaranteedLoanIfYes: [''],
      adverseChange: [null, Validators.required],
      adverseChangeIfYes: [''],
      ifYesDetails: [''],
      applicantNameChange: [false, Validators.required],
      applicantReasonForFormerName: [''],
      applicantDateOfNameChange: [''],
      delivery: ['', Validators.required],
      confirmCheckBox: [false, Validators.requiredTrue],
      over18CheckBox: [false, Validators.requiredTrue],
      eSignatureCheckBox: [false, Validators.requiredTrue],
      applicantSignature: [''],
      applicantFirstName: [''],
      applicantMiddleName: [''],
      applicantLastName: [''],
      applicantEmailAddress: [''],
      applicantSignDate: [''],
      applicantExpiredDate: [''],
      applicantEmailSentDate: [''],
      applicantId: [applicantId],
      loanApplicationId: [''],
      id: [''],
      declarationStatus: ['']
    });


    clientDeclarationFormGroup.valueChanges.subscribe(newVal => {
      const {unsatisfiedJudgement, 
        legalAction, 
        declaredBankrupt, 
        shareHolderOrOfficer, 
        borrowingDeposit, 
        anotherLender,
        guaranteedLoan, 
        adverseChange,
        applicantNameChange
      } = newVal;


        unsatisfiedJudgement ? 
            this.activeApplicantDetails?.get(`${unsatisfiedJudgement}IfYes`)?.setValidators(Validators.required): 
            this.activeApplicantDetails?.get(`${unsatisfiedJudgement}IfYes`)?.clearValidators()

        shareHolderOrOfficer ? 
            this.activeApplicantDetails?.get(`${shareHolderOrOfficer}IfYes`)?.setValidators(Validators.required): 
            this.activeApplicantDetails?.get(`${shareHolderOrOfficer}IfYes`)?.clearValidators()

        legalAction ? 
            this.activeApplicantDetails?.get(`${legalAction}IfYes`)?.setValidators(Validators.required): 
            this.activeApplicantDetails?.get(`${legalAction}IfYes`)?.clearValidators()

        borrowingDeposit ? 
            this.activeApplicantDetails?.get(`${borrowingDeposit}IfYes`)?.setValidators(Validators.required): 
            this.activeApplicantDetails?.get(`${borrowingDeposit}IfYes`)?.clearValidators()

        anotherLender ? 
            this.activeApplicantDetails?.get(`${anotherLender}IfYes`)?.setValidators(Validators.required): 
            this.activeApplicantDetails?.get(`${anotherLender}IfYes`)?.clearValidators()

        guaranteedLoan ? 
            this.activeApplicantDetails?.get(`${guaranteedLoan}IfYes`)?.setValidators(Validators.required): 
            this.activeApplicantDetails?.get(`${guaranteedLoan}IfYes`)?.clearValidators()

        adverseChange ? 
            this.activeApplicantDetails?.get(`${adverseChange}IfYes`)?.setValidators(Validators.required): 
            this.activeApplicantDetails?.get(`${adverseChange}IfYes`)?.clearValidators()

        
        if (applicantNameChange) {
          this.activeApplicantDetails?.get('applicantReasonForFormerName')?.setValidators(Validators.required)
          this.activeApplicantDetails?.get('applicantDateOfNameChange')?.setValidators(Validators.required)
        }else {
          this.activeApplicantDetails?.get('applicantReasonForFormerName')?.clearValidators()
          this.activeApplicantDetails?.get('applicantDateOfNameChange')?.clearValidators()
        }

        if (declaredBankrupt) {
          this.activeApplicantDetails?.get(`${declaredBankrupt}IfYes`)?.setValidators(Validators.required)
          this.activeApplicantDetails?.get('bankruptDischargeDate')?.setValidators(Validators.required)
        }else {
          this.activeApplicantDetails?.get(`${declaredBankrupt}IfYes`)?.clearValidators()
          this.activeApplicantDetails?.get('bankruptDischargeDate')?.setValidators(Validators.required)
        }  
    })

    return clientDeclarationFormGroup;
  }
}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./digital-signature.component.css'],
})
export class ClientDeclarationDialogContent {
  constructor() {}

  pdfSrc = '/assets/docs/MortgageEzyPrivacyPolicy-20210322.pdf';
}
