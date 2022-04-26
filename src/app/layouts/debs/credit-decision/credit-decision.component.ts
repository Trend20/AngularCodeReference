import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import printJS from 'print-js'
import { GenerateDoc, SubAccount } from '../models/generate-doc-model';
import { LoanDetailPage } from '../models/LoanDetailModelPageRevised';
import { PersonalDetailPage } from '../models/personal-detail-model-revised';
import { CloudDocsService } from '../services/cloud-docs.service';
import { LoanDetailService } from '../services/loan-detail.service';
import { ServiceAbilityService } from '../services/service-ability.service';

@Component({
  selector: 'app-credit-decision',
  templateUrl: './credit-decision.component.html',
  styleUrls: ['./credit-decision.component.css']
})
export class CreditDecisionComponent implements OnInit {


  // @Input() serviceabilityFormGroup ?: FormGroup;

  @Input() preApproval?: string;
  @Input() isExpress?: boolean;

  personalDetailData: PersonalDetailPage | undefined;
  loanDetailData: LoanDetailPage | undefined;
  currentBrokerName: string | undefined;
  currentBrokerNumber: number | undefined;
  currentSecurityAddress: string | undefined;

  approvalQuestions: any[] =[
    {
      question: 'Receipt of satisfactory supporting documents to validate the information submitted.'
    },
    {
      question: 'Subject to receipt and review of a satisfactory valuation report suitable for mortgage landing.'
    },
    {
      question: 'Formal Approval by the Funder.'
    }
  ]

  preApprovalQuestions: any[] = [
    {
      question: 'Subject to the security property being satisfactory to the Bank.'
    },
    {
      question: 'Receipt of satisfactory supporting documents to validate the information submitted.'
    },
    {
      question: 'Subject to receipt and review of a satisfactory valuation report suitable for mortgage landing.'
    },
    {
      question: 'Formal Approval by the Funder.'
    }
  ]

  // upload functionality
  fileName = '';
  creditDecisionFormGroup!: FormGroup;

    constructor(private http: HttpClient, private formBuilder: FormBuilder, private cloudDocsService: CloudDocsService, private serviceAbilityService: ServiceAbilityService, private loanDetailService: LoanDetailService) {}

    onFileSelected(event: any) {

        const file:File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("thumbnail", file);

            const upload$ = this.http.post("/api/thumbnail-upload", formData);

            upload$.subscribe();
        }
    }
  // print functionality
  printConditionalLetter(){
    printJS({
      printable: '',
      type: 'pdf',
      showModal: true
   })
  }

  printFormalLetter(){
    printJS({
      printable: '',
      type: 'pdf',
      showModal: true
   })
  }

  printPreApprovalLetter(){
    printJS({
      printable: '',
      type: 'pdf',
      showModal: true
   })
  }

  ngOnInit(): void {


    this.creditDecisionFormGroup = this.formBuilder.group({

    });

    this.serviceAbilityService.getCurrentPersonalDetailPageData().subscribe(res => {
      console.log(res)
      this.personalDetailData = res
    })
    this.serviceAbilityService.getCurrentLoanDetailPageData().subscribe(res => {
      console.log(res)
      this.loanDetailData = res
    })

    this.serviceAbilityService.currentBrokerName.subscribe(res => {
      this.currentBrokerName = res
    })

    this.serviceAbilityService.currentBrokerNumber.subscribe(res => {
      this.currentBrokerNumber = res
    })

    this.serviceAbilityService.currentSecurityAddress.subscribe(res => {
      this.currentSecurityAddress = res
    })



  }


  getDocument() {

    console.log(this.loanDetailData)
    console.log(this.personalDetailData)

    let subAccounts: SubAccount []= this.loanDetailData?.subAccountList as unknown as SubAccount[];

    // const modifyApplicantList = this.personalDetailData?.applicantList.map((curr, idx) => {
    //   let firstName = curr['firstName']
    //   let middleName = curr['middleName']
    //   let lastName = curr['lastName']

    //   return {
    //     ...curr,
    //     fullName:`${firstName} ${middleName} ${lastName}`
    //   }
    // })

    let applicantNames: string | undefined = '';
    let totalLoan: number = 0;

    for (let val of this.loanDetailData?.subAccountList!!) {
      totalLoan += parseInt(val?.loanAmount.toString())
    }

    for (let val of this.personalDetailData?.applicantList!! ) {
      applicantNames += val.firstName + ' ' + val.middleName + ' ' + val.lastName
    }

    console.log(subAccounts)
    

       let data: GenerateDoc = {
      applicantName: applicantNames,
      date: `${new Date()}`,
      applicationNumber: this.loanDetailData?.applicationNumber,
      documentType: 'xxx',
      brokerName: this.currentBrokerName,
      brokerNumber: this.currentBrokerNumber,
      loanApprovalStatus: true,
      totalLoanAmount: totalLoan,
      securityAddress: this.currentSecurityAddress,
      securityTitle: 'xxxx',
      subAccountList: subAccounts,
    }
    // let subAccounts: SubAccount = {
    //   accountName: string | undefined;
    //   loanAmount: number;
    //   loanValueRatio: number;
    //   termInYears: number;
    //   offSet: string | undefined;
    //   paymentType: string | undefined;
    //   loanPurpose: string | undefined;
    //   formalApprovalId: string | undefined;
    // }
 
    
  
    this.cloudDocsService.generateFileOnApproval('conditional', data).subscribe(res => {
     console.log(res);
    }, err => {
      console.log(err)
    })
  }

}
