import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SendEmailModel } from '../models/send-email-model';
import { EmailTriggerService } from '../services/email-trigger.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-client-declaration',
  templateUrl: './client-declaration.component.html',
  styleUrls: ['./client-declaration.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ClientDeclarationComponent implements OnInit {
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

  constructor(
    public dialog: MatDialog,
    private emailTriggerService: EmailTriggerService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  private _clientDeclarationFormGroup!: FormGroup;
  electronicDeliveryList = ['Applicants', 'Solicitor', 'Broker'];
  documentsPostList = ['My current address', 'My Solicitor'];
  private declarationDetailList!: FormArray;

  activeApplicantDetails!: FormGroup;

  activeIndex: number = 0;

  emailSendLoading: boolean = false;
  activeButtonIndex: any =null;

  @Input()
  set clientDeclarationFormGroup(value: FormGroup) {
    this._clientDeclarationFormGroup = value;
    this.declarationDetailList = value.get(
      'declarationDetailList'
    ) as FormArray;
    this.activeApplicantDetails = this.declarationDetailList.at(0) as FormGroup;
  }

  get clientDeclarationFormGroup(): FormGroup {
    return this._clientDeclarationFormGroup;
  }

  onApplicantSelectorClick($event: any, i: any) {
    // this.declarationDetailList
    //   .at(i)
    //   .patchValue({ ...this.activeApplicantDetails?.value });
    this.activeApplicantDetails = this.declarationDetailList.at(i) as FormGroup;
    this.activeIndex = i;
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

  sendEmail(activeApplicantDetails: any, i: any,buttonIndex:number) {
    let id = this.router.url.split('/').pop();

    let sendEmailModel: SendEmailModel = {
      recipient: i.applicantEmailAddress,
      name: i.applicantFirstName,
      applicantId: i.applicantId,
      loanId: id!!,
      middleName: i.applicantMiddleName,
      lastName: i.applicantLastName,
    };

    this.emailSendLoading = true;
    this.activeButtonIndex=buttonIndex;

    this.emailTriggerService.sendEmail(sendEmailModel).subscribe(
      (val) => {
        setTimeout(() => {
          this.emailSendLoading = false;
          this.activeButtonIndex=null;
        }, 1000);
       
        if (val.data.status != 200) {
          //TODO: Add error display or something
        } else {
          this.activeApplicantDetails = this.declarationDetailList.at(
            i
          ) as FormGroup;

          let today = Date.now().toLocaleString();

          this.activeApplicantDetails
            .get('applicantEmailSentDate')
            ?.setValue(today);
        }
      },
      (error) => {
        console.log(error);
        this.emailSendLoading = false;
      }
    );
  }
}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog-content.html',
  styleUrls: ['./client-declaration.component.css'],
})
export class ClientDeclarationDialogContent {
  constructor() {}

  pdfSrc = '/assets/docs/MortgageEzyPrivacyPolicy-20210322.pdf';
}
