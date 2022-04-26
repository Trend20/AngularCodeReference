import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broker-review',
  templateUrl: './broker-review.component.html',
  styleUrls: ['./broker-review.component.css']
})
export class BrokerReviewComponent implements OnInit {

  brokerReviewFormGroup!: FormGroup;


  reviewQuestions: any[] =[
    {
      content: 'Override and retain product?(Must have account manager approval)',
      formControlNameValue: 'overrideAndRetainProduct'
    },
    {
      content: 'Change products and continue for assessment?',
      formControlNameValue: 'changeProducts'
    },
    {
      content: 'Withdraw the loan application?',
      formControlNameValue: 'withdrawLoanApplication'
    },
    {
      content: 'Pend loan for review?',
      formControlNameValue: 'pendLoanApplication'
    }
  ]

  constructor(private formBuilder: FormBuilder, private router: Router) { }


  ngOnInit(): void {

    this.brokerReviewFormGroup = this.formBuilder.group({
      overrideAndRetainProduct: ['', Validators.required],
      changeProducts: ['', Validators.required],
      withdrawLoanApplication: ['', Validators.required],
      receivedPreapproval: ['', Validators.required],
      firstBrokerNotes: ['', Validators.required],
      secondBrokerNotes: ['', Validators.required],
      pendLoanApplication: ['', Validators.required]
    })

    this.brokerReviewFormGroup.get('overrideAndRetainProduct')?.valueChanges.subscribe(newVal =>{
      if(newVal === "Yes"){
        this.brokerReviewFormGroup.get('changeProducts')?.setValue('No');
        this.brokerReviewFormGroup.get('withdrawLoanApplication')?.setValue('No');
        this.brokerReviewFormGroup.get('pendLoanApplication')?.setValue('No');
      }
    })

    this.brokerReviewFormGroup.get('changeProducts')?.valueChanges.subscribe(newVal =>{
      if(newVal === "Yes"){
        this.brokerReviewFormGroup.get('overrideAndRetainProduct')?.setValue('No');
        this.brokerReviewFormGroup.get('withdrawLoanApplication')?.setValue('No');
        this.brokerReviewFormGroup.get('pendLoanApplication')?.setValue('No');
      }
    })

    this.brokerReviewFormGroup.get('withdrawLoanApplication')?.valueChanges.subscribe(newVal =>{
      if(newVal === "Yes"){
        this.brokerReviewFormGroup.get('changeProducts')?.setValue('No');
        this.brokerReviewFormGroup.get('overrideAndRetainProduct')?.setValue('No');
        this.brokerReviewFormGroup.get('pendLoanApplication')?.setValue('No');
      }
    })

    this.brokerReviewFormGroup.get('pendLoanApplication')?.valueChanges.subscribe(newVal =>{
      if(newVal === "Yes"){
        this.brokerReviewFormGroup.get('changeProducts')?.setValue('No');
        this.brokerReviewFormGroup.get('overrideAndRetainProduct')?.setValue('No');
        this.brokerReviewFormGroup.get('withdrawLoanApplication')?.setValue('No');
        this.router.navigate(['/home/inProgress']);
      }
    })
  }


  sendMail(){
    // window.location.assign("mailto:xyz@abc.com");
    window.open('mailto:xyz@abc.com');
  }

}
